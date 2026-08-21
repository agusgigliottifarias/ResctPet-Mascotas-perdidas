package unpsjb.labprog.backend.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class DireccionDTO {
    private String calle;
    private String numero;
    private String ciudad;
    private String provincia;
    private List<Double> ubicacion; 
}