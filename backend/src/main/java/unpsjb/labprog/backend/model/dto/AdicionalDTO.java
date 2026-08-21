package unpsjb.labprog.backend.model.dto;

import lombok.AllArgsConstructor; 
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Precio;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor 
public class AdicionalDTO {
    private String codigo;
    private String nombre;
    private Precio precio;
}