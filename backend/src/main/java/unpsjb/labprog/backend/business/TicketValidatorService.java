package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.enums.EstadoPedido;
import unpsjb.labprog.backend.model.enums.EstadoTicket;

@Service
@RequiredArgsConstructor
public class TicketValidatorService {

    private final TicketFinderService ticketFinderService;

    public void validarTicketNoAnulado(Ticket ticket) {
        if (ticket.getEstado() == EstadoTicket.ANULADO) {
            throw conflicto("TICKET_ANULADO");
        }
    }

    public void validarTransicionAEnPreparacion(Ticket ticket) {
        if (ticket.getEstado() != EstadoTicket.TOMADO) {
            throw conflicto("TRANSICION_TICKET_INVALIDA");
        }
    }

    public void validarTransicionAListo(Ticket ticket) {
        if (ticket.getEstado() != EstadoTicket.EN_PREPARACION) {
            throw conflicto("TRANSICION_TICKET_INVALIDA");
        }
    }

    public void validarPedidoAsociado(Ticket ticket) {
        Pedido pedido = ticketFinderService.obtenerPedidoAsociado(ticket);

        if (pedido.getEstado() != EstadoPedido.APROBADO) {
            throw conflicto("ESTADO_PEDIDO_NO_PERMITE_OPERACION_COCINA");
        }
    }

    public boolean esOperacionIdempotente(
            Ticket ticket,
            EstadoTicket nuevoEstado
    ) {
        if (ticket.getEstado() != nuevoEstado) {
            return false;
        }

        return (nuevoEstado == EstadoTicket.EN_PREPARACION
                && ticket.getInicioPreparacion() != null)
                || (nuevoEstado == EstadoTicket.LISTO
                && ticket.getFinPreparacion() != null)
                || (nuevoEstado == EstadoTicket.ANULADO
                && ticket.getAnuladoEn() != null);
    }

    private ResponseStatusException conflicto(String mensaje) {
        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}