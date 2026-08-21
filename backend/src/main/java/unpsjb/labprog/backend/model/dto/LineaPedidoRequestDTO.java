package unpsjb.labprog.backend.model.dto;

import lombok.Data;
import java.util.List;
import unpsjb.labprog.backend.model.Precio;

@Data
public class LineaPedidoRequestDTO {
    private String codigoItem;
    private int cantidad;
    private List<String> adicionales; 
    private String nombre;           
    private Precio precioUnitario;
}