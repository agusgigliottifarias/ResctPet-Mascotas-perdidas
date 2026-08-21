package unpsjb.labprog.backend.business;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.EventoTrazabilidad;
import unpsjb.labprog.backend.model.enums.ActorTrazabilidad;
import unpsjb.labprog.backend.repository.EventoTrazabilidadRepository;

@Service
public class TrazabilidadServiceImpl implements TrazabilidadService {

    @Autowired
    private EventoTrazabilidadRepository repository;

    @Override
    public Map<String, Object> registrarEvento(EventoTrazabilidad evento) {

        Map<String, Object> response = new HashMap<>();

        var existente = repository.findByEventId(evento.getEventId());

        if (existente.isPresent()) {

            response.put("idPedido", evento.getIdPedido());
            response.put("eventId", evento.getEventId());
            response.put("idempotente", true);

            return response;
        }

        repository.save(evento);

        response.put("idPedido", evento.getIdPedido());
        response.put("eventId", evento.getEventId());
        response.put("idempotente", false);

        return response;
    }

    @Override
    public Page<EventoTrazabilidad> buscarTimeline(
            String idPedido,
            String eventType,
            ActorTrazabilidad actorTipo,
            Instant desde,
            Instant hasta,
            Pageable pageable) {

        if (eventType == null && actorTipo == null && desde == null && hasta == null) {
            return repository.buscarTimelinePorPedido(idPedido, pageable);
        }

        return repository.buscarTimeline(
                idPedido,
                eventType,
                actorTipo,
                desde,
                hasta,
                pageable);
    }
}
