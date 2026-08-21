package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.repository.PedidoRepository;
import unpsjb.labprog.backend.repository.RestauranteRepository;
import unpsjb.labprog.backend.repository.TicketRepository;

@Service
@RequiredArgsConstructor
public class TicketFinderService {

    private final TicketRepository ticketRepository;
    private final PedidoRepository pedidoRepository;
    private final RestauranteRepository restauranteRepository;

    public Ticket obtenerTicketPorCodigo(
            String codigoTicket
    ) {

        return ticketRepository
                .findByCodigo(codigoTicket)
                .orElseThrow(()
                        -> conflicto("TICKET_NO_ENCONTRADO")
                );
    }

    public Ticket obtenerTicketPorCodigoPedido(
            String codigoPedido
    ) {

        Pedido pedido = pedidoRepository
                .findByCodigo(codigoPedido)
                .orElseThrow(()
                        -> conflicto("PEDIDO_NO_ENCONTRADO")
                );

        return ticketRepository
                .findByIdPedido(pedido.getIdPedido())
                .orElseThrow(()
                        -> conflicto("TICKET_NO_ENCONTRADO")
                );
    }

    public Restaurante obtenerRestaurantePorCodigo(
            String codigoRestaurante
    ) {

        return restauranteRepository
                .findByCodigo(codigoRestaurante)
                .orElseThrow(()
                        -> conflicto("RESTAURANTE_NO_ENCONTRADO")
                );
    }

    public Pedido obtenerPedidoAsociado(
            Ticket ticket
    ) {

        return pedidoRepository
                .findById(ticket.getIdPedido())
                .orElseThrow(()
                        -> conflicto(
                        "PEDIDO_NO_ENCONTRADO_PARA_TICKET"
                )
                );
    }

    private ResponseStatusException conflicto(
            String mensaje
    ) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}