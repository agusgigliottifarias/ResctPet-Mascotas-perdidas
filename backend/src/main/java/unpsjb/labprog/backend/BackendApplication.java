package unpsjb.labprog.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration; 
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import unpsjb.labprog.backend.Response;

@RestController
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class BackendApplication {

    @RequestMapping(value = "/", method=RequestMethod.GET)
    public ResponseEntity home() {
        return Response.response(
            HttpStatus.OK,
            "Server Online",
            "Backend Funcionando 👍");
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}