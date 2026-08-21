package unpsjb.labprog.backend.business;

import java.util.Map;

import lombok.Getter;

@Getter
public class NotificacionEtaException extends RuntimeException {

    private final String statusText;
    private final Map<String, Object> data;

    public NotificacionEtaException(
            String statusText,
            Map<String, Object> data
    ) {
        super(statusText);
        this.statusText = statusText;
        this.data = data;
    }
}