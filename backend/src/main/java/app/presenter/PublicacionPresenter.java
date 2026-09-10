package app.presenter;

import app.Response;
import app.business.PublicacionService;
import app.model.dto.PublicacionRequest;
import app.model.dto.PublicacionResponse;
import app.model.enums.TipoPublicacion;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/publicaciones")
@CrossOrigin(origins = "*")
public class PublicacionPresenter {

    private final PublicacionService publicacionService;

    public PublicacionPresenter(PublicacionService publicacionService) {
        this.publicacionService = publicacionService;
    }

    // Endpoint genérico (procesa el tipoPublicacion que venga en el JSON)
    @PostMapping
    public ResponseEntity<Response> crearPublicacion(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        return procesarGuardado(request, authentication);
    }

    // Endpoint específico para mascotas perdidas (T - 3.1.3)
    @PostMapping("/perdidas")
    public ResponseEntity<Response> crearPublicacionPerdida(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        request.setTipoPublicacion(TipoPublicacion.PERDIDA);
        return procesarGuardado(request, authentication);
    }

    // Endpoint específico para mascotas encontradas (T - 3.2.3)
    @PostMapping("/encontradas")
    public ResponseEntity<Response> crearPublicacionEncontrada(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        request.setTipoPublicacion(TipoPublicacion.ENCONTRADA);
        return procesarGuardado(request, authentication);
    }

    // Método auxiliar privado para centralizar el manejo de respuestas
    private ResponseEntity<Response> procesarGuardado(
            PublicacionRequest request,
            Authentication authentication) {

        try {
            PublicacionResponse respuesta =
                    publicacionService.guardar(request, authentication);

            return Response.response(
                    HttpStatus.CREATED,
                    "Publicación creada y fotografía asociada exitosamente",
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
                    "Ocurrió un error al crear la publicación",
                    null
            );
        }
    }
}