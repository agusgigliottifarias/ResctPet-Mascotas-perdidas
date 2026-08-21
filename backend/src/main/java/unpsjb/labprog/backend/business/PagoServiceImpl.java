package unpsjb.labprog.backend.business;

import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.*;
import unpsjb.labprog.backend.model.dto.*;
import unpsjb.labprog.backend.model.enums.*;
import unpsjb.labprog.backend.repository.*;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PagoServiceImpl implements PagoService {

    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;
    private final TicketRepository ticketRepository;

    private final PagoValidatorService pagoValidatorService;
    private final PagoTicketService pagoTicketService;
    private final PagoSplitService pagoSplitService;
    private final PagoHistorialService pagoHistorialService;
    private final EventoSplitPagoService eventoSplitPagoService;
    private final PagoResponseMapper pagoResponseMapper;
    private final PagoFallidoService pagoFallidoService;

    @Override
    @Transactional(noRollbackFor = PagoFallidoException.class)
    public PagoResponseDTO procesarPago(PagoRequestDTO request) {

        try {
            pagoValidatorService.validarCamposObligatorios(request);

            Pedido pedido = pedidoRepository.findByCodigo(request.getCodigoPedido())
                    .orElseThrow(() -> conflicto("PEDIDO_NO_ENCONTRADO"));

            pagoValidatorService.validarPropiedadPedido(pedido, request.getEmailConsumidor());
            pagoValidatorService.validarRestaurante(pedido);
            pagoValidatorService.validarPagoDuplicado(pedido);
            pagoValidatorService.validarPedidoPagable(pedido);
            pagoValidatorService.validarMonto(pedido, request);
            pagoValidatorService.validarMetodoPago(request);

            if (pagoFallidoService.esPagoRechazado(request)) {
                pagoFallidoService.manejarPagoFallido(
                        pedido,
                        request,
                        "CONFLICTO - PAGO_RECHAZADO"
                );
            }

            if (pagoFallidoService.esErrorProveedor(request)) {
                pagoFallidoService.manejarPagoFallido(
                        pedido,
                        request,
                        "CONFLICTO - ERROR_PROVEEDOR_PAGO"
                );
            }

            if (request.getAccion() == AccionPago.CAPTURAR) {

                pagoTicketService.validarTicketDuplicado(pedido);

                List<SplitPago> splits = pagoSplitService.calcularSplits(
                        pedido,
                        request.getMonto()
                );

                Pago pago = registrarPagoEnBD(
                        pedido,
                        request,
                        EstadoPago.CAPTURADO,
                        splits
                );

                pagoSplitService.validarSplits(pago);

                pago = pagoRepository.save(pago);

                eventoSplitPagoService.registrar(
                        pago.getCodigo(),
                        pedido.getCodigo(),
                        "SplitPagoGenerado",
                        "Split generado al capturar pago"
                );

                Ticket ticket = pagoTicketService.crearTicketDeCocina(
                        pedido,
                        request
                );

                pedido.setMotivoRechazo(null);
                pedido.setDetalleMotivoRechazo(null);
                pedido.setFechaHoraRechazo(null);
                pedido.setEstado(EstadoPedido.APROBADO);

                pedidoRepository.save(pedido);
                pagoHistorialService.actualizarHistorialPedido(pedido);

                return pagoResponseMapper.toDTO(pago, pedido, ticket);
            }

            Pago pagoAutorizado = registrarPagoEnBD(
                    pedido,
                    request,
                    EstadoPago.AUTORIZADO,
                    new ArrayList<>()
            );

            return pagoResponseMapper.toDTO(pagoAutorizado, pedido, null);

        } catch (OptimisticLockException | DataIntegrityViolationException e) {
            throw conflicto("OPERACION_CONCURRENTE");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PagoResponseDTO obtenerPago(String codigoPago) {

        Pago pago = pagoRepository.findByCodigo(codigoPago)
                .orElseThrow(() -> conflicto("PAGO_NO_ENCONTRADO"));

        Pedido pedido = pedidoRepository.findById(pago.getIdPedido())
                .orElseThrow(() -> conflicto("PEDIDO_NO_ENCONTRADO"));

        Ticket ticket = ticketRepository.findByIdPedido(pedido.getIdPedido())
                .orElse(null);

        return pagoResponseMapper.toDTO(pago, pedido, ticket);
    }

    @Override
    @Transactional
    public void procesarReembolso(UUID idPedido) {

        Pago pago = pagoRepository.findByIdPedido(idPedido)
                .orElseThrow(() -> conflicto("PAGO_NO_ENCONTRADO"));

        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> conflicto("PEDIDO_NO_ENCONTRADO"));

        pago.setEstado(EstadoPago.REEMBOLSO_PENDIENTE);

        pago.getSplits().forEach(split -> {
            split.setLiquidable(false);
            split.setFechaLiquidable(null);
        });

        pagoRepository.save(pago);

        eventoSplitPagoService.registrar(
                pago.getCodigo(),
                pedido.getCodigo(),
                "SplitPagoRevertido",
                "Splits revertidos por reembolso"
        );
    }

    @Override
    @Transactional
    public PagoResponseDTO reembolsarPago(String codigoPago) {

        Pago pago = pagoRepository.findByCodigo(codigoPago)
                .orElseThrow(() -> conflicto("PAGO_NO_ENCONTRADO"));

        Pedido pedido = pedidoRepository.findById(pago.getIdPedido())
                .orElseThrow(() -> conflicto("PEDIDO_NO_ENCONTRADO"));

        procesarReembolso(pedido.getIdPedido());

        pago = pagoRepository.findByCodigo(codigoPago)
                .orElseThrow(() -> conflicto("PAGO_NO_ENCONTRADO"));

        Ticket ticket = ticketRepository.findByIdPedido(pedido.getIdPedido())
                .orElse(null);

        return pagoResponseMapper.toDTO(pago, pedido, ticket);
    }

    private Pago registrarPagoEnBD(
            Pedido pedido,
            PagoRequestDTO request,
            EstadoPago estado,
            List<SplitPago> splits
    ) {
        Pago pago = new Pago();

        pago.setIdPago(UUID.randomUUID());
        pago.setCodigo("P-" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase());

        pago.setIdPedido(pedido.getIdPedido());
        pago.setEmailConsumidor(request.getEmailConsumidor());
        pago.setMonto(request.getMonto());
        pago.setMetodo(request.getMetodo());
        pago.setAccion(request.getAccion());
        pago.setEstado(estado);
        pago.setFechaAutorizacion(Instant.now());

        if (estado == EstadoPago.RECHAZADO) {
            pago.setCodigoMotivo("PAGO_FALLIDO");

            if (request.getSimulacion() != null) {
                pago.setDetalleMotivo(
                        String.valueOf(request.getSimulacion().get("detalleMotivo"))
                );
            }
        }

        pago.setSplits(splits != null ? splits : new ArrayList<>());

        return pagoRepository.save(pago);
    }

    @Override
    @Transactional
    public PagoResponseDTO ejecutarSplit(String codigoPago) {

        Pago pago = pagoRepository.findByCodigo(codigoPago)
                .orElseThrow(() -> conflicto("PAGO_NO_ENCONTRADO"));

        Pedido pedido = pedidoRepository.findById(pago.getIdPedido())
                .orElseThrow(() -> conflicto("PEDIDO_NO_ENCONTRADO"));

        if (pago.getEstado() != EstadoPago.CAPTURADO) {
            throw conflicto("SPLIT_NO_EJECUTABLE");
        }

        if (pedido.getEstado() == EstadoPedido.CANCELADO
                || pedido.getEstado() == EstadoPedido.RECHAZADO) {
            throw conflicto("SPLIT_NO_EJECUTABLE");
        }

        Ticket ticket = ticketRepository.findByIdPedido(pedido.getIdPedido())
                .orElse(null);

        if (pago.getSplits() != null && !pago.getSplits().isEmpty()) {

            PagoResponseDTO response = pagoResponseMapper.toDTO(
                    pago,
                    pedido,
                    ticket
            );

            response.setIdempotente(true);

            return response;
        }

        List<SplitPago> splits = pagoSplitService.calcularSplits(
                pedido,
                pago.getMonto()
        );

        pago.setSplits(splits);

        pagoSplitService.validarSplits(pago);

        pago = pagoRepository.save(pago);

        eventoSplitPagoService.registrar(
                pago.getCodigo(),
                pedido.getCodigo(),
                "SplitPagoGenerado",
                "Split generado manualmente"
        );

        return pagoResponseMapper.toDTO(pago, pedido, ticket);
    }

    private RuntimeException conflicto(String mensaje) {
        return new RuntimeException("CONFLICTO - " + mensaje);
    }
}