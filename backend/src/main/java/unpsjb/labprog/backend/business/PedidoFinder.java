package unpsjb.labprog.backend.business;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Pago;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.repository.EntregaRepository;
import unpsjb.labprog.backend.repository.PagoRepository;
import unpsjb.labprog.backend.repository.PedidoRepository;
import unpsjb.labprog.backend.repository.TicketRepository;

import java.util.UUID;

@Component
public class PedidoFinder {

    private final PedidoRepository pedidoRepository;
    private final TicketRepository ticketRepository;
    private final EntregaRepository entregaRepository;
    private final PagoRepository pagoRepository;

    public PedidoFinder(
            PedidoRepository pedidoRepository,
            TicketRepository ticketRepository,
            EntregaRepository entregaRepository,
            PagoRepository pagoRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.ticketRepository = ticketRepository;
        this.entregaRepository = entregaRepository;
        this.pagoRepository = pagoRepository;
    }

    public Pedido buscarPedidoExistente(UUID idPedido) {

        return pedidoRepository
                .findById(idPedido)
                .orElseThrow(() ->
                        conflicto("PEDIDO_NO_ENCONTRADO"));
    }

    public Pedido buscarPedidoExistente(String codigoPedido) {

        return pedidoRepository
                .findByCodigo(codigoPedido)
                .orElseThrow(() ->
                        conflicto("PEDIDO_NO_ENCONTRADO"));
    }

    public Pedido buscarPedidoDelConsumidor(
            String codigoPedido,
            String emailConsumidor
    ) {

        return pedidoRepository
                .findByCodigoAndEmailConsumidor(
                        codigoPedido,
                        emailConsumidor
                )
                .orElseThrow(() ->
                        conflicto("PEDIDO_NO_PERTENECE_AL_CONSUMIDOR"));
    }

    public Ticket buscarTicketExistente(UUID idPedido) {

        return ticketRepository
                .findByIdPedido(idPedido)
                .orElseThrow(() ->
                        conflicto("TICKET_NO_ENCONTRADO"));
    }

    public Ticket buscarTicketOpcional(UUID idPedido) {

        return ticketRepository
                .findByIdPedido(idPedido)
                .orElse(null);
    }

    public Entrega buscarEntregaExistente(UUID idPedido) {

        return entregaRepository
                .findByIdPedido(idPedido)
                .orElseThrow(() ->
                        conflicto("ENTREGA_NO_ENCONTRADA"));
    }

    public Entrega buscarEntregaOpcional(UUID idPedido) {

        return entregaRepository
                .findByIdPedido(idPedido)
                .orElse(null);
    }

    public Pago buscarPagoOpcional(UUID idPedido) {

    return pagoRepository
            .findAllByIdPedidoOrderByFechaAutorizacionDesc(idPedido)
            .stream()
            .findFirst()
            .orElse(null);
    }

    private ResponseStatusException conflicto(String mensaje) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}