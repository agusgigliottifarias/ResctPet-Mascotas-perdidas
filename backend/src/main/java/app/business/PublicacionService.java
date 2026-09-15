package app.business;

import app.model.Publicacion;
import app.model.Usuario;
import app.model.dto.BusquedaPublicacionRequest;
import app.model.dto.PublicacionRequest;
import app.model.dto.PublicacionResponse;
import app.model.enums.Especie;
import app.model.validation.PublicacionValidator;
import app.repository.PublicacionRepository;
import app.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

        return new PublicacionResponse(
                publicacion.getId(),
                publicacion.getTipoPublicacion(),
                publicacion.getEspecie(),
                publicacion.getRaza(),
                publicacion.getEdad(),
                publicacion.getFecha(),
                publicacion.getCaracteristicas(),
                publicacion.getFotografia(),
                aproximarCoordenada(publicacion.getLatitud()),
                aproximarCoordenada(publicacion.getLongitud()),
                publicacion.getFechaCreacion());
    }

    /**
     * Búsqueda general combinando todos los criterios disponibles.
     */
    @Transactional(readOnly = true)
    public List<PublicacionResponse> buscar(
            BusquedaPublicacionRequest request) {

        List<Publicacion> publicaciones =
                publicacionRepository.findAll();

        return publicaciones.stream()

                // Filtro por especie
                .filter(p -> request.getEspecie() == null
                        || p.getEspecie() == request.getEspecie())

                // Filtro por tipo de publicación
                .filter(p -> request.getTipoPublicacion() == null
                        || p.getTipoPublicacion()
                        == request.getTipoPublicacion())

                // Filtro por fecha
                .filter(p -> request.getFecha() == null
                        || request.getFecha().isBlank()
                        || p.getFecha().contains(request.getFecha()))

                // Filtro por raza
                .filter(p -> request.getRaza() == null
                        || request.getRaza().isBlank()
                        || (p.getRaza() != null
                        && p.getRaza().toLowerCase()
                        .contains(request.getRaza().toLowerCase())))

                // Filtro por características
                .filter(p -> request.getCaracteristicas() == null
                        || request.getCaracteristicas().isBlank()
                        || (p.getCaracteristicas() != null
                        && p.getCaracteristicas().toLowerCase()
                        .contains(request.getCaracteristicas().toLowerCase())))

                .sorted((p1, p2) -> {
                    if (p1.getFechaCreacion() == null
                            || p2.getFechaCreacion() == null) {
                        return 0;
                    }

                    return p2.getFechaCreacion()
                            .compareTo(p1.getFechaCreacion());
                })

                .map(p -> new PublicacionResponse(
                        p.getId(),
                        p.getTipoPublicacion(),
                        p.getEspecie(),
                        p.getRaza(),
                        p.getEdad(),
                        p.getFecha(),
                        p.getCaracteristicas(),
                        p.getFotografia(),
                        aproximarCoordenada(p.getLatitud()),
                        aproximarCoordenada(p.getLongitud()),
                        p.getFechaCreacion()))

                .collect(Collectors.toList());
    }

    /**
     * Filtra las publicaciones únicamente por especie.
     */
    @Transactional(readOnly = true)
    public List<PublicacionResponse> buscarPorEspecie(
            Especie especie) {

        if (especie == null) {
            throw new IllegalArgumentException(
                    "La especie es obligatoria para realizar el filtro");
        }

        return publicacionRepository.findAll().stream()
                .filter(p -> p.getEspecie() == especie)
                .sorted((p1, p2) -> {
                    if (p1.getFechaCreacion() == null
                            || p2.getFechaCreacion() == null) {
                        return 0;
                    }

                    return p2.getFechaCreacion()
                            .compareTo(p1.getFechaCreacion());
                })
                .map(p -> new PublicacionResponse(
                        p.getId(),
                        p.getTipoPublicacion(),
                        p.getEspecie(),
                        p.getRaza(),
                        p.getEdad(),
                        p.getFecha(),
                        p.getCaracteristicas(),
                        p.getFotografia(),
                        aproximarCoordenada(p.getLatitud()),
                        aproximarCoordenada(p.getLongitud()),
                        p.getFechaCreacion()))
                .collect(Collectors.toList());
    }

    private Double aproximarCoordenada(Double coordenada) {

        if (coordenada == null) {
            return null;
        }

        return Math.round(coordenada * 100.0) / 100.0;
    }
}