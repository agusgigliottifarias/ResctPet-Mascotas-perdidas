package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.dto.TiempoPedidoEntregaMetricasDTO;

import java.time.Instant;

public interface TiempoPedidoEntregaService {

    TiempoPedidoEntregaMetricasDTO calcular(
            Instant desde,
            Instant hasta
    );
}