package unpsjb.labprog.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import unpsjb.labprog.backend.model.EventoTrazabilidad;
import unpsjb.labprog.backend.model.enums.ActorTrazabilidad;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventoTrazabilidadRepository extends JpaRepository<EventoTrazabilidad, UUID> {

    @Query("""
            SELECT e
            FROM EventoTrazabilidad e
            WHERE e.eventId = :eventId
            """)
    Optional<EventoTrazabilidad> findByEventId(String eventId);

    @Query("""
            SELECT e
            FROM EventoTrazabilidad e
            WHERE e.idPedido = :idPedido
            ORDER BY e.timestamp ASC
            """)
    Page<EventoTrazabilidad> buscarTimelinePorPedido(
            String idPedido,
            Pageable pageable
    );

    @Query("""
            SELECT e
            FROM EventoTrazabilidad e
            WHERE e.idPedido = :idPedido
              AND (:eventType IS NULL OR e.eventType = :eventType)
              AND (:actorTipo IS NULL OR e.actorTipo = :actorTipo)
              AND (:desde IS NULL OR e.timestamp >= :desde)
              AND (:hasta IS NULL OR e.timestamp <= :hasta)
            ORDER BY e.timestamp ASC
            """)
    Page<EventoTrazabilidad> buscarTimeline(
            String idPedido,
            String eventType,
            ActorTrazabilidad actorTipo,
            Instant desde,
            Instant hasta,
            Pageable pageable
    );
}