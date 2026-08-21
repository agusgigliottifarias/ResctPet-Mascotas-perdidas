package unpsjb.labprog.backend.business;

import lombok.Getter;

@Getter
public class PagoFallidoException extends RuntimeException {

    private final Object data;

    public PagoFallidoException(
            String mensaje,
            Object data
    ) {
        super(mensaje);
        this.data = data;
    }
}