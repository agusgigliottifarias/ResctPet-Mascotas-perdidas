package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.model.dto.LoginRequest;
import unpsjb.labprog.backend.model.dto.RegisterRequest;

@Component
public class ConsumidorValidator {

    private static final String EMAIL_REGEX =
            "^[A-Za-z0-9+_.-]+@(.+)$";

    public void validarRegistro(RegisterRequest request) {

        if (request.getNombre() == null
                || request.getNombre().isBlank()
                || request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {

            throw new ConsumidorException(
                    "CONFLICTO - CAMPOS_REQUERIDOS"
            );
        }

        validarEmail(request.getEmail());

        if (request.getPassword().length() <= 4) {

            throw new ConsumidorException(
                    "CONFLICTO - PASSWORD_INSEGURA"
            );
        }
    }

    public void validarLogin(LoginRequest request) {

        if (request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {

            throw new ConsumidorException(
                    "CONFLICTO - CAMPOS_REQUERIDOS"
            );
        }

        validarEmail(request.getEmail());
    }

    public void validarEmail(String email) {

        if (email == null
                || !email.matches(EMAIL_REGEX)) {

            throw new ConsumidorException(
                    "CONFLICTO - EMAIL_INVÁLIDO"
            );
        }
    }
}