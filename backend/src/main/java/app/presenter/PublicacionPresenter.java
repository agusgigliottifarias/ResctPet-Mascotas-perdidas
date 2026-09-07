package app.presenter;

import app.Response;
import app.business.PublicacionService;
import app.model.dto.PublicacionRequest;
import app.model.dto.PublicacionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publicaciones")
@CrossOrigin(origins = "*")
public class PublicacionPresenter {

    private final PublicacionService publicacionService;

    public PublicacionPresenter(PublicacionService publicacionService) {
        this.publicacionService = publicacionService;
    }

    @PostMapping
    public ResponseEntity<Response> crearPublicacion(@RequestBody PublicacionRequest request) {
        try {
            PublicacionResponse respuesta = publicacionService.guardar(request);

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
        }
    }
}