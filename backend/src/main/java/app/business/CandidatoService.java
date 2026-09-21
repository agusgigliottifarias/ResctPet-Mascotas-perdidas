package app.business;

import app.model.Publicacion;
import app.model.dto.CandidatoResponse;
import app.model.enums.TipoPublicacion;
import app.repository.PublicacionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidatoService {

    private final PublicacionRepository publicacionRepository;

    @Value("${rescpet.busqueda.radio-mvp-km:5.0}")
    private double radioMvpKm;

    public CandidatoService(PublicacionRepository publicacionRepository) {
        this.publicacionRepository = publicacionRepository;
    }

    /**
     * T - 5.1.5: Obtención de candidatos compatibles por especie, tipo opuesto y cercanía.
     */
    @Transactional(readOnly = true)
    public List<CandidatoResponse> obtenerCandidatos(Long publicacionOrigenId, Double radioKm) {

        if (publicacionOrigenId == null || publicacionOrigenId <= 0) {
            throw new IllegalArgumentException("El ID de la publicación origen debe ser un número positivo válido");
        }

        Publicacion origen = publicacionRepository.findById(publicacionOrigenId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró la publicación con ID: " + publicacionOrigenId));

        if (origen.getLatitud() == null || origen.getLongitud() == null) {
            throw new IllegalArgumentException(
                    "La publicación origen no cuenta con coordenadas geográficas para obtener candidatos");
        }

        double radioEfectivo = (radioKm != null && radioKm > 0) ? radioKm : radioMvpKm;

        // Tipo opuesto: PERDIDA -> ENCONTRADA, ENCONTRADA -> PERDIDA
        TipoPublicacion tipoBuscado = (origen.getTipoPublicacion() == TipoPublicacion.PERDIDA)
                ? TipoPublicacion.ENCONTRADA
                : TipoPublicacion.PERDIDA;

        // Bounding Box espacial en BD
        double deltaLat = radioEfectivo / 111.12;
        double deltaLon = radioEfectivo / (111.12 * Math.cos(Math.toRadians(origen.getLatitud())));

        double latMin = origen.getLatitud() - deltaLat;
        double latMax = origen.getLatitud() + deltaLat;
        double lonMin = origen.getLongitud() - deltaLon;
        double lonMax = origen.getLongitud() + deltaLon;

        List<Publicacion> publicacionesCandidatas = publicacionRepository
                .findByLatitudBetweenAndLongitudBetween(latMin, latMax, lonMin, lonMax);

        return publicacionesCandidatas.stream()
                .filter(p -> !p.getId().equals(origen.getId()))
                .filter(p -> p.getEspecie() == origen.getEspecie())
                .filter(p -> p.getTipoPublicacion() == tipoBuscado)
                .filter(p -> p.getLatitud() != null && p.getLongitud() != null)
                .filter(p -> calcularDistanciaKm(origen.getLatitud(), origen.getLongitud(), p.getLatitud(), p.getLongitud()) <= radioEfectivo)
                .map(p -> {
                    double dist = calcularDistanciaKm(origen.getLatitud(), origen.getLongitud(), p.getLatitud(), p.getLongitud());
                    double distRedondeada = Math.round(dist * 100.0) / 100.0;
                    return new CandidatoResponse(
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
                            distRedondeada,
                            p.getFechaCreacion()
                    );
                })
                .sorted((c1, c2) -> Double.compare(c1.getDistanciaKm(), c2.getDistanciaKm()))
                .collect(Collectors.toList());
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