package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import unpsjb.labprog.backend.business.TicketService;
import unpsjb.labprog.backend.model.Ticket;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*")
public class TicketPresenter {

    @Autowired
    private TicketService ticketService;

    @GetMapping("/pedido/{codigoPedido}")
    public ResponseEntity<Object> obtenerTicket(
            @PathVariable String codigoPedido
    ) {

        Ticket ticket
                = ticketService.obtenerPorPedido(
                        codigoPedido
                );

        return Response.ok(
                ticket,
                "TICKET_OBTENIDO"
        );
    }

    @PostMapping("/pedido/{codigoPedido}/preparar")
    public ResponseEntity<Object> iniciarPreparacion(
            @PathVariable String codigoPedido
    ) {

        return Response.ok(
                ticketService.marcarEnPreparacionRespuestaPorPedido(
                        codigoPedido
                ),
                "PEDIDO_EN_PREPARACION"
        );
    }

    @PostMapping("/pedido/{codigoPedido}/listo")
    public ResponseEntity<Object> marcarListo(
            @PathVariable String codigoPedido
    ) {

        return Response.ok(
                ticketService.marcarListoRespuestaPorPedido(
                        codigoPedido
                ),
                "PEDIDO_LISTO"
        );
    }

    @PostMapping("/pedido/{codigoPedido}/crear-previo")
    public ResponseEntity<Object> crearTicketPrevio(
            @PathVariable String codigoPedido
    ) {

        Ticket ticket
                = ticketService
                        .crearTicketPrevioParaPedido(
                                codigoPedido
                        );

        return Response.ok(
                ticket,
                "TICKET_PREVIO_CREADO"
        );
    }

    @PostMapping(
            "/restaurantes/{codigoRestaurante}/tickets/{codigoTicket}/en-preparacion"
    )
    public ResponseEntity<Object> marcarTicketEnPreparacion(
            @PathVariable String codigoRestaurante,
            @PathVariable String codigoTicket
    ) {

        return Response.ok(
                ticketService
                        .marcarEnPreparacionRespuesta(
                                codigoRestaurante,
                                codigoTicket
                        ),
                "TICKET_EN_PREPARACION"
        );
    }

    @PostMapping(
            "/restaurantes/{codigoRestaurante}/tickets/{codigoTicket}/listo"
    )
    public ResponseEntity<Object> marcarTicketListo(
            @PathVariable String codigoRestaurante,
            @PathVariable String codigoTicket
    ) {

        return Response.ok(
                ticketService
                        .marcarListoRespuesta(
                                codigoRestaurante,
                                codigoTicket
                        ),
                "TICKET_LISTO"
        );
    }

    @GetMapping(
            "/restaurantes/{codigoRestaurante}/cocina/tiempos-preparacion"
    )
    public ResponseEntity<Object> consultarTiemposPreparacion(
            @PathVariable String codigoRestaurante,
            @RequestParam String desde,
            @RequestParam String hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {

        List<?> respuesta
                = ticketService
                        .consultarTiemposPreparacion(
                                codigoRestaurante,
                                desde,
                                hasta,
                                page,
                                size
                        );

        return Response.ok(
                respuesta,
                "OK"
        );
    }

    @GetMapping
    public ResponseEntity<Object> listarTickets() {

        return Response.ok(
                ticketService.obtenerTodos(),
                "TICKETS_OBTENIDOS"
        );
    }

    @PostMapping("/{codigoTicket}/anular")
    public ResponseEntity<Object> anularTicket(
            @PathVariable String codigoTicket,
            @RequestParam String motivo
    ) {
        return Response.ok(
                ticketService.anularTicket(codigoTicket, motivo),
                "OK"
        );
    }

    @PostMapping("/{codigoTicket}/estado")
    public ResponseEntity<Object> cambiarEstado(
            @PathVariable String codigoTicket,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String nuevoEstado = body != null ? body.get("nuevoEstado") : null;
        String motivo = body != null ? body.get("motivo") : null;

        if ("ANULADO".equals(nuevoEstado)) {
            return Response.ok(
                    ticketService.anularTicket(codigoTicket, motivo),
                    "OK"
            );
        }

        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - TRANSICION_TICKET_INVALIDA"
        );
    }

}
