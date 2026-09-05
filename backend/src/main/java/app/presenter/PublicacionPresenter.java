package app.presenter;

import app.Response;
import app.model.dto.PublicacionRequest;
import app.model.validation.PublicacionValidator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publicaciones")  //vericar con el frontend
@CrossOrigin(origins = "*")
public class PublicacionPresenter {

    @PostMapping
    public ResponseEntity<Response> crearPublicacion(@RequestBody PublicacionRequest request) {
        try {
            PublicacionValidator.validar(request);

            return Response.response(
                HttpStatus.CREATED,
                "Publicación recibida y validada correctamente",
                request
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