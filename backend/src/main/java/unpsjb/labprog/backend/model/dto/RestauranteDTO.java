package unpsjb.labprog.backend.model.dto;

import lombok.AllArgsConstructor; 
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;  

@Data
public class RestauranteDTO {
    private String codigo;
    private String nombre;
    private String tipoCocina;
    private String ciudad;
    private Boolean aceptaPedidos;
}