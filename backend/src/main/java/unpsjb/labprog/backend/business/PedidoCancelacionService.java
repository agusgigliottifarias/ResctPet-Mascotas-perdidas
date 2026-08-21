package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Pago;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.EstadoPago;
import unpsjb.labprog.backend.model.enums.EstadoPedido;
import unpsjb.labprog.backend.model.enums.EstadoTicket;
import unpsjb.labprog.backend.repository.EntregaRepository;
import unpsjb.labprog.backend.repository.PagoRepository;
import unpsjb.labprog.backend.repository.PedidoRepository;
import unpsjb.labprog.backend.repository.TicketRepository;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PedidoCancelacionService {

    private final PagoService pagoService;
    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;
    private final TicketRepository ticketRepository;
    private final EntregaRepository entregaRepository;
    private final NotificacionEtaService notificacionEtaService;

    @Transactional
    public void cancelar(
            Pedido pedido,
            Ticket ticket,
            Entrega entrega,
            Pago pago,
            String motivoCancelacion,
            boolean forzarErrorReembolso
    ) {

        procesarCancelacionPago(pago, forzarErrorReembolso);
        aplicarCancelacion(pedido, ticket, entrega, motivoCancelacion);
    }

    private void procesarCancelacionPago(
            Pago pago,
            boolean forzarErrorReembolso
    ) {

        if (forzarErrorReembolso) {
            throw conflicto("ERROR_PROCESANDO_REEMBOLSO");
        }

        if (pago == null) {
            return;
        }

        if (pago.getEstado() == EstadoPago.CAPTURADO) {
            pagoService.procesarReembolso(pago.getIdPedido());
            pago.setEstado(EstadoPago.REEMBOLSO_PENDIENTE);
            pagoRepository.save(pago);
        }

        if (pago.getEstado() == EstadoPago.AUTORIZADO) {
            pago.setEstado(EstadoPago.CANCELADO);
            pagoRepository.save(pago);
        }
    }

    private void aplicarCancelacion(
            Pedido pedido,
            Ticket ticket,
            Entrega entrega,
            String motivoCancelacion
    ) {

        pedido.setEstado(EstadoPedido.CANCELADO);
        pedido.setFechaHoraCancelacion(Instant.now());
        pedido.setMotivoCancelacion(motivoCancelacion);

        if (ticket != null) {
            ticket.setEstado(EstadoTicket.ANULADO);
            ticket.setMotivo(motivoCancelacion);
            ticketRepository.save(ticket);
        }

               if (entrega != null && entrega.getEstado() == EstadoEntrega.ASIGNADA) {
            entrega.setEstado(EstadoEntrega.FALLIDA);
            entrega.setMotivo("CANCELACION_CONSUMIDOR");
            entregaRepository.save(entrega);

            notificacionEtaService.procesarEvento(
                    "EntregaFallida",
                    "EVT-" + entrega.getCodigo() + "-" + System.currentTimeMillis(),
                    pedido.getCodigo(),
                    entrega.getCodigo(),
                    null,
                    null,
                    EstadoEntrega.FALLIDA.name(),
                    Instant.now(),
                    null,
                    null,
                    null
            );
        }

        pedidoRepository.save(pedido);
    }

    private ResponseStatusException conflicto(String mensaje) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}