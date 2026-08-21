package unpsjb.labprog.backend.presenter;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.business.TiempoPedidoEntregaService;
import unpsjb.labprog.backend.model.dto.TiempoPedidoEntregaMetricasDTO;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/metricas/tiempo-pedido-entrega")
@CrossOrigin(origins = "*")
public class TiempoPedidoEntregaPresenter {

    private final TiempoPedidoEntregaService tiempoPedidoEntregaService;

    @GetMapping
    public ResponseEntity<?> obtenerMetricas(
            @RequestParam String desde,
            @RequestParam String hasta
    ) {

        TiempoPedidoEntregaMetricasDTO metricas =
                tiempoPedidoEntregaService.calcular(
                        Instant.parse(desde),
                        Instant.parse(hasta)
                );

        return ResponseEntity.ok(
                new Respuesta(
                        200,
                        "OK",
                        metricas
                )
        );
    }

    public record Respuesta(
            int status_code,
            String status_text,
            Object data
    ) {
    }
}