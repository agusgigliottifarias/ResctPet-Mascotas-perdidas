package app.business;

import app.model.Publicacion;
import app.model.Usuario;
import app.model.dto.BusquedaPublicacionRequest;
import app.model.dto.PublicacionPageResponse;
import app.model.dto.PublicacionRequest;
import app.model.dto.PublicacionResponse;
import app.model.enums.Especie;
import app.model.enums.TipoPublicacion;
import app.model.validation.PublicacionValidator;
import app.repository.PublicacionRepository;
import app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicacionService {

    private final PublicacionRepository publicacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Value("${rescpet.busqueda.radio-mvp-km:5.0}")
    private double radioMvpKm;

    public PublicacionService(
            PublicacionRepository publicacionRepository,
            UsuarioRepository usuarioRepository) {

        this.publicacionRepository = publicacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public double getRadioMvpKm() {
        return radioMvpKm;
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

        Usuario usuario = usuarioRepository
                .findById(request.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "El usuario indicado no existe"));

        publicacion.setUsuario(usuario);

        Publicacion guardada = publicacionRepository.save(publicacion);

        return mapToResponse(guardada);
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

        return mapToResponse(publicacion);
    }

    /**
     * Valida que la publicación seleccionada exista y cuente con
     * los datos necesarios para realizar búsquedas.
     */
    @Transactional(readOnly = true)
    public Publicacion validarPublicacionSeleccionada(Long publicacionId) {

        if (publicacionId == null || publicacionId <= 0) {
            throw new IllegalArgumentException(
                    "El ID de la publicación seleccionada debe ser un número positivo válido");
        }

        Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "La publicación seleccionada con ID " + publicacionId + " no existe"));

        if (publicacion.getLatitud() == null || publicacion.getLongitud() == null) {
            throw new IllegalStateException(
                    "La publicación seleccionada no posee coordenadas válidas para realizar la búsqueda");
        }

        return publicacion;
    }

    /**
     * Realiza la búsqueda de coincidencias utilizando una publicación seleccionada como referencia.
     */
    @Transactional(readOnly = true)
    public List<PublicacionResponse> buscarPorPublicacionSeleccionada(
            Long publicacionId,
            Double radioKm) {

        Publicacion publicacionBase =
                validarPublicacionSeleccionada(publicacionId);

        TipoPublicacion tipoBuscado =
                (publicacionBase.getTipoPublicacion() == TipoPublicacion.PERDIDA)
                        ? TipoPublicacion.ENCONTRADA
                        : TipoPublicacion.PERDIDA;

        BusquedaPublicacionRequest request =
                new BusquedaPublicacionRequest();

        request.setEspecie(publicacionBase.getEspecie());
        request.setTipoPublicacion(tipoBuscado);
        request.setLatitud(publicacionBase.getLatitud());
        request.setLongitud(publicacionBase.getLongitud());
        request.setRadioKm(radioKm);

        return buscar(request);
    }

    /**
     * Búsqueda general combinando todos los criterios disponibles,
     * incluyendo el filtro de cercanía geográfica.
     */
    @Transactional(readOnly = true)
    public List<PublicacionResponse> buscar(
            BusquedaPublicacionRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Los criterios de búsqueda son obligatorios");
        }

        boolean aplicarFiltroGeografico =
                request.getLatitud() != null
                        && request.getLongitud() != null;

        if (aplicarFiltroGeografico) {

            if (request.getLatitud() < -90.0
                    || request.getLatitud() > 90.0) {

                throw new IllegalArgumentException(
                        "La latitud debe estar entre -90 y 90");
            }

            if (request.getLongitud() < -180.0
                    || request.getLongitud() > 180.0) {

                throw new IllegalArgumentException(
                        "La longitud debe estar entre -180 y 180");
            }

            if (request.getRadioKm() != null
                    && request.getRadioKm() <= 0) {

                throw new IllegalArgumentException(
                        "El radio debe ser mayor a 0");
            }
        }

        double radioEfectivo =
                (request.getRadioKm() != null
                        && request.getRadioKm() > 0)
                        ? request.getRadioKm()
                        : radioMvpKm;

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
                        && p.getRaza()
                        .toLowerCase()
                        .contains(request.getRaza().toLowerCase())))

                // Filtro por características
                .filter(p -> request.getCaracteristicas() == null
                        || request.getCaracteristicas().isBlank()
                        || (p.getCaracteristicas() != null
                        && p.getCaracteristicas()
                        .toLowerCase()
                        .contains(request.getCaracteristicas().toLowerCase())))

                // Filtro geográfico
                .filter(p -> !aplicarFiltroGeografico
                        || (p.getLatitud() != null
                        && p.getLongitud() != null
                        && calcularDistanciaKm(
                        request.getLatitud(),
                        request.getLongitud(),
                        p.getLatitud(),
                        p.getLongitud()) <= radioEfectivo))

                // Ordenar de más reciente a más antigua
                .sorted((p1, p2) -> {

                    if (p1.getFechaCreacion() == null
                            || p2.getFechaCreacion() == null) {

                        return 0;
                    }

                    return p2.getFechaCreacion()
                            .compareTo(p1.getFechaCreacion());
                })

                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * T - 4.1.5: Paginación de resultados.
     */
    @Transactional(readOnly = true)
    public PublicacionPageResponse buscarPaginado(
            BusquedaPublicacionRequest request,
            int pagina,
            int tamanio) {

        if (pagina < 0) {
            throw new IllegalArgumentException(
                    "El número de página no puede ser negativo");
        }

        if (tamanio <= 0) {
            throw new IllegalArgumentException(
                    "El tamaño de página debe ser mayor a 0");
        }

        List<PublicacionResponse> resultados =
                buscar(request);

        long totalElementos = resultados.size();

        int totalPaginas =
                (int) Math.ceil(
                        (double) totalElementos / tamanio);

        int inicio = pagina * tamanio;

        if (inicio >= totalElementos) {

            return new PublicacionPageResponse(
                    List.of(),
                    pagina,
                    tamanio,
                    totalElementos,
                    totalPaginas
            );
        }

        int fin =
                Math.min(
                        inicio + tamanio,
                        (int) totalElementos);

        List<PublicacionResponse> contenido =
                resultados.subList(inicio, fin);

        return new PublicacionPageResponse(
                contenido,
                pagina,
                tamanio,
                totalElementos,
                totalPaginas
        );
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
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Búsqueda de publicaciones por cercanía geográfica.
     */
    @Transactional(readOnly = true)
    public List<PublicacionResponse> buscarPorCercania(
            Double latitud,
            Double longitud,
            Double radioKm) {

        if (latitud == null
                || latitud < -90.0
                || latitud > 90.0) {

            throw new IllegalArgumentException(
                    "La latitud debe estar entre -90 y 90");
        }

        if (longitud == null
                || longitud < -180.0
                || longitud > 180.0) {

            throw new IllegalArgumentException(
                    "La longitud debe estar entre -180 y 180");
        }

        double radioEfectivo =
                (radioKm != null && radioKm > 0)
                        ? radioKm
                        : radioMvpKm;

        double deltaLat =
                radioEfectivo / 111.12;

        double deltaLon =
                radioEfectivo
                        / (111.12
                        * Math.cos(Math.toRadians(latitud)));

        double latMin =
                latitud - deltaLat;

        double latMax =
                latitud + deltaLat;

        double lonMin =
                longitud - deltaLon;

        double lonMax =
                longitud + deltaLon;

        List<Publicacion> candidatos =
                publicacionRepository
                        .findByLatitudBetweenAndLongitudBetween(
                                latMin,
                                latMax,
                                lonMin,
                                lonMax);

        return candidatos.stream()

                .filter(p -> p.getLatitud() != null
                        && p.getLongitud() != null)

                .filter(p -> calcularDistanciaKm(
                        latitud,
                        longitud,
                        p.getLatitud(),
                        p.getLongitud()) <= radioEfectivo)

                .sorted((p1, p2) -> {

                    double d1 =
                            calcularDistanciaKm(
                                    latitud,
                                    longitud,
                                    p1.getLatitud(),
                                    p1.getLongitud());

                    double d2 =
                            calcularDistanciaKm(
                                    latitud,
                                    longitud,
                                    p2.getLatitud(),
                                    p2.getLongitud());

                    return Double.compare(d1, d2);
                })

                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private double calcularDistanciaKm(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final int R = 6371;

        double latDistance =
                Math.toRadians(lat2 - lat1);

        double lonDistance =
                Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(latDistance / 2)
                        * Math.sin(latDistance / 2)
                        + Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2)
                        * Math.sin(lonDistance / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Redondeo a 2 decimales para proteger la ubicación exacta del usuario.
     */
    private Double aproximarCoordenada(
            Double coordenada) {

        if (coordenada == null) {
            return null;
        }

        return Math.round(
                coordenada * 100.0) / 100.0;
    }

    /**
     * Mapeo unificado a PublicacionResponse.
     */
    private PublicacionResponse mapToResponse(
            Publicacion p) {

        return new PublicacionResponse(
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
                p.getFechaCreacion()
        );
    }
}