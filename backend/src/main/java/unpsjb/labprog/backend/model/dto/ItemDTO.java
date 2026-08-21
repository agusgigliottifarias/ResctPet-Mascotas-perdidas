package unpsjb.labprog.backend.model.dto;

import lombok.AllArgsConstructor; 
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Precio;
import java.util.List;
import lombok.Data;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor 
public class ItemDTO {
    private String codigo;
    private String nombre;
    private Precio precio;
    private boolean disponible;
    private List<AdicionalDTO> adicionales;
}