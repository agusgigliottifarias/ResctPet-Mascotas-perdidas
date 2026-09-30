package app.presenter;

import app.Response;
import app.business.UsuarioService;
import app.model.dto.UsuarioRequest;
import app.model.dto.UsuarioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioPresenter {

    private final UsuarioService usuarioService;

    public UsuarioPresenter(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * T - 1.1.7: Endpoint para registrar un usuario capturando errores de validación.
     */
    @PostMapping("/registro")
    public ResponseEntity<Response> registrarUsuario(@RequestBody UsuarioRequest request) {
        try {
            UsuarioResponse nuevoUsuario = usuarioService.registrar(request);

            return Response.response(
                    HttpStatus.CREATED,
                    "Usuario registrado exitosamente",
                    nuevoUsuario
            );

        } catch (IllegalArgumentException e) {
            // Retorna HTTP 400 Bad Request con el mensaje del dato faltante o inválido
            return Response.response(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage(),
                    null
            );

        } catch (Exception e) {
            return Response.response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error al registrar el usuario",
                    null
            );
        }
    }
}