package unpsjb.labprog.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Menu;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MenuRepository extends JpaRepository<Menu, UUID> {

    @Query("""
            SELECT m
            FROM Menu m
            WHERE m.restaurante.codigo = :codigoRestaurante
            """)
    Page<Menu> findByCodigoRestaurante(
            @Param("codigoRestaurante") String codigoRestaurante,
            Pageable pageable
    );

    @Query("""
            SELECT m
            FROM Menu m
            WHERE m.restaurante.codigo = :codigoRestaurante
            AND m.activo = :activo
            """)
    Page<Menu> findByCodigoRestauranteAndActivo(
            @Param("codigoRestaurante") String codigoRestaurante,
            @Param("activo") Boolean activo,
            Pageable pageable
    );

    @Query("""
            SELECT m
            FROM Menu m
            WHERE m.restaurante.codigo = :codigoRestaurante
            AND m.principal = true
            """)
    Optional<Menu> findPrincipalByCodigoRestaurante(
            @Param("codigoRestaurante") String codigoRestaurante
    );

    @Query("""
            SELECT m
            FROM Menu m
            WHERE m.codigo = :codigoMenu
            AND m.restaurante.codigo = :codigoRestaurante
            """)
    Optional<Menu> findByCodigoMenuAndCodigoRestaurante(
            @Param("codigoMenu") String codigoMenu,
            @Param("codigoRestaurante") String codigoRestaurante
    );
}
