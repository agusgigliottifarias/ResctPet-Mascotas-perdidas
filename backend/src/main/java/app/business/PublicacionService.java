package app.business;

import app.model.Publicacion;
import app.model.Usuario;
import app.model.dto.PublicacionRequest;
import app.model.dto.PublicacionResponse;
import app.model.validation.PublicacionValidator;
import app.repository.PublicacionRepository;
import app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublicacionService {

    private final PublicacionRepository publicacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public PublicacionService(PublicacionRepository publicacionRepository, UsuarioRepository usuarioRepository) {
        this.publicacionRepository = publicacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PublicacionResponse guardar(PublicacionRequest request) {
        PublicacionValidator.validar(request);

        Publicacion publicacion = new Publicacion();
        publicacion.setTipoPublicacion(request.getTipoPublicacion());
        publicacion.setEspecie(request.getEspecie());
        publicacion.setFecha(request.getFecha());
        publicacion.setCaracteristicas(request.getCaracteristicas());
        
        publicacion.setFotografia(request.getFotografia());
        
        publicacion.setLatitud(request.getLatitud());
        publicacion.setLongitud(request.getLongitud());

        if (request.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(request.getUsuarioId()).orElse(null);
            publicacion.setUsuario(usuario);
        }

        Publicacion guardada = publicacionRepository.save(publicacion);

        Long usuarioId = guardada.getUsuario() != null ? guardada.getUsuario().getId() : null;

        return new PublicacionResponse(
            guardada.getId(),
            guardada.getTipoPublicacion(),
            guardada.getEspecie(),
            guardada.getFecha(),
            guardada.getCaracteristicas(),
            guardada.getFotografia(),
            guardada.getLatitud(),
            guardada.getLongitud(),
            usuarioId,
            guardada.getFechaCreacion()
        );
    }
}