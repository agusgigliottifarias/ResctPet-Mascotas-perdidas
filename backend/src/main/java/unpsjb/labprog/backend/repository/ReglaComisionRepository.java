package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.ReglaComision;

import java.time.Instant;
import java.util.List;

@Repository
public interface ReglaComisionRepository extends JpaRepository<ReglaComision, Long> {

    @Query("""
        SELECT r
        FROM ReglaComision r
        WHERE r.moneda = :moneda
          AND r.activa = true
          AND (r.vigenciaDesde IS NULL OR r.vigenciaDesde <= :ahora)
          AND (r.vigenciaHasta IS NULL OR r.vigenciaHasta >= :ahora)
          AND (r.metodoPago IS NULL OR r.metodoPago = :metodoPago)
          AND (
                r.codigoRestaurante = :codigoRestaurante
                OR r.zona = :zona
                OR (r.codigoRestaurante IS NULL AND r.zona IS NULL)
              )
        ORDER BY
          r.prioridad DESC,
          CASE
            WHEN r.codigoRestaurante = :codigoRestaurante THEN 3
            WHEN r.zona = :zona THEN 2
            ELSE 1
          END DESC
        """)
    List<ReglaComision> findReglasAplicables(
            String moneda,
            String codigoRestaurante,
            String zona,
            String metodoPago,
            Instant ahora
    );
}
