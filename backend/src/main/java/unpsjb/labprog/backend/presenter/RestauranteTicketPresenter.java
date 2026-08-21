package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.TicketService;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.dto.TicketResponseDTO;

@RestController
@RequestMapping("/restaurantes/{codigoRestaurante}/tickets")
@CrossOrigin(origins = "*")
public class RestauranteTicketPresenter {

    @Autowired
    private TicketService ticketService;

    @GetMapping("/{codigoTicket}")
    public ResponseEntity<Object> obtenerTicket(
            @PathVariable String codigoRestaurante,
            @PathVariable String codigoTicket
    ) {

        TicketResponseDTO ticket
                = ticketService
                        .obtenerRespuestaPorRestauranteYTicket(
                                codigoRestaurante,
                                codigoTicket
                        );

        return Response.ok(
                ticket,
                "TICKET_OBTENIDO"
        );
    }

    @PostMapping("/{codigoTicket}/en-preparacion")
    public ResponseEntity<Object> marcarEnPreparacion(
            @PathVariable String codigoRestaurante,
            @PathVariable String codigoTicket
    ) {

        TicketResponseDTO ticket
                = ticketService
                        .marcarEnPreparacionRespuesta(
                                codigoRestaurante,
                                codigoTicket
                        );

        return Response.ok(
                ticket,
                "TICKET_EN_PREPARACION"
        );
    }

    @PostMapping("/{codigoTicket}/listo")
    public ResponseEntity<Object> marcarListo(
            @PathVariable String codigoRestaurante,
            @PathVariable String codigoTicket
    ) {

        TicketResponseDTO ticket
                = ticketService
                        .marcarListoRespuesta(
                                codigoRestaurante,
                                codigoTicket
                        );

        return Response.ok(
                ticket,
                "TICKET_LISTO"
        );
    }
}
