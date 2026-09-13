package app;

import app.model.Usuario;
import app.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@SpringBootApplication
public class AppApplication {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<Response> home() {
        return Response.response(
            HttpStatus.OK,
            "Server Online",
            "Backend ResctPet Funcionando"
        );
    }

    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }

    @Bean
    CommandLineRunner crearUsuarioDePrueba(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String email = "test@resctpet.com";

            if (!usuarioRepository.existsByEmail(email)) {

                Usuario usuario = new Usuario(
                        "Usuario",
                        "Prueba",
                        email,
                        passwordEncoder.encode("123456")
                );

                usuarioRepository.save(usuario);

                System.out.println("Usuario de prueba creado: " + email);
            }
        };
    }
}