package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.dto.RankingRepartidorResponseDTO;

public interface RankingRepartidorService {

    RankingRepartidorResponseDTO obtenerRanking(
            String periodo,
            String metrica,
            String orden,
            String zona,
            Integer page,
            Integer size
    );
}
