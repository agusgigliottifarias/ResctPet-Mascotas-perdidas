package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.dto.RankingRestauranteResponseDTO;

public interface RankingRestauranteService {

    RankingRestauranteResponseDTO obtenerRanking(
            String periodo,
            String metrica,
            String orden,
            String zona,
            Integer page,
            Integer size
    );
}