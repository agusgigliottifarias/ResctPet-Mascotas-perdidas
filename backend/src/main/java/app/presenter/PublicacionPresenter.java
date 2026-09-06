package app.presenter;

import app.Response;
import app.business.PublicacionService;
import app.model.Publicacion;
import app.model.dto.PublicacionRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publicaciones") //verificar con el frontend
@CrossOrigin(origins = "*")
public class PublicacionPresenter {

    private final PublicacionService publicacionService;

    public PublicacionPresenter(PublicacionService publicacionService) {
        this.publicacionService = publicacionService;
    }

    @PostMapping
    public ResponseEntity<Response> crearPublicacion(@RequestBody PublicacionRequest request) {
        try {
            Publicacion guardada = publicacionService.guardar(request);

            return Response.response(
                HttpStatus.CREATED,
                "Publicación creada y almacenada exitosamente",
                guardada
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