package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;
import unpsjb.labprog.backend.model.Consumidor;
import unpsjb.labprog.backend.model.dto.ConsumidorDTO;

@Component
public class ConsumidorMapper {

    public ConsumidorDTO toDTO(Consumidor c) {
        return ConsumidorDTO.builder()
                .nombre(c.getNombre())
                .email(c.getEmail())
                .activo(c.isActivo())
                .build();
    }
}