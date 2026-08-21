package unpsjb.labprog.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.ItemMenu;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItemMenuRepository extends JpaRepository<ItemMenu, UUID> {

    Optional<ItemMenu> findByCodigoAndMenu_Restaurante_Codigo(
            String codigo,
            String codigoRestaurante
    );
}