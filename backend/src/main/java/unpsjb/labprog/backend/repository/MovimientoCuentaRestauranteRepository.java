package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import unpsjb.labprog.backend.model.MovimientoCuentaRestaurante;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface MovimientoCuentaRestauranteRepository
        extends JpaRepository<MovimientoCuentaRestaurante, UUID> {

    List<MovimientoCuentaRestaurante> findByCodigoRestauranteOrderByFechaMovimientoDesc(
            String codigoRestaurante
    );

    List<MovimientoCuentaRestaurante> findByCodigoRestauranteAndFechaMovimientoBetweenOrderByFechaMovimientoDesc(
            String codigoRestaurante,
            Instant desde,
            Instant hasta
    );
}