package unpsjb.labprog.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unpsjb.labprog.backend.model.Restaurante;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RestauranteRepository extends JpaRepository<Restaurante, UUID> {

    @Query("""
        SELECT r FROM Restaurante r
        WHERE r.aceptaPedidos = true
        AND (:nombre IS NULL OR :nombre = '' OR 
            unaccent(LOWER(r.nombre)) LIKE unaccent(LOWER(CONCAT('%', :nombre, '%'))) OR
            unaccent(LOWER(r.tipoCocina)) LIKE unaccent(LOWER(CONCAT('%', :nombre, '%'))))
        AND (:tipoCocina IS NULL OR :tipoCocina = '' OR r.tipoCocina = :tipoCocina)
        AND (:ciudad IS NULL OR :ciudad = '' OR LOWER(r.ciudad) = LOWER(:ciudad))
        AND (:lat IS NULL OR :lon IS NULL OR :radio IS NULL OR
            (6371 * acos(
                cos(radians(:lat)) * cos(radians(r.latitud)) * 
                cos(radians(r.longitud) - radians(:lon)) + 
                sin(radians(:lat)) * sin(radians(r.latitud))
            ) <= :radio))
    """)
    Page<Restaurante> search(
            @Param("nombre") String nombre,
            @Param("tipoCocina") String tipoCocina,
            @Param("ciudad") String ciudad,
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radio") Double radio,
            Pageable pageable
    );

    boolean existsByCodigo(String codigo);

    Optional<Restaurante> findByCodigo(String codigo);

    @Query("""
        SELECT COUNT(r)
        FROM Restaurante r
        WHERE LOWER(r.ciudad) = LOWER(:zona)
    """)
    long countByCiudadIgnoreCase(
            @Param("zona") String zona
    );

}
