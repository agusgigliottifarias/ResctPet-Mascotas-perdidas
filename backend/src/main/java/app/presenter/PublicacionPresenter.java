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

    // Endpoint genérico
    @PostMapping
    public ResponseEntity<Response> crearPublicacion(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        return procesarGuardado(request, authentication);
    }

    // Endpoint específico para mascotas perdidas
    @PostMapping("/perdidas")
    public ResponseEntity<Response> crearPublicacionPerdida(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        request.setTipoPublicacion(TipoPublicacion.PERDIDA);
        return procesarGuardado(request, authentication);
    }

    // Endpoint específico para mascotas encontradas
    @PostMapping("/encontradas")
    public ResponseEntity<Response> crearPublicacionEncontrada(
            @RequestBody PublicacionRequest request,
            Authentication authentication) {

        request.setTipoPublicacion(TipoPublicacion.ENCONTRADA);
        return procesarGuardado(request, authentication);
    }

    // Endpoint para consultar una publicación
    @GetMapping("/{id}")
    public ResponseEntity<Response> consultarPublicacion(
            @PathVariable Long id) {

        try {
            PublicacionResponse respuesta =
                    publicacionService.consultar(id);

            return Response.response(
                    HttpStatus.OK,
                    "Publicación consultada exitosamente",
                    respuesta
            );

        } catch (IllegalArgumentException e) {
            return Response.response(
                    HttpStatus.NOT_FOUND,
                    e.getMessage(),
                    null
            );

        } catch (Exception e) {
            return Response.response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error al consultar la publicación",
                    null
            );
        }
    }

    // Método auxiliar para centralizar el manejo de respuestas
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