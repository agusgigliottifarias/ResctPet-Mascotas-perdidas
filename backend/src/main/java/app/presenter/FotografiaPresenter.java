package app.presenter;

import app.Response;
import app.business.FotografiaService;
import app.model.dto.FotografiaResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fotografias")
@CrossOrigin(origins = "*")
public class FotografiaPresenter {

    private final FotografiaService fotografiaService;

    public FotografiaPresenter(FotografiaService fotografiaService) {
        this.fotografiaService = fotografiaService;
    }

    /**
     * Endpoint para preparar la fotografía principal para comparación (T - 5.1.6).
     */
    @GetMapping("/preparar/{publicacionId}")
    public ResponseEntity<Response> prepararFotografia(@PathVariable Long publicacionId) {

        try {
            FotografiaResponse respuesta = fotografiaService.prepararFotografia(publicacionId);

            if (!respuesta.isEsValida()) {
                return Response.response(
                        HttpStatus.BAD_REQUEST,
                        respuesta.getMensaje(),
                        respuesta
                );
            }

            return Response.response(
                    HttpStatus.OK,
                    "Fotografía preparada exitosamente para la comparación",
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
                    "Ocurrió un error al preparar la fotografía principal",
                    null
            );
        }
    }
}