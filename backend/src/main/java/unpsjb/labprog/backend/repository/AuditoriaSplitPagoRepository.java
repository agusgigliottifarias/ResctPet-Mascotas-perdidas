package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.AuditoriaSplitPago;

@Repository
public interface AuditoriaSplitPagoRepository
        extends JpaRepository<AuditoriaSplitPago, Long> {
}