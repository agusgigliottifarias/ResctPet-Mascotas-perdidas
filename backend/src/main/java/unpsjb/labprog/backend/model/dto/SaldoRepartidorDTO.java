package unpsjb.labprog.backend.model.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaldoRepartidorDTO {

    private String idRepartidor;
    private String moneda;

    private BigDecimal saldoLiquidable;
    private BigDecimal saldoEnLiquidacion;
    private BigDecimal saldoPagado;

    private Instant ultimaActualizacion;

    private List<Movimiento> movimientos;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Movimiento {

        private String tipo;
        private String idReferencia;
        private double monto;
        private Instant timestamp;
    }
}