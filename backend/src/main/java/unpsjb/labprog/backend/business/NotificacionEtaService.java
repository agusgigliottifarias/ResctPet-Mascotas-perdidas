package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.dto.NotificacionEtaResponseDTO;
import java.time.Instant;

public interface NotificacionEtaService {

    NotificacionEtaResponseDTO procesarEvento(
            String tipoEvento,
            String eventId,
            String idPedido,
            String idEntrega,
            String idRepartidor,
            String nombreRepartidor,
            String estadoEntrega,
            Instant timestamp,
            Instant eta,
            Instant etaAnterior,
            Instant etaNuevo
    );
}
