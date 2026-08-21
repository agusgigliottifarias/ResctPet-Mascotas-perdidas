package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;

@Service
@RequiredArgsConstructor
public class TicketHistorialService {

    private final TicketFinderService ticketFinderService;
    private final HistorialPedidoService historialPedidoService;

    public void actualizarHistorial(
            Ticket ticket
    ) {

        Pedido pedido = ticketFinderService.obtenerPedidoAsociado(ticket);

        historialPedidoService.actualizarHistorialPedido(pedido);
    }
}