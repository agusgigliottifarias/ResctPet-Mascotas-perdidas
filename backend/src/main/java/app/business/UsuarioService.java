package app.business;

import app.model.Usuario;
import app.model.dto.LoginRequest;
import app.model.dto.UsuarioRequest;
import app.model.dto.UsuarioResponse;
import app.repository.UsuarioRepository;
import app.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public UsuarioResponse registrar(UsuarioRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Los datos del usuario no pueden ser nulos");
        }

        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        if (request.getApellido() == null || request.getApellido().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El correo electrónico es obligatorio");
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        String email = request.getEmail().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "El correo electrónico ya se encuentra registrado"
            );
        }

        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener al menos 6 caracteres"
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre().trim());
        usuario.setApellido(request.getApellido().trim());
        usuario.setEmail(email);
        usuario.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        return new UsuarioResponse(
                usuarioGuardado.getId(),
                usuarioGuardado.getNombre(),
                usuarioGuardado.getApellido(),
                usuarioGuardado.getEmail()
        );
    }

    public UsuarioResponse autenticar(LoginRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Las credenciales no pueden ser nulas"
            );
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "El correo electrónico es obligatorio"
            );
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "La contraseña es obligatoria"
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Credenciales inválidas"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                usuario.getPassword())) {

            throw new IllegalArgumentException(
                    "Credenciales inválidas"
            );
        }

        String token = jwtUtil.generarToken(
                usuario.getId(),
                usuario.getEmail()
        );

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                token
        );
    }

    /**
     * T - 1.3.2:
     * Obtiene la información del usuario autenticado.
     */
    public UsuarioResponse obtenerInformacionUsuario(String email) {

        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "El correo electrónico es obligatorio"
            );
        }

        Usuario usuario = usuarioRepository.findByEmail(
                email.trim().toLowerCase()
        ).orElseThrow(() ->
                new IllegalArgumentException(
                        "Usuario no encontrado"
                )
        );

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail()
        );
    }
}