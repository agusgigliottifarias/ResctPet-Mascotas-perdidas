package unpsjb.labprog.backend.business;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import unpsjb.labprog.backend.model.dto.RestauranteDTO;

public interface RestauranteService {

    Page<RestauranteDTO> search(
            String nombre,
            String tipoCocina,
            String ciudad,
            Double lat,
            Double lon,
            Double radio,
            Pageable pageable
    );

    RestauranteDTO findByCodigo(String codigo);
}