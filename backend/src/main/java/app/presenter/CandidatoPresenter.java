package app.presenter;

import app.Response;
import app.business.CandidatoService;
import app.model.dto.CandidatoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidatos")
@CrossOrigin(origins = "*")
public class CandidatoPresenter {

    private final CandidatoService candidatoService;

    public CandidatoPresenter(CandidatoService candidatoService) {
        this.candidatoService = candidatoService;
    }

    /**
     * Endpoint para obtener candidatos compatibles (T - 5.1.5).
     */
    @GetMapping("/obtener/{publicacionId}")
    public ResponseEntity<Response> obtenerCandidatos(
            @PathVariable Long publicacionId,
            @RequestParam(required = false) Double radioKm) {

        try {
            List<CandidatoResponse> candidatos = candidatoService.obtenerCandidatos(publicacionId, radioKm);

            if (candidatos.isEmpty()) {
                return Response.response(
                        HttpStatus.OK,
                        "No se encontraron candidatos compatibles dentro del radio de cercanía",
                        candidatos
                );
            }

            return Response.response(
                    HttpStatus.OK,
                    "Candidatos obtenidos exitosamente",
                    candidatos
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
                    "Ocurrió un error al obtener la lista de candidatos compatibles",
                    null
            );
        }
    }
}