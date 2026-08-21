package unpsjb.labprog.backend.business;

import java.time.Instant;

import unpsjb.labprog.backend.model.dto.DistribucionPagosResponseDTO;

public interface MetricasPagoService {

    DistribucionPagosResponseDTO obtenerDistribucionPagos(
            Instant desde,
            Instant hasta,
            String moneda,
            Integer bucketSize,
            String idRestaurante,
            String zona,
            String idConsumidor,
            String destinoSplit,
            Boolean incluirSplits,
            Boolean incluirNoCapturados,
            Double outlierThreshold,
            Integer outliersPage,
            Integer outliersSize
    );
}