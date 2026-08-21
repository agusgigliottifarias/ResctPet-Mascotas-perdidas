package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.EventoSplitPago;

@Repository
public interface EventoSplitPagoRepository
        extends JpaRepository<EventoSplitPago, Long> {
}