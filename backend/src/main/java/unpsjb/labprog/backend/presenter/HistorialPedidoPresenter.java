package unpsjb.labprog.backend.presenter;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.business.HistorialPedidoService;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/historial/consumidores")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class HistorialPedidoPresenter {

    private final HistorialPedidoService historialPedidoService;

    @GetMapping("/{emailConsumidor}/pedidos")
    public Map<String, Object> obtenerHistorial(
            @PathVariable String emailConsumidor,

            @RequestParam(required = false)
            String estado,

            @RequestParam(required = false)
            String desde,

            @RequestParam(required = false)
            String hasta,

            @RequestParam(required = false)
            String idRestaurante,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        Map<String, Object> historial =
                historialPedidoService.obtenerHistorial(
                        emailConsumidor,
                        estado,
                        parseInstant(desde),
                        parseInstant(hasta),
                        idRestaurante,
                        page,
                        size
                );

        return Map.of(
                "status_text", "OK",
                "status_code", 200,
                "data", historial
        );
    }

    private Instant parseInstant(
            String valor
    ) {

        if (valor == null || valor.isBlank()) {
            return null;
        }

        return Instant.parse(valor);
    }
}