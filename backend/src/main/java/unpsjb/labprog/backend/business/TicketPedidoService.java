package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.enums.EstadoPedido;
import unpsjb.labprog.backend.repository.PedidoRepository;
import unpsjb.labprog.backend.repository.TicketRepository;

@Service
@RequiredArgsConstructor
public class TicketPedidoService {

    private final PedidoRepository pedidoRepository;
    private final TicketRepository ticketRepository;
    private final TicketFinderService ticketFinderService;

    public void cancelarPedidoAsociado(
            Ticket ticket
    ) {

        Pedido pedido =
                ticketFinderService.obtenerPedidoAsociado(ticket);

        pedido.setEstado(EstadoPedido.CANCELADO);

        pedidoRepository.save(pedido);
    }

    public Ticket crearTicketPrevioParaPedido(
            String codigoPedido
    ) {

        Pedido pedido = pedidoRepository
                .findByCodigo(codigoPedido)
                .orElseThrow(() ->
                        new RuntimeException("PEDIDO_NO_ENCONTRADO")
                );

        if (ticketRepository
                .findByIdPedido(pedido.getIdPedido())
                .isPresent()) {

            throw new RuntimeException(
                    "TICKET_DUPLICADO_POR_PEDIDO"
            );
        }

        Ticket ticket = new Ticket();

        ticket.setIdPedido(pedido.getIdPedido());

        ticket.setIdRestaurante(
                pedido.getRestaurante()
                        .getIdRestaurante()
        );

        ticket.setEstado(
                unpsjb.labprog.backend.model.enums.EstadoTicket.ACEPTADO
        );

        ticket.setCodigo("T-PREVIO-" + codigoPedido);

        return ticketRepository.save(ticket);
    }
}