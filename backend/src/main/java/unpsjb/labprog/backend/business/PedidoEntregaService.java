package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Pago;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Repartidor;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.EstadoPago;
import unpsjb.labprog.backend.model.enums.EstadoPedido;
import unpsjb.labprog.backend.model.enums.EstadoRepartidor;
import unpsjb.labprog.backend.model.enums.EstadoTicket;
import unpsjb.labprog.backend.repository.EntregaRepository;
import unpsjb.labprog.backend.repository.PagoRepository;
import unpsjb.labprog.backend.repository.PedidoRepository;
import unpsjb.labprog.backend.repository.RepartidorRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PedidoEntregaService {

    private final EntregaRepository entregaRepository;
    private final PedidoRepository pedidoRepository;
    private final RepartidorRepository repartidorRepository;
    private final PedidoCodeGenerator pedidoCodeGenerator;
    private final PedidoValidator pedidoValidator;
    private final PagoLiquidacionService pagoLiquidacionService;
    private final PagoRepository pagoRepository;
    private final EntregaEtaService entregaEtaService;
    private final NotificacionEtaService notificacionEtaService;
    private final CuentaRestauranteService cuentaRestauranteService;

    @Transactional
    public Entrega asignarRepartidor(
            Pedido pedido,
            Ticket ticket,
            String codigoRepartidor
    ) {

        if (ticket.getEstado() != EstadoTicket.TOMADO
                && ticket.getEstado() != EstadoTicket.EN_PREPARACION
                && ticket.getEstado() != EstadoTicket.LISTO) {

            throw conflicto("PEDIDO_NO_DISPONIBLE_PARA_REPARTO");
        }

        Repartidor repartidor = repartidorRepository
                .findByCodigo(codigoRepartidor)
                .orElseThrow(() -> conflicto("REPARTIDOR_NO_ENCONTRADO"));

        if (repartidor.getEstado() != EstadoRepartidor.EN_LINEA) {
            throw conflicto("REPARTIDOR_NO_DISPONIBLE");
        }

        entregaRepository
                .findByIdPedido(pedido.getIdPedido())
                .ifPresent(entrega -> {
                    throw conflicto("ENTREGA_YA_ASIGNADA");
                });

        Entrega entrega = new Entrega();

        entrega.setIdEntrega(UUID.randomUUID());
        entrega.setCodigo(pedidoCodeGenerator.generarCodigoEntrega(pedido));
        entrega.setIdPedido(pedido.getIdPedido());
        entrega.setEstado(EstadoEntrega.ASIGNADA);
        entrega.setRepartidor(repartidor);

        repartidor.setEstado(EstadoRepartidor.OCUPADO);

        entregaRepository.save(entrega);
        repartidorRepository.save(repartidor);

        entregaEtaService.calcularEta(
                entrega.getCodigo(),
                Instant.now(),
                null,
                true,
                true
        );

        entrega = entregaRepository
                .findByCodigo(entrega.getCodigo())
                .orElse(entrega);

        if (ticket.getListoPara() != null
                && entrega.getDuracionEstimadaSegundos() != null) {

            entrega.setTiempoEstimadoArribo(
                    ticket.getListoPara()
                            .plusSeconds(entrega.getDuracionEstimadaSegundos())
            );

            entregaRepository.save(entrega);
        }

        notificacionEtaService.procesarEvento(
                "EntregaAsignada",
                "EVT-" + entrega.getCodigo() + "-" + System.currentTimeMillis(),
                pedido.getCodigo(),
                entrega.getCodigo(),
                repartidor.getCodigo(),
                repartidor.getNombre(),
                EstadoEntrega.ASIGNADA.name(),
                Instant.now(),
                entrega.getTiempoEstimadoArribo(),
                null,
                null
        );

        return entregaRepository
                .findByCodigo(entrega.getCodigo())
                .orElse(entrega);
    }

    @Transactional
    public Entrega tomarPedido(
            Entrega entrega,
            String codigoRepartidor
    ) {

        pedidoValidator.validarRepartidorAsignado(entrega, codigoRepartidor);

        if (entrega.getEstado() != EstadoEntrega.ACEPTADA) {
            throw conflicto("EL_PEDIDO_NO_FUE_ACEPTADO_POR_EL_REPARTIDOR");
        }

        entrega.setEstado(EstadoEntrega.EN_LOCAL);
        entregaRepository.save(entrega);

        entregaEtaService.calcularEta(
                entrega.getCodigo(),
                Instant.now(),
                null,
                true,
                true
        );

        return entregaRepository
                .findByCodigo(entrega.getCodigo())
                .orElse(entrega);
    }

    @Transactional
    public Entrega retirarPedido(
            Pedido pedido,
            Entrega entrega,
            Ticket ticket,
            String codigoRepartidor
    ) {

        pedidoValidator.validarRepartidorAsignado(entrega, codigoRepartidor);

        if (entrega.getEstado() != EstadoEntrega.EN_LOCAL) {
            throw conflicto("REPARTIDOR_NO_ESTA_EN_EL_LOCAL");
        }

        if (ticket.getEstado() != EstadoTicket.LISTO) {
            throw conflicto("PEDIDO_NO_ESTA_LISTO");
        }

        entrega.setEstado(EstadoEntrega.EN_TRAYECTO);
        pedido.setEstado(EstadoPedido.EN_CAMINO);

        entregaRepository.save(entrega);
        pedidoRepository.save(pedido);

        entregaEtaService.calcularEta(
                entrega.getCodigo(),
                Instant.now(),
                null,
                true,
                true
        );

        notificacionEtaService.procesarEvento(
                "EntregaEnTrayecto",
                "EVT-" + entrega.getCodigo() + "-" + System.currentTimeMillis(),
                pedido.getCodigo(),
                entrega.getCodigo(),
                null,
                null,
                EstadoEntrega.EN_TRAYECTO.name(),
                Instant.now(),
                entrega.getTiempoEstimadoArribo(),
                null,
                null
        );

        return entregaRepository
                .findByCodigo(entrega.getCodigo())
                .orElse(entrega);
    }

    @Transactional
    public void entregarPedido(
            Pedido pedido,
            Entrega entrega,
            Repartidor repartidor,
            String codigoRepartidor
    ) {

        pedidoValidator.validarRepartidorAsignado(entrega, codigoRepartidor);

        if (entrega.getEstado() == EstadoEntrega.ASIGNADA
                || entrega.getEstado() == EstadoEntrega.ACEPTADA
                || entrega.getEstado() == EstadoEntrega.EN_LOCAL) {
            throw conflicto("ESTADO_ENTREGA_NO_PERMITE_ENTREGA");
        }

        if (entrega.getEstado() == EstadoEntrega.FALLIDA
                || entrega.getEstado() == EstadoEntrega.ENTREGADA) {
            throw conflicto("ENTREGA_YA_FINALIZADA");
        }

        if (entrega.getEstado() != EstadoEntrega.EN_TRAYECTO) {
            throw conflicto("TRANSICION_ENTREGA_INVALIDA");
        }

        Pago pago = pagoRepository
                .findByIdPedido(pedido.getIdPedido())
                .orElseThrow(() -> conflicto("PAGO_NO_CAPTURADO"));

        if (pago.getEstado() != EstadoPago.CAPTURADO) {
            throw conflicto("PAGO_NO_CAPTURADO");
        }

        if (repartidor.getEstado() == EstadoRepartidor.EN_LINEA
                && entrega.getEstado() != EstadoEntrega.ENTREGADA
                && entrega.getEstado() != EstadoEntrega.FALLIDA) {
            throw conflicto("ESTADO_REPARTIDOR_INCONSISTENTE");
        }

        pagoLiquidacionService.validarHonorarioRepartidor(pedido);

        if (pedido.getEstado() == EstadoPedido.ENTREGADO
                || pedido.getEstado() == EstadoPedido.CANCELADO
                || pedido.getEstado() == EstadoPedido.RECIBIDO) {
            throw conflicto("PEDIDO_YA_FINALIZADO");
        }

        entrega.setEstado(EstadoEntrega.ENTREGADA);
        entrega.setFechaHoraEntregaReal(Instant.now());

        repartidor.setEstado(EstadoRepartidor.EN_LINEA);
        pedido.setEstado(EstadoPedido.ENTREGADO);

        try {
            entregaRepository.save(entrega);
            pedidoRepository.save(pedido);
            repartidorRepository.save(repartidor);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw conflicto("OPERACION_CONCURRENTE");
        }

        pagoLiquidacionService.marcarHonorarioLiquidable(
                pedido,
                repartidor.getCodigo()
        );

        registrarVentaRestaurante(pedido, pago);

        notificacionEtaService.procesarEvento(
                "EntregaEntregada",
                "EVT-" + entrega.getCodigo() + "-" + System.currentTimeMillis(),
                pedido.getCodigo(),
                entrega.getCodigo(),
                null,
                null,
                EstadoEntrega.ENTREGADA.name(),
                Instant.now(),
                null,
                null,
                null
        );
    }

    private void registrarVentaRestaurante(
            Pedido pedido,
            Pago pago
    ) {

        pago.getSplits()
                .stream()
                .filter(split -> "RESTAURANTE".equals(split.getDestino()))
                .findFirst()
                .ifPresent(split ->
                        cuentaRestauranteService.registrarVenta(
                                pedido.getRestaurante().getCodigo(),
                                pedido.getCodigo(),
                                split
                        )
                );
    }

    private ResponseStatusException conflicto(String mensaje) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }

}