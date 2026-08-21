package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import java.time.Instant;
import unpsjb.labprog.backend.business.SaldoRepartidorService;
import unpsjb.labprog.backend.repository.RepartidorRepository;

@RestController
@RequestMapping("/repartidores")
@CrossOrigin(origins = "http://localhost:4200")
public class RepartidorPresenter {

    @Autowired
    private RepartidorRepository repartidorRepository;

    @Autowired
    private SaldoRepartidorService saldoRepartidorService;

    @GetMapping
    public ResponseEntity<Object> listar() {
        return Response.ok(
                repartidorRepository.findAll(),
                "REPARTIDORES_LISTADOS"
        );
    }

    @GetMapping("/{codigoRepartidor}/saldo")
    public ResponseEntity<Object> consultarSaldo(
            @PathVariable String codigoRepartidor,
            @RequestParam(required = false) String desde,
            @RequestParam(required = false) String hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {

        if (size <= 0 || size > 100) {
            throw new RuntimeException(
                    "CONFLICTO - PAGINACION_INVALIDA");
        }

        if (desde != null && hasta != null) {

            Instant fechaDesde = Instant.parse(desde);
            Instant fechaHasta = Instant.parse(hasta);

            if (fechaDesde.isAfter(fechaHasta)) {
                throw new RuntimeException(
                        "CONFLICTO - RANGO_FECHAS_INVALIDO");
            }
        }

        return Response.ok(
                saldoRepartidorService.consultarSaldo(codigoRepartidor),
                "OK"
        );
    }
}
