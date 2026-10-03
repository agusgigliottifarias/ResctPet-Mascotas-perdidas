package app.presenter;

import app.Response;
import app.business.UsuarioService;
import app.model.dto.LoginRequest;
import app.model.dto.UsuarioRequest;
import app.model.dto.UsuarioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
     * T - 1.1.7 / T - 1.1.4:
     * Endpoint para registrar un usuario.
     *
     * Ruta:
     * POST /api/usuarios/registro
     */
    @PostMapping("/registro")
    public ResponseEntity registrarUsuario(
            @RequestBody UsuarioRequest request) {

        try {
            UsuarioResponse nuevoUsuario =
                    usuarioService.registrar(request);

            return Response.response(
                    HttpStatus.CREATED,
                    "Usuario registrado exitosamente",
                    nuevoUsuario
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
                    "Ocurrió un error al registrar el usuario",
                    null
            );
        }
    }

    /**
     * T - 1.2.3 / T - 1.2.2:
     * Endpoint de autenticación (Login).
     *
     * Ruta:
     * POST /api/usuarios/login
     */
    @PostMapping("/login")
    public ResponseEntity login(
            @RequestBody LoginRequest request) {

        try {
            UsuarioResponse usuarioAutenticado =
                    usuarioService.autenticar(request);

            return Response.response(
                    HttpStatus.OK,
                    "Autenticación exitosa",
                    usuarioAutenticado
            );

        } catch (IllegalArgumentException e) {

            return Response.response(
                    HttpStatus.UNAUTHORIZED,
                    e.getMessage(),
                    null
            );

        } catch (Exception e) {

            return Response.response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Ocurrió un error durante la autenticación",
                    null
            );
        }
    }

    /**
     * T - 1.3.2:
     * Endpoint para consultar la información
     * del usuario autenticado.
     *
     * Ruta:
     * GET /api/usuarios/perfil
     */
    @GetMapping("/perfil")
    public ResponseEntity obtenerInformacionUsuario(
            Authentication authentication) {

        try {

            UsuarioResponse usuario =
                    usuarioService.obtenerInformacionUsuario(
                            authentication.getName()
                    );

            return Response.response(
                    HttpStatus.OK,
                    "Información del usuario obtenida correctamente",
                    usuario
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
                    "Ocurrió un error al consultar la información del usuario",
                    null
            );
        }
    }
}