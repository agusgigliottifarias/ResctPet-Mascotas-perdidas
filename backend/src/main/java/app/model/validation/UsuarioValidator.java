package app.model.validation;

import app.model.Usuario;

public class UsuarioValidator {

    public static void validar(Usuario usuario) {

        if (usuario == null) {
            throw new IllegalArgumentException("El usuario no puede ser nulo");
        }

        if (usuario.getNombre() == null || usuario.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        if (usuario.getApellido() == null || usuario.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }

        if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
    }
}