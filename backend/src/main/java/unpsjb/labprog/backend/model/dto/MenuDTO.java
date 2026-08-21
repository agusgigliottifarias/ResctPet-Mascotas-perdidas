package unpsjb.labprog.backend.model.dto;

import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuDTO {
    private String codigo;
    private String nombre;
    private Boolean activo;
    private List<ItemDTO> items;
}