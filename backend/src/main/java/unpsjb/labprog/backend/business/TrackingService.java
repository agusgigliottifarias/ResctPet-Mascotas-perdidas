package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.dto.TrackingEventoResultadoDTO;
import unpsjb.labprog.backend.model.dto.TrackingResponseDTO;

public interface TrackingService {

    TrackingResponseDTO consultarTracking(
            String codigoPedido,
            String emailConsumidor
    );

    TrackingEventoResultadoDTO procesarEvento(
            String codigoEntrega,
            String tipoEvento,
            Entrega entregaEvento
    );
}
