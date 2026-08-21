package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ConsumidorService;
import unpsjb.labprog.backend.model.dto.LoginRequest;
import unpsjb.labprog.backend.model.dto.RegisterRequest;

@RestController
@RequestMapping("/api/consumidores")
@CrossOrigin(origins = "http://localhost:4200")
public class ConsumidorPresenter {

    private final ConsumidorService service;

    @Autowired
    public ConsumidorPresenter(ConsumidorService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> registrar(@RequestBody RegisterRequest request) {
        return Response.ok(service.registrar(request), "CREADO");
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest request) {
        return Response.ok(service.login(request), "OK");
    }

    @GetMapping("/perfil")
    public ResponseEntity<Object> obtenerPerfil(@RequestParam String email) {
    return Response.ok(service.buscarPorEmail(email), "OK");
   }

}