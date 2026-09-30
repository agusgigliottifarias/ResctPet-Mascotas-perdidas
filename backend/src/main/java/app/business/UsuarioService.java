package app.business;

import app.model.Usuario;
import app.model.dto.UsuarioRequest;
import app.model.dto.UsuarioResponse;
import app.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Patrón Regex para validar formato de correo electrónico
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registro completo de usuario:
     * - T - 1.1.5: Validación de correo único y normalización.
     * - T - 1.1.6: Encriptación de contraseña con BCrypt y respuesta segura DTO.
     * - T - 1.1.7: Manejo de datos faltantes o inválidos.
     */
    @Transactional
    public UsuarioResponse registrar(UsuarioRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Los datos de usuario no pueden ser nulos");
        }

        // T - 1.1.7: Validaciones de campos obligatorios
        if (request.getNombre() == null || request.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        if (request.getApellido() == null || request.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("El correo electrónico es obligatorio");
        }

        // T - 1.1.5: Normalización y validación de correo único
        String emailNormalizado = request.getEmail().trim().toLowerCase();

        // T - 1.1.7: Validación de formato de correo
        if (!EMAIL_PATTERN.matcher(emailNormalizado).matches()) {
            throw new IllegalArgumentException("El formato del correo electrónico es inválido");
        }

        if (usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new IllegalArgumentException("El correo electrónico ya se encuentra registrado");
        }

        // T - 1.1.7: Validaciones de contraseña
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        // T - 1.1.6: Encriptación de contraseña con BCrypt
        String passwordEncriptada = (passwordEncoder != null)
                ? passwordEncoder.encode(request.getPassword())
                : request.getPassword();

        // Guardado de la entidad
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre().trim());
        usuario.setApellido(request.getApellido().trim());
        usuario.setEmail(emailNormalizado);
        usuario.setPassword(passwordEncriptada);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // T - 1.1.6: Retorno de DTO seguro sin la contraseña
        return new UsuarioResponse(
                usuarioGuardado.getId(),
                usuarioGuardado.getNombre(),
                usuarioGuardado.getApellido(),
                usuarioGuardado.getEmail()
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