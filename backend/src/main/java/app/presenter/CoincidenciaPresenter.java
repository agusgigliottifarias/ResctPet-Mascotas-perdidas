package app.presenter;

import app.Response;
import app.business.CoincidenciaService;
import app.model.dto.CoincidenciaResponse;
import app.model.dto.SolicitudCoincidenciaRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coincidencias")
@CrossOrigin(origins = "*")
public class CoincidenciaPresenter {

    private final CoincidenciaService coincidenciaService;

    public CoincidenciaPresenter(CoincidenciaService coincidenciaService) {
        this.coincidenciaService = coincidenciaService;
    }

    /**
     * Endpoint para solicitar la búsqueda de posibles coincidencias (T - 5.1.3).
     */
    @PostMapping("/solicitar")
    public ResponseEntity<Response> solicitarBusqueda(
            @RequestBody SolicitudCoincidenciaRequest request) {

        try {
            CoincidenciaResponse respuesta = coincidenciaService.solicitarBusqueda(request);

            if (respuesta.getCandidatos().isEmpty()) {
                return Response.response(
                        HttpStatus.OK,
                        "Solicitud procesada correctamente: No se encontraron candidatos compatibles dentro del radio de búsqueda",
                        respuesta
                );
            }

            return Response.response(
                    HttpStatus.OK,
                    "Solicitud de búsqueda de coincidencias procesada exitosamente",
                    respuesta
            );

        } catch (IllegalArgumentException e) {

            return Response.response(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage(),
                    null
            );

        } catch (Exception e) {

            return Response.response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error interno al procesar la solicitud de búsqueda de coincidencias",
                    null
            );
        }
    }

    @GetMapping("/solicitar/{publicacionId}")
    public ResponseEntity<Response> solicitarBusquedaPorId(
            @PathVariable Long publicacionId,
            @RequestParam(required = false) Double radioKm) {

        SolicitudCoincidenciaRequest request = new SolicitudCoincidenciaRequest(publicacionId, radioKm);
        return solicitarBusqueda(request);
    }
}