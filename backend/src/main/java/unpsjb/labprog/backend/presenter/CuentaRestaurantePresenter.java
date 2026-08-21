package unpsjb.labprog.backend.presenter;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import unpsjb.labprog.backend.business.CuentaRestauranteService;
import unpsjb.labprog.backend.model.MovimientoCuentaRestaurante;
import unpsjb.labprog.backend.model.Precio;
import unpsjb.labprog.backend.model.dto.CuentaRestauranteResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/restaurantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CuentaRestaurantePresenter {

    private final CuentaRestauranteService cuentaRestauranteService;

    @GetMapping("/{codigoRestaurante}/cuenta-corriente")
    public CuentaRestauranteResponseDTO obtenerCuentaCorriente(
            @PathVariable String codigoRestaurante
    ) {
        Precio saldo = cuentaRestauranteService.calcularSaldo(codigoRestaurante);

        List<CuentaRestauranteResponseDTO.MovimientoDTO> movimientos =
                cuentaRestauranteService
                        .listarMovimientos(codigoRestaurante)
                        .stream()
                        .map(this::toDTO)
                        .toList();

        return new CuentaRestauranteResponseDTO(
                codigoRestaurante,
                saldo,
                movimientos
        );
    }

    private CuentaRestauranteResponseDTO.MovimientoDTO toDTO(
            MovimientoCuentaRestaurante movimiento
    ) {
        return new CuentaRestauranteResponseDTO.MovimientoDTO(
                movimiento.getTipo(),
                movimiento.getCodigoPedido(),
                movimiento.getMonto(),
                movimiento.getFechaMovimiento(),
                movimiento.getDescripcion()
        );
    }
}