package unpsjb.labprog.backend.business;

import lombok.Getter;

@Getter
public class TrackingException extends RuntimeException {

    private final Object data;

    public TrackingException(String message, Object data) {
        super(message);
        this.data = data;
    }
}
