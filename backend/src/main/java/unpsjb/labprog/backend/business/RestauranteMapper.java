package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;
import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.dto.RestauranteDTO;

@Component
public class RestauranteMapper {

    public RestauranteDTO toDTO(Restaurante restaurante) {
        RestauranteDTO dto = new RestauranteDTO();
        dto.setCodigo(restaurante.getCodigo());
        dto.setNombre(restaurante.getNombre());
        dto.setTipoCocina(restaurante.getTipoCocina());
        dto.setCiudad(restaurante.getCiudad());
        dto.setAceptaPedidos(restaurante.getAceptaPedidos());
        return dto;
    }
}