package unpsjb.labprog.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.NotificacionEta;

@Repository
public interface NotificacionEtaRepository extends JpaRepository<NotificacionEta, UUID> {

    Optional<NotificacionEta> findByEventId(String eventId);

    Optional<NotificacionEta> findTopByIdPedidoOrderByTimestampDesc(String idPedido);
}