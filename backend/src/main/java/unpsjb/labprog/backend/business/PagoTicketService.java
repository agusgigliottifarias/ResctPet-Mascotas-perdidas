package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.ItemPedido;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.dto.PagoRequestDTO;
import unpsjb.labprog.backend.model.enums.EstadoTicket;
import unpsjb.labprog.backend.repository.TicketRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagoTicketService {

    private final TicketRepository ticketRepository;

    @Transactional(readOnly = true)
    public void validarTicketDuplicado(
            Pedido pedido
    ) {

        if (ticketRepository
                .findByIdPedido(pedido.getIdPedido())
                .isPresent()) {

            throw conflicto("TICKET_DUPLICADO_POR_PEDIDO");
        }
    }
 
    @Transactional
    public Ticket crearTicketDeCocina(
            Pedido pedido,
            PagoRequestDTO request
    ) {

        if (errorGenerandoTicket(request)) {
            throw conflicto("ERROR_GENERANDO_TICKET");
        }

        Ticket ticket = new Ticket();

        ticket.setIdTicket(UUID.randomUUID());

        ticket.setCodigo(
                "T-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        ticket.setIdPedido(pedido.getIdPedido());

        ticket.setIdRestaurante(
                pedido.getRestaurante()
                        .getIdRestaurante()
        );

        ticket.setEstado(EstadoTicket.ACEPTADO);

        ticket.setListoPara(null);

        ticket.setFechaCreacion(Instant.now());

        ticket.setEstimadoListo(
                Instant.now().plus(Duration.ofMinutes(5))
        );

        if (pedido.getDireccionEntrega() != null) {

            ticket.setDireccionEntrega(
                    pedido.getDireccionEntrega().toString()
            );
        }

        ticket.setItems(
                pedido.getLineas()
                        .stream()
                        .map(this::describirItem)
                        .collect(Collectors.toList())
        );

        return ticketRepository.save(ticket);
    }

    private boolean errorGenerandoTicket(
            PagoRequestDTO request
    ) {

        return request.getSimulacion() != null
                && Boolean.TRUE.equals(
                request.getSimulacion()
                        .get("forzarErrorGenerandoTicket")
        );
    }

    private String describirItem(
            ItemPedido item
    ) {

        String nombre = item.getNombre() != null
                ? item.getNombre()
                : item.getCodigoItemMenu();

        Integer cantidad = item.getCantidad() != null
                ? item.getCantidad()
                : 0;

        return cantidad + " x " + nombre;
    }

    private RuntimeException conflicto(
            String mensaje
    ) {

        return new RuntimeException(
                "CONFLICTO - " + mensaje
        );
    }
}