package unpsjb.labprog.backend.presenter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.Instant;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.EntregaEtaService;
import unpsjb.labprog.backend.model.dto.EtaResponseDTO;

@RestController
@RequiredArgsConstructor
public class EntregaPresenter {

    private final EntregaEtaService entregaEtaService;

    @PostMapping("/entregas/{codigoEntrega}/eta/calcular")
    public ResponseEntity<Object> calcularEta(
            @PathVariable String codigoEntrega,
            @RequestParam(required = false) Instant timestampCalculo,
            @RequestParam(required = false) String tipoVehiculo,
            @RequestParam(defaultValue = "false") Boolean servicioExternoDisponible,
            @RequestParam(defaultValue = "false") Boolean cambioEstado
    ) {

        EtaResponseDTO.Resultado resultado
                = entregaEtaService.calcularEta(
                        codigoEntrega,
                        timestampCalculo,
                        tipoVehiculo,
                        servicioExternoDisponible,
                        cambioEstado
                );

        return Response.ok(
                resultado.getData(),
                resultado.getStatusText()
        );
    }
}
