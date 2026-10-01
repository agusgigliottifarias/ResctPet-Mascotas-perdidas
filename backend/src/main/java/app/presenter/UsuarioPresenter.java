package app.presenter;

import app.Response;
import app.business.UsuarioService;
import app.model.dto.UsuarioRequest;
import app.model.dto.UsuarioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioPresenter {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;

    public UsuarioPresenter(UsuarioService usuarioService, AuthenticationManager authenticationManager) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * T - 1.1.4: Endpoint para registrar un nuevo usuario en el sistema.
     * Ruta: POST /api/usuarios/registro
     */
    @PostMapping("/registro")
    public ResponseEntity registrarUsuario(@RequestBody UsuarioRequest request) {
        try {
            UsuarioResponse nuevoUsuario = usuarioService.registrar(request);

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
     * T - 1.2.3: Endpoint para validar las credenciales del usuario.
     * Ruta: POST /api/usuarios/login
     */
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody UsuarioRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            return Response.response(
                    HttpStatus.OK,
                    "Credenciales válidas. Acceso concedido.",
                    null
            );

        } catch (Exception e) {
            return Response.response(
                    HttpStatus.UNAUTHORIZED,
                    "Correo electrónico o contraseña incorrectos",
                    null
            );
        }
    }
}