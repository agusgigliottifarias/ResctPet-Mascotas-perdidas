package app.business;

import app.model.Publicacion;
import app.model.dto.CoincidenciaResponse;
import app.model.dto.PublicacionResponse;
import app.model.dto.SolicitudCoincidenciaRequest;
import app.model.enums.TipoPublicacion;
import app.repository.PublicacionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CoincidenciaService {

    private final PublicacionRepository publicacionRepository;

    @Value("${rescpet.busqueda.radio-mvp-km:5.0}")
    private double radioMvpKm;

    public CoincidenciaService(PublicacionRepository publicacionRepository) {
        this.publicacionRepository = publicacionRepository;
    }

    @Transactional(readOnly = true)
    public CoincidenciaResponse solicitarBusqueda(SolicitudCoincidenciaRequest request) {

        if (request == null || request.getPublicacionId() == null || request.getPublicacionId() <= 0) {
            throw new IllegalArgumentException(
                    "El ID de la publicación es obligatorio para solicitar la búsqueda de coincidencias");
        }

        Publicacion origen = publicacionRepository.findById(request.getPublicacionId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró la publicación con ID: " + request.getPublicacionId()));

        if (origen.getLatitud() == null || origen.getLongitud() == null) {
            throw new IllegalArgumentException(
                    "La publicación no posee coordenadas geográficas válidas para realizar la búsqueda");
        }

        // Determinar tipo opuesto para coincidencia (PERDIDA -> ENCONTRADA, ENCONTRADA -> PERDIDA)
        TipoPublicacion tipoBuscado = (origen.getTipoPublicacion() == TipoPublicacion.PERDIDA)
                ? TipoPublicacion.ENCONTRADA
                : TipoPublicacion.PERDIDA;

        double radioEfectivo = (request.getRadioKm() != null && request.getRadioKm() > 0)
                ? request.getRadioKm()
                : radioMvpKm;

        // Bounding Box preliminar en Base de Datos
        double deltaLat = radioEfectivo / 111.12;
        double deltaLon = radioEfectivo / (111.12 * Math.cos(Math.toRadians(origen.getLatitud())));

        double latMin = origen.getLatitud() - deltaLat;
        double latMax = origen.getLatitud() + deltaLat;
        double lonMin = origen.getLongitud() - deltaLon;
        double lonMax = origen.getLongitud() + deltaLon;

        List<Publicacion> candidatosEnRango = publicacionRepository
                .findByLatitudBetweenAndLongitudBetween(latMin, latMax, lonMin, lonMax);

        // Filtrar por especie, tipo opuesto y distancia Haversine
        List<PublicacionResponse> candidatos = candidatosEnRango.stream()
                .filter(p -> !p.getId().equals(origen.getId()))
                .filter(p -> p.getEspecie() == origen.getEspecie())
                .filter(p -> p.getTipoPublicacion() == tipoBuscado)
                .filter(p -> p.getLatitud() != null && p.getLongitud() != null)
                .filter(p -> calcularDistanciaKm(
                        origen.getLatitud(), origen.getLongitud(),
                        p.getLatitud(), p.getLongitud()) <= radioEfectivo)
                .sorted((p1, p2) -> {
                    double d1 = calcularDistanciaKm(origen.getLatitud(), origen.getLongitud(), p1.getLatitud(), p1.getLongitud());
                    double d2 = calcularDistanciaKm(origen.getLatitud(), origen.getLongitud(), p2.getLatitud(), p2.getLongitud());
                    return Double.compare(d1, d2);
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

        return new CoincidenciaResponse(origen.getId(), candidatos.size(), candidatos);
    }

    private double calcularDistanciaKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private Double aproximarCoordenada(Double coordenada) {
        if (coordenada == null) {
            return null;
        }
        return Math.round(coordenada * 100.0) / 100.0;
    }
}