package unpsjb.labprog.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class Response {

	public static ResponseEntity<Object> response(HttpStatus status, String message, Object responseObj) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("status", status.value());
		map.put("message", message);		
		map.put("data", responseObj);

		return new ResponseEntity<Object>(map,HttpStatus.OK);
	}

	public static ResponseEntity<Object> ok(Object responseObj) {
		return response(HttpStatus.OK, "OK", responseObj);
	}

	public static ResponseEntity<Object> ok(Object responseObj, String msj) {
		return response(HttpStatus.OK, msj, responseObj);
	}

    public static ResponseEntity<Object> notFound() {
        return response(HttpStatus.NOT_FOUND, "Not found", null);
    }

	public static ResponseEntity<Object> notFound(String msj) {
        return response(HttpStatus.NOT_FOUND, msj, null);
    }

}