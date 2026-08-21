package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.ConfiguracionSplit;

import java.util.Optional;

@Repository
public interface ConfiguracionSplitRepository extends JpaRepository<ConfiguracionSplit, Long> {

    @Query("""
            SELECT c
            FROM ConfiguracionSplit c
            WHERE c.moneda = :moneda
              AND c.activa = true
              AND c.codigoRestaurante IS NULL
            """)
    Optional<ConfiguracionSplit> findDefaultActivaByMoneda(String moneda);

    @Query("""
            SELECT c
            FROM ConfiguracionSplit c
            WHERE c.moneda = :moneda
              AND c.activa = true
              AND c.codigoRestaurante = :codigoRestaurante
            """)
    Optional<ConfiguracionSplit> findActivaByMonedaAndRestaurante(
            String moneda,
            String codigoRestaurante
    );
}