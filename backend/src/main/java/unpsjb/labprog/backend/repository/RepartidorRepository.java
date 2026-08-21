package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import unpsjb.labprog.backend.model.Repartidor;

import java.util.Optional;
import java.util.UUID;

public interface RepartidorRepository extends JpaRepository<Repartidor, UUID> {

    Optional<Repartidor> findByCodigo(String codigo);
}