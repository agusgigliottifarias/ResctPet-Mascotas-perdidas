package unpsjb.labprog.backend.presenter;

import java.time.Instant;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.MetricasPagoService;
import unpsjb.labprog.backend.model.dto.DistribucionPagosResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/metricas/pagos")
@CrossOrigin(origins = "*")
public class MetricasPagoPresenter {

    private final MetricasPagoService metricasPagoService;

    @GetMapping("/distribucion")
    public ResponseEntity<Object> obtenerDistribucionPagos(
            @RequestParam String desde,
            @RequestParam String hasta,
            @RequestParam(defaultValue = "ARS") String moneda,
            @RequestParam(required = false) Integer bucketSize,
            @RequestParam(required = false) String idRestaurante,
            @RequestParam(required = false) String zona,
            @RequestParam(required = false) String idConsumidor,
            @RequestParam(required = false) String destinoSplit,
            @RequestParam(defaultValue = "false") Boolean incluirSplits,
            @RequestParam(defaultValue = "false") Boolean incluirNoCapturados,
            @RequestParam(required = false) Double outlierThreshold,
            @RequestParam(defaultValue = "0") Integer outliersPage,
            @RequestParam(defaultValue = "10") Integer outliersSize
    ) {
        DistribucionPagosResponseDTO respuesta =
                metricasPagoService.obtenerDistribucionPagos(
                        Instant.parse(desde),
                        Instant.parse(hasta),
                        moneda,
                        bucketSize,
                        idRestaurante,
                        zona,
                        idConsumidor,
                        destinoSplit,
                        incluirSplits,
                        incluirNoCapturados,
                        outlierThreshold,
                        outliersPage,
                        outliersSize
                );

        return Response.ok(respuesta, "OK");
    }
}