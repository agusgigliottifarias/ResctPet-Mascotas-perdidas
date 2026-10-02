package app.business;

import app.model.Usuario;
import app.model.dto.LoginRequest;
import app.model.dto.UsuarioRequest;
import app.model.dto.UsuarioResponse;
import app.repository.UsuarioRepository;
import app.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Patrón Regex para validar formato de correo electrónico
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    // Inyección por constructor de repositorios, encriptador y generador JWT
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * T - 1.1.5, T - 1.1.6, T - 1.1.7: Registro completo de usuario
     */
    @Transactional
    public UsuarioResponse registrar(UsuarioRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Los datos de usuario no pueden ser nulos");
        }

        if (request.getNombre() == null || request.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        if (request.getApellido() == null || request.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("El correo electrónico es obligatorio");
        }

        String emailNormalizado = request.getEmail().trim().toLowerCase();

        if (!EMAIL_PATTERN.matcher(emailNormalizado).matches()) {
            throw new IllegalArgumentException("El formato del correo electrónico es inválido");
        }

        if (usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new IllegalArgumentException("El correo electrónico ya se encuentra registrado");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        String passwordEncriptada = (passwordEncoder != null)
                ? passwordEncoder.encode(request.getPassword())
                : request.getPassword();

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre().trim());
        usuario.setApellido(request.getApellido().trim());
        usuario.setEmail(emailNormalizado);
        usuario.setPassword(passwordEncriptada);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        return new UsuarioResponse(
                usuarioGuardado.getId(),
                usuarioGuardado.getNombre(),
                usuarioGuardado.getApellido(),
                usuarioGuardado.getEmail()
        );
    }

    /**
     * T - 1.2.2 y T - 1.2.4: Autenticación de usuario (Login) y generación de token JWT
     */
    @Transactional(readOnly = true)
    public UsuarioResponse autenticar(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Las credenciales no pueden ser nulas");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("El correo electrónico es obligatorio");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        String emailNormalizado = request.getEmail().trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByEmail(emailNormalizado)
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        if (passwordEncoder != null && !passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        // T - 1.2.4: Generación del token JWT firmado
        String token = (jwtUtil != null)
                ? jwtUtil.generarToken(usuario.getId(), usuario.getEmail())
                : null;

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                token
        );
    }

    @Transactional(readOnly = true)
    public boolean existeEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        return usuarioRepository.existsByEmail(email.trim().toLowerCase());
    }
}