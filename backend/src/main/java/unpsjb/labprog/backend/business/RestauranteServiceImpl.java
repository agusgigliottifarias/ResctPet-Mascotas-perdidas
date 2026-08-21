package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.dto.RestauranteDTO;
import unpsjb.labprog.backend.repository.RestauranteRepository;

@Service
public class RestauranteServiceImpl implements RestauranteService {

    private final RestauranteRepository restauranteRepository;
    private final RestauranteMapper restauranteMapper;

    @Autowired
    public RestauranteServiceImpl(
            RestauranteRepository restauranteRepository,
            RestauranteMapper restauranteMapper
    ) {
        this.restauranteRepository = restauranteRepository;
        this.restauranteMapper = restauranteMapper;
    }

    @Override
    public Page<RestauranteDTO> search(
            String nombre,
            String tipoCocina,
            String ciudad,
            Double lat,
            Double lon,
            Double radio,
            Pageable pageable
    ) {

        String nombreNormalizado = normalizar(nombre);
        String tipoNormalizado = normalizar(tipoCocina);
        String ciudadNormalizada = normalizar(ciudad);

        Page<Restaurante> restaurantes = restauranteRepository.search(
                nombreNormalizado,
                tipoNormalizado,
                ciudadNormalizada,
                lat,
                lon,
                radio,
                pageable
        );

        return restaurantes.map(
                restauranteMapper::toDTO
        );
    }

    private String normalizar(String valor) {

        if (valor == null || valor.trim().isEmpty()) {
            return null;
        }

        return valor.trim();
    }
//nuevo
  @Override
public RestauranteDTO findByCodigo(String codigo) {

    Restaurante restaurante = restauranteRepository.findByCodigo(codigo)
            .orElseThrow(() -> new RuntimeException("CONFLICTO - RESTAURANTE_NO_ENCONTRADO"));

    return restauranteMapper.toDTO(restaurante);
  }
}
