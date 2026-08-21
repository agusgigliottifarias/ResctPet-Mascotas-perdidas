package unpsjb.labprog.backend.presenter;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.model.ReglaComision;
import unpsjb.labprog.backend.repository.ReglaComisionRepository;
import unpsjb.labprog.backend.business.ComisionValidator;
import unpsjb.labprog.backend.business.ComisionResumenService;

@RestController
@RequestMapping("/comisiones")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ComisionPresenter {

    private final ReglaComisionRepository reglaComisionRepository;
    private final ComisionValidator comisionValidator;
    private final ComisionResumenService comisionResumenService;

    @PostMapping("/reglas")
    public ResponseEntity<Object> crearRegla(
            @RequestBody ReglaComision regla
    ) {

        comisionValidator.validar(regla);

        reglaComisionRepository.save(regla);

        return Response.ok(
                regla,
                "OK"
        );
    }

    @GetMapping("/reglas")
    public ResponseEntity<Object> listarReglas() {

        return Response.ok(
                reglaComisionRepository.findAll(),
                "OK"
        );
    }

    @GetMapping("/resumen")
    public ResponseEntity<Object> resumen(
            @RequestParam String desde,
            @RequestParam String hasta,
            @RequestParam String moneda,
            @RequestParam(required = false) String idRestaurante
    ) {

        return Response.ok(
                comisionResumenService.obtenerResumen(
                        java.time.Instant.parse(desde),
                        java.time.Instant.parse(hasta),
                        moneda,
                        idRestaurante
                ),
                "OK"
        );
    }
}
