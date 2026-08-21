package unpsjb.labprog.backend.model.dto;

import lombok.AllArgsConstructor; 
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;  

@Data
@Builder
@NoArgsConstructor  
@AllArgsConstructor 
public class ConsumidorDTO {
    private String nombre;
    private String email;
    private boolean activo;
}