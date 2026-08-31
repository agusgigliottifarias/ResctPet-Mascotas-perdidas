package app;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import lombok.Getter;

@Getter
public class Response {
    private int status;
    private String message;
    private Object data;

    public Response(HttpStatus status, String message, Object data) {
        this.status = status.value();
        this.message = message;
        this.data = data;
    }

    public static ResponseEntity<Response> response(HttpStatus status, String message, Object data) {
        return new ResponseEntity<>(new Response(status, message, data), status);
    }
}
