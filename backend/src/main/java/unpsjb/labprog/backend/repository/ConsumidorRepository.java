package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unpsjb.labprog.backend.model.Consumidor;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface ConsumidorRepository extends JpaRepository<Consumidor, UUID> {
    
    @Query("SELECT c FROM Consumidor c WHERE c.email = :email")
    Optional<Consumidor> findByEmail(@Param("email") String email);
}

