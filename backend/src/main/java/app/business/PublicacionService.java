package app.business;

import app.model.Publicacion;
import app.model.Usuario;
import app.model.dto.PublicacionRequest;
import app.model.dto.PublicacionResponse;
import app.model.validation.PublicacionValidator;
import app.repository.PublicacionRepository;
import app.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;

@Service
public class PublicacionService {

    private final PublicacionRepository publicacionRepository;
    private final UsuarioRepository usuarioRepository;

    public PublicacionService(
            PublicacionRepository publicacionRepository,
            UsuarioRepository usuarioRepository) {

        this.publicacionRepository = publicacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PublicacionResponse guardar(
            PublicacionRequest request,
            Authentication authentication) {

        PublicacionValidator.validar(request);

        Publicacion publicacion = new Publicacion();

        publicacion.setTipoPublicacion(request.getTipoPublicacion());
        publicacion.setEspecie(request.getEspecie());
        publicacion.setRaza(request.getRaza());
        publicacion.setEdad(request.getEdad());
        publicacion.setFecha(request.getFecha());
        publicacion.setCaracteristicas(request.getCaracteristicas());
        publicacion.setFotografia(request.getFotografia());
        publicacion.setLatitud(request.getLatitud());
        publicacion.setLongitud(request.getLongitud());

        String email = authentication.getName();

        Usuario usuario = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El usuario autenticado no existe"));

        publicacion.setUsuario(usuario);

        Publicacion guardada = publicacionRepository.save(publicacion);

        return new PublicacionResponse(
                guardada.getId(),
                guardada.getTipoPublicacion(),
                guardada.getEspecie(),
                guardada.getRaza(),
                guardada.getEdad(),
                guardada.getFecha(),
                guardada.getCaracteristicas(),
                guardada.getFotografia(),
                guardada.getLatitud(),
                guardada.getLongitud(),
                guardada.getFechaCreacion());
    }

    @Transactional(readOnly = true)
    public PublicacionResponse consultar(Long id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException(
                    "El ID de la publicación debe ser un número positivo válido");
        }

        Publicacion publicacion = publicacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró la publicación con ID: " + id));

        Double latitudAproximada = aproximarCoordenada(publicacion.getLatitud());
        Double longitudAproximada = aproximarCoordenada(publicacion.getLongitud());

        return new PublicacionResponse(
                publicacion.getId(),
                publicacion.getTipoPublicacion(),
                publicacion.getEspecie(),
                publicacion.getRaza(),
                publicacion.getEdad(),
                publicacion.getFecha(),
                publicacion.getCaracteristicas(),
                publicacion.getFotografia(),
                latitudAproximada,
                longitudAproximada,
                publicacion.getFechaCreacion());
    }

    private Double aproximarCoordenada(Double coordenada) {
        if (coordenada == null) {
            return null;
        }
        return Math.round(coordenada * 100.0) / 100.0;
    }

}