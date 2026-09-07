package app.repository;

import app.model.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    List<Publicacion> findByUsuarioId(Long usuarioId);

    List<Publicacion> findByLatitudBetweenAndLongitudBetween(
        Double latitudMin, Double latitudMax, 
        Double longitudMin, Double longitudMax
    );
}