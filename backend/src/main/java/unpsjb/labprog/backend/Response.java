package unpsjb.labprog.backend;

import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

public class Response {

    public static ResponseEntity<Object> render(Object data, String statusText, int statusCode) {
        Map<String, Object> map = new HashMap<>();
        map.put("data", data);
        map.put("status_text", statusText);
        map.put("status_code", statusCode);
        return ResponseEntity.status(statusCode).body(map);
    }

    public static ResponseEntity<Object> ok(Object data, String statusText) {
        return render(data, statusText, 200);
    }

    public static ResponseEntity<Object> conflict(String statusText) {
        return render(null, statusText, 409);
    }

    public static ResponseEntity<Object> conflict(Object data, String statusText) {
    return render(data, statusText, 409);
    }

    public static ResponseEntity<Object> response(org.springframework.http.HttpStatus status, String message, Object responseObj) {
        return render(responseObj, message, status.value());
    }
}