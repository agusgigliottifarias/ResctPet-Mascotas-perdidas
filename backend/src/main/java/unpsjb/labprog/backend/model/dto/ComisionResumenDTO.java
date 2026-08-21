package unpsjb.labprog.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComisionResumenDTO {

    private String moneda;
    private String idRestaurante;
    private Double totalComisiones;
    private Integer cantidadPagos;
    private Double promedioComision;
}