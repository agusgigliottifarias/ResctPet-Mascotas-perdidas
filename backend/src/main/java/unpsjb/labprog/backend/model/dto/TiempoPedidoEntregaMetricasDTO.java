package unpsjb.labprog.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TiempoPedidoEntregaMetricasDTO {

    private int cantidadEntregados;
    private long promedioSegundos;
    private long minSegundos;
    private long maxSegundos;
}