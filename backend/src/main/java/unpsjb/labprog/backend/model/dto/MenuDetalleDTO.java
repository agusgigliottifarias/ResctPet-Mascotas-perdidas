package unpsjb.labprog.backend.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class MenuDetalleDTO {
    private String codigoRestaurante;
    private String nombreRestaurante;
    private MenuDTO menu;
    private List<String> metodosPago;
}