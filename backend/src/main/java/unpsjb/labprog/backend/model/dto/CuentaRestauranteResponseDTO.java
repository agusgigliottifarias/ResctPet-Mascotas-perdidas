package unpsjb.labprog.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import unpsjb.labprog.backend.model.Precio;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
public class CuentaRestauranteResponseDTO {

    private String codigoRestaurante;
    private Precio saldo;
    private List<MovimientoDTO> movimientos;

    @Data
    @AllArgsConstructor
    public static class MovimientoDTO {
        private String tipo;
        private String codigoPedido;
        private Precio monto;
        private Instant fechaMovimiento;
        private String descripcion;
    }
}