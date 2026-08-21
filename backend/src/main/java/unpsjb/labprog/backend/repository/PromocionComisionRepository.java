package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.PromocionComision;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface PromocionComisionRepository
        extends JpaRepository<PromocionComision, Long> {

    @Query("""
            SELECT p
            FROM PromocionComision p
            WHERE p.codigoRestaurante = :codigoRestaurante
              AND p.activa = true
              AND (p.vigenciaDesde IS NULL OR p.vigenciaDesde <= :ahora)
              AND (p.vigenciaHasta IS NULL OR p.vigenciaHasta >= :ahora)
            """)
    Optional<PromocionComision> findActivaByRestaurante(
            String codigoRestaurante,
            Instant ahora
    );
}