package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import unpsjb.labprog.backend.model.EventoTrazabilidad;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.enums.ActorTrazabilidad;
import unpsjb.labprog.backend.model.event.TicketListoEvent;
import unpsjb.labprog.backend.model.event.TiempoPreparacionRegistradoEvent;
import unpsjb.labprog.backend.repository.RestauranteRepository;

@Service
@RequiredArgsConstructor
public class TicketEventoService {

    private final TicketFinderService ticketFinderService;
    private final RestauranteRepository restauranteRepository;
    private final TrazabilidadService trazabilidadService;

    public void publicarEventoTicketListo(
            Ticket ticket
    ) {
        Pedido pedido = ticketFinderService.obtenerPedidoAsociado(ticket);

        Restaurante restaurante = restauranteRepository
                .findById(ticket.getIdRestaurante())
                .orElseThrow(() -> conflicto("RESTAURANTE_NO_ENCONTRADO"));

        TicketListoEvent evento = new TicketListoEvent(
                ticket.getCodigo(),
                pedido.getCodigo(),
                restaurante.getCodigo()
        );

        EventoTrazabilidad trazabilidad = new EventoTrazabilidad();

        trazabilidad.setEventId("TRAZ-" + evento.getCodigoPedido() + "-TICKET-LISTO");
        trazabilidad.setEventType("TicketListo");
        trazabilidad.setIdPedido(evento.getCodigoPedido());
        trazabilidad.setIdTicket(evento.getCodigoTicket());
        trazabilidad.setTimestamp(evento.getOcurridoEn());
        trazabilidad.setActorTipo(ActorTrazabilidad.COCINA);
        trazabilidad.setPayload(
                "{ \"idTicket\": \"" + evento.getCodigoTicket()
                        + "\", \"idRestaurante\": \"" + evento.getCodigoRestaurante()
                        + "\" }"
        );

        trazabilidadService.registrarEvento(trazabilidad);

        System.out.println(
                "EVENTO TicketListo publicado -> "
                        + "ticket=" + evento.getCodigoTicket()
                        + ", pedido=" + evento.getCodigoPedido()
                        + ", restaurante=" + evento.getCodigoRestaurante()
                        + ", ocurridoEn=" + evento.getOcurridoEn()
        );
    }

    public void publicarEventoTiempoPreparacionRegistrado(
            Ticket ticket
    ) {
        Pedido pedido = ticketFinderService.obtenerPedidoAsociado(ticket);

        TiempoPreparacionRegistradoEvent evento =
                new TiempoPreparacionRegistradoEvent(
                        ticket.getCodigo(),
                        pedido.getCodigo(),
                        ticket.getInicioPreparacion(),
                        ticket.getFinPreparacion(),
                        ticket.getDuracionPreparacionSegundos()
                );

        EventoTrazabilidad trazabilidad = new EventoTrazabilidad();

        trazabilidad.setEventId("TRAZ-" + evento.getIdPedido() + "-TIEMPO-PREPARACION");
        trazabilidad.setEventType("TiempoPreparacionRegistrado");
        trazabilidad.setIdPedido(evento.getIdPedido());
        trazabilidad.setIdTicket(evento.getIdTicket());
        trazabilidad.setTimestamp(evento.getOcurridoEn());
        trazabilidad.setActorTipo(ActorTrazabilidad.COCINA);
        trazabilidad.setPayload(
                "{ \"idTicket\": \"" + evento.getIdTicket()
                        + "\", \"inicioPreparacion\": \"" + evento.getInicioPreparacion()
                        + "\", \"finPreparacion\": \"" + evento.getFinPreparacion()
                        + "\", \"duracionSegundos\": " + evento.getDuracionSegundos()
                        + " }"
        );

        trazabilidadService.registrarEvento(trazabilidad);

        System.out.println(
                "EVENTO TiempoPreparacionRegistrado publicado -> "
                        + "ticket=" + evento.getIdTicket()
                        + ", pedido=" + evento.getIdPedido()
                        + ", inicio=" + evento.getInicioPreparacion()
                        + ", fin=" + evento.getFinPreparacion()
                        + ", duracion=" + evento.getDuracionSegundos()
                        + ", ocurridoEn=" + evento.getOcurridoEn()
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