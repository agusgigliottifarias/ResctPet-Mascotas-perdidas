package unpsjb.labprog.backend.business;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.EstadoPedido;
import unpsjb.labprog.backend.model.enums.EstadoTicket;

@Component
public class PedidoCancelacionValidator {

    public void validarPedidoCancelable(Pedido pedido) {

        if (pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw conflicto("PEDIDO_YA_CANCELADO");
        }

        boolean estadoPermitido =
                pedido.getEstado() == EstadoPedido.CREACION_PENDIENTE
                        || pedido.getEstado() == EstadoPedido.PAGO_CONFIRMADO
                        || pedido.getEstado() == EstadoPedido.APROBADO;

        if (!estadoPermitido) {
            throw conflicto("ESTADO_PEDIDO_NO_PERMITE_CANCELACION");
        }
    }

    public void validarTicketCancelable(Ticket ticket) {

        if (ticket == null) {
            return;
        }

        if (ticket.getEstado() == EstadoTicket.EN_PREPARACION
                || ticket.getEstado() == EstadoTicket.LISTO) {

            throw conflicto("PEDIDO_YA_EN_PREPARACION");
        }
    }

    public void validarEntregaCancelable(Entrega entrega) {

        if (entrega == null) {
            return;
        }

        if (entrega.getEstado() == EstadoEntrega.EN_TRAYECTO) {
            throw conflicto("ENTREGA_YA_INICIADA");
        }
    }

    private ResponseStatusException conflicto(String mensaje) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}