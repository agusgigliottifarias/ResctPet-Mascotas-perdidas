package unpsjb.labprog.backend.business;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import unpsjb.labprog.backend.model.EventoTrazabilidad;
import unpsjb.labprog.backend.model.enums.ActorTrazabilidad;

import java.time.Instant;
import java.util.Map;

public interface TrazabilidadService {

    Map<String, Object> registrarEvento(EventoTrazabilidad evento);

    Page<EventoTrazabilidad> buscarTimeline(
            String idPedido,
            String eventType,
            ActorTrazabilidad actorTipo,
            Instant desde,
            Instant hasta,
            Pageable pageable
    );
}