package unpsjb.labprog.backend.presenter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.NotificacionEtaService;
import unpsjb.labprog.backend.model.dto.NotificacionEtaResponseDTO;

@RestController
@RequiredArgsConstructor
public class NotificacionEtaPresenter {

    private final NotificacionEtaService notificacionEtaService;

    @PostMapping("/notificaciones/eta/eventos/{tipoEvento}")
    public ResponseEntity<Object> procesarEvento(
            @PathVariable String tipoEvento,
            @RequestParam String eventId,
            @RequestParam String idPedido,
            @RequestParam String idEntrega,
            @RequestParam(required = false) String idRepartidor,
            @RequestParam(required = false) String nombreRepartidor,
            @RequestParam(required = false) String estadoEntrega,
            @RequestParam(required = false) Instant timestamp,
            @RequestParam(required = false) Instant eta,
            @RequestParam(required = false) Instant etaAnterior,
            @RequestParam(required = false) Instant etaNuevo
    ) {

        NotificacionEtaResponseDTO resultado
                = notificacionEtaService.procesarEvento(
                        tipoEvento,
                        eventId,
                        idPedido,
                        idEntrega,
                        idRepartidor,
                        nombreRepartidor,
                        estadoEntrega,
                        timestamp,
                        eta,
                        etaAnterior,
                        etaNuevo
                );

        return Response.ok(
                resultado,
                statusText(resultado)
        );
    }

    private String statusText(NotificacionEtaResponseDTO resultado) {

        if ("SIN_NOTIFICACION_POR_UMBRAL".equals(resultado.getResultado())) {
            return "OK - SIN_NOTIFICACION_POR_UMBRAL";
        }

        if ("SIN_NOTIFICACION_POR_RATE_LIMIT".equals(resultado.getResultado())) {
            return "OK - SIN_NOTIFICACION_POR_RATE_LIMIT";
        }

        return "OK";
    }
}
