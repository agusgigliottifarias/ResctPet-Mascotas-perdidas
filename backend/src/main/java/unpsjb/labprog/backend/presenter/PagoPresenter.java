package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.PagoService;
import unpsjb.labprog.backend.model.dto.PagoRequestDTO;
import unpsjb.labprog.backend.model.dto.PagoResponseDTO;

@RestController
@RequestMapping("/pagos")
@CrossOrigin(origins = "*")
public class PagoPresenter {

    @Autowired
    private PagoService pagoService;

    @PostMapping
    public ResponseEntity<Object> pagar(
            @RequestBody PagoRequestDTO request
    ) {
        PagoResponseDTO respuesta
                = pagoService.procesarPago(request);

        return Response.ok(
                respuesta,
                "OK"
        );
    }

    @GetMapping("/{codigoPago}")
    public ResponseEntity<Object> obtenerPago(
            @PathVariable String codigoPago
    ) {
        return Response.ok(
                pagoService.obtenerPago(codigoPago),
                "OK"
        );
    }

    @PostMapping("/{codigoPago}/split")
    public ResponseEntity<Object> ejecutarSplit(
            @PathVariable String codigoPago
    ) {

        return Response.ok(
                pagoService.ejecutarSplit(codigoPago),
                "OK"
        );
    }

    @PostMapping("/{codigoPago}/reembolsar")
    public ResponseEntity<Object> reembolsarPago(
            @PathVariable String codigoPago
    ) {

        return Response.ok(
                pagoService.reembolsarPago(
                        codigoPago
                ),
                "OK"
        );
    }
}
