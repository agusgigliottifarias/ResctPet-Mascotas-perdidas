package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import unpsjb.labprog.backend.model.*;
import unpsjb.labprog.backend.model.dto.PedidoResponseDTO;
import unpsjb.labprog.backend.model.enums.*;
import unpsjb.labprog.backend.repository.EntregaRepository;
import unpsjb.labprog.backend.repository.RepartidorRepository;
import unpsjb.labprog.backend.repository.TicketRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoRepartidorWorkflowService {

    private final TicketRepository ticketRepository;
    private final EntregaRepository entregaRepository;
    private final RepartidorRepository repartidorRepository;

    private final PedidoFinder pedidoFinder;
    private final PedidoEntregaService pedidoEntregaService;
    private final SeleccionRepartidorService seleccionRepartidorService;
    private final HistorialPedidoService historialPedidoService;
    private final PedidoEventoService pedidoEventoService;
    private final PedidoResponseMapper pedidoResponseMapper;

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPedidosParaRepartir() {

        List<EstadoTicket> estadosDisponibles = List.of(
                EstadoTicket.TOMADO,
                EstadoTicket.EN_PREPARACION,
                EstadoTicket.LISTO
        );

        return ticketRepository
                .findByEstadoIn(estadosDisponibles)
                .stream()
                .map(ticket -> {

                    Pedido pedido = pedidoFinder.buscarPedidoExistente(
                            ticket.getIdPedido()
                    );

                    boolean yaAsignado = entregaRepository
                            .findByIdPedido(pedido.getIdPedido())
                            .isPresent();

                    if (yaAsignado) {
                        return null;
                    }

                    return mapToResponseDTO(pedido, ticket, null);
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPedidosDeRepartidor(String codigoRepartidor) {

        return entregaRepository
                .findByRepartidor_Codigo(codigoRepartidor)
                .stream()
                .filter(entrega ->
                        entrega.getEstado() == EstadoEntrega.ASIGNADA
                                || entrega.getEstado() == EstadoEntrega.ACEPTADA
                                || entrega.getEstado() == EstadoEntrega.EN_LOCAL
                                || entrega.getEstado() == EstadoEntrega.EN_TRAYECTO
                )
                .map(entrega -> {

                    Pedido pedido = pedidoFinder.buscarPedidoExistente(
                            entrega.getIdPedido()
                    );

                    Ticket ticket = pedidoFinder.buscarTicketOpcional(
                            pedido.getIdPedido()
                    );

                    return mapToResponseDTO(pedido, ticket, entrega);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public PedidoResponseDTO asignarRepartidor(
            String codigoPedido,
            String codigoRepartidor
    ) {

        Pedido pedido = pedidoFinder.buscarPedidoExistente(codigoPedido);

        Ticket ticket = pedidoFinder.buscarTicketExistente(
                pedido.getIdPedido()
        );

        if (codigoRepartidor == null || codigoRepartidor.isBlank()) {
            codigoRepartidor = seleccionRepartidorService
                    .seleccionar()
                    .getCodigo();
        }

        Entrega entrega = pedidoEntregaService.asignarRepartidor(
                pedido,
                ticket,
                codigoRepartidor
        );

        return mapToResponseDTO(pedido, ticket, entrega);
    }

    @Transactional
    public PedidoResponseDTO aceptarEntrega(
            String codigoPedido,
            String codigoRepartidor
    ) {

        Pedido pedido = pedidoFinder.buscarPedidoExistente(codigoPedido);

        Ticket ticket = pedidoFinder.buscarTicketExistente(
                pedido.getIdPedido()
        );

        Entrega entrega = pedidoFinder.buscarEntregaExistente(
                pedido.getIdPedido()
        );

        validarEntregaAsignadaAlRepartidor(entrega, codigoRepartidor);
        validarEntregaPendienteDeAceptacion(entrega);

        entrega.setEstado(EstadoEntrega.ACEPTADA);
        entregaRepository.save(entrega);

        return mapToResponseDTO(pedido, ticket, entrega);
    }

    @Transactional
    public PedidoResponseDTO rechazarEntrega(
            String codigoPedido,
            String codigoRepartidor
    ) {

        Pedido pedido = pedidoFinder.buscarPedidoExistente(codigoPedido);

        Ticket ticket = pedidoFinder.buscarTicketExistente(
                pedido.getIdPedido()
        );

        Entrega entrega = pedidoFinder.buscarEntregaExistente(
                pedido.getIdPedido()
        );

        validarEntregaAsignadaAlRepartidor(entrega, codigoRepartidor);
        validarEntregaPendienteDeAceptacion(entrega);

        Repartidor repartidorAnterior = entrega.getRepartidor();

        if (repartidorAnterior != null) {
            repartidorAnterior.setEstado(EstadoRepartidor.EN_LINEA);
            repartidorRepository.save(repartidorAnterior);
        }

        Repartidor nuevoRepartidor = seleccionRepartidorService
                .seleccionarExcluyendo(codigoRepartidor);

        entrega.setRepartidor(nuevoRepartidor);
        entrega.setEstado(EstadoEntrega.ASIGNADA);
        entrega.setMotivo("Reasignada luego de rechazo");

        nuevoRepartidor.setEstado(EstadoRepartidor.OCUPADO);

        entregaRepository.save(entrega);
        repartidorRepository.save(nuevoRepartidor);

        return mapToResponseDTO(pedido, ticket, entrega);
    }

    @Transactional
    public PedidoResponseDTO tomarPedido(
            String codigoPedido,
            String codigoRepartidor
    ) {

        Pedido pedido = pedidoFinder.buscarPedidoExistente(codigoPedido);

        Entrega entrega = pedidoFinder.buscarEntregaExistente(
                pedido.getIdPedido()
        );

        entrega = pedidoEntregaService.tomarPedido(
                entrega,
                codigoRepartidor
        );

        Ticket ticket = pedidoFinder.buscarTicketOpcional(
                pedido.getIdPedido()
        );

        return mapToResponseDTO(pedido, ticket, entrega);
    }

    @Transactional
    public PedidoResponseDTO retirarPedido(
            String codigoPedido,
            String codigoRepartidor
    ) {

        Pedido pedido = pedidoFinder.buscarPedidoExistente(codigoPedido);

        Entrega entrega = pedidoFinder.buscarEntregaExistente(
                pedido.getIdPedido()
        );

        Ticket ticket = pedidoFinder.buscarTicketExistente(
                pedido.getIdPedido()
        );

        entrega = pedidoEntregaService.retirarPedido(
                pedido,
                entrega,
                ticket,
                codigoRepartidor
        );

        historialPedidoService.actualizarHistorialPedido(pedido);

        return mapToResponseDTO(pedido, ticket, entrega);
    }

    @Transactional
    public PedidoResponseDTO entregarPedido(
            String codigoPedido,
            String codigoRepartidor
    ) {

        Pedido pedido = pedidoFinder.buscarPedidoExistente(codigoPedido);

        Entrega entrega = pedidoFinder.buscarEntregaExistente(
                pedido.getIdPedido()
        );

        Repartidor repartidor = repartidorRepository
                .findByCodigo(codigoRepartidor)
                .orElseThrow(() -> conflicto("REPARTIDOR_NO_ENCONTRADO"));

        pedidoEntregaService.entregarPedido(
                pedido,
                entrega,
                repartidor,
                codigoRepartidor
        );

        historialPedidoService.actualizarHistorialPedido(pedido);

        pedidoEventoService.publicarEventoEntregaEntregada(
                entrega,
                pedido
        );

        Ticket ticket = pedidoFinder.buscarTicketOpcional(
                pedido.getIdPedido()
        );

        return mapToResponseDTO(pedido, ticket, entrega);
    }

    @Transactional
    public PedidoResponseDTO calificarRepartidor(
            String codigoPedido,
            String emailConsumidor,
            Integer calificacion
    ) {

        if (calificacion == null || calificacion < 1 || calificacion > 5) {
            throw conflicto("CALIFICACION_INVALIDA");
        }

        Pedido pedido = pedidoFinder.buscarPedidoDelConsumidor(
                codigoPedido,
                emailConsumidor
        );

        if (pedido.getEstado() != EstadoPedido.RECIBIDO
                && pedido.getEstado() != EstadoPedido.ENTREGADO) {
            throw conflicto("PEDIDO_NO_FINALIZADO");
        }

        Entrega entrega = pedidoFinder.buscarEntregaExistente(
                pedido.getIdPedido()
        );

        if (entrega.getRepartidor() == null) {
            throw conflicto("PEDIDO_SIN_REPARTIDOR");
        }

        Repartidor repartidor = entrega.getRepartidor();

        int cantidadActual = repartidor.getCantidadCalificaciones() == null
                ? 0
                : repartidor.getCantidadCalificaciones();

        double promedioActual = repartidor.getCalificacionPromedio() == null
                ? 0.0
                : repartidor.getCalificacionPromedio();

        double nuevoPromedio =
                ((promedioActual * cantidadActual) + calificacion)
                        / (cantidadActual + 1);

        repartidor.setCantidadCalificaciones(cantidadActual + 1);
        repartidor.setCalificacionPromedio(nuevoPromedio);

        repartidorRepository.save(repartidor);

        return mapToResponseDTO(
                pedido,
                pedidoFinder.buscarTicketOpcional(pedido.getIdPedido()),
                entrega
        );
    }

    private void validarEntregaAsignadaAlRepartidor(
            Entrega entrega,
            String codigoRepartidor
    ) {

        if (!entrega.getRepartidor().getCodigo().equals(codigoRepartidor)) {
            throw conflicto("ENTREGA_NO_ASIGNADA_AL_REPARTIDOR");
        }
    }

    private void validarEntregaPendienteDeAceptacion(Entrega entrega) {

        if (entrega.getEstado() != EstadoEntrega.ASIGNADA) {
            throw conflicto("ENTREGA_NO_ESTA_PENDIENTE_DE_ACEPTACION");
        }
    }

    private PedidoResponseDTO mapToResponseDTO(
            Pedido pedido,
            Ticket ticket,
            Entrega entrega
    ) {

        Pago pago = pedidoFinder.buscarPagoOpcional(pedido.getIdPedido());

        return pedidoResponseMapper.toDTO(
                pedido,
                ticket,
                entrega,
                pago
        );
    }

    private ResponseStatusException conflicto(String mensaje) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}