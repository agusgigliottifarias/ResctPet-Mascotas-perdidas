package unpsjb.labprog.backend.business;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.model.Direccion;
import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.PuntoRuta;
import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.dto.CoordenadaDTO;
import unpsjb.labprog.backend.model.dto.TrackingEventoResultadoDTO;
import unpsjb.labprog.backend.model.dto.TrackingResponseDTO;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.repository.EntregaRepository;
import unpsjb.labprog.backend.repository.PedidoRepository;

@Service
@RequiredArgsConstructor
public class TrackingServiceImpl implements TrackingService {

    private static final Logger logger = LoggerFactory.getLogger(TrackingServiceImpl.class);
    private static final int MAX_PUNTOS_RUTA = 50;

    private final PedidoRepository pedidoRepository;
    private final EntregaRepository entregaRepository;

    @Override
    @Transactional(readOnly = true)
    public TrackingResponseDTO consultarTracking(
            String codigoPedido,
            String emailConsumidor
    ) {

        Pedido pedido = pedidoRepository.findByCodigo(codigoPedido)
                .orElseThrow(() -> new TrackingException(
                "CONFLICTO - PEDIDO_NO_ENCONTRADO",
                dataPedido(codigoPedido)
        ));

        validarPropietario(pedido, emailConsumidor);

        TrackingResponseDTO response = new TrackingResponseDTO();
        response.setIdPedido(pedido.getCodigo());

        Entrega entrega = entregaRepository.findByIdPedido(pedido.getIdPedido())
                .orElse(null);

        if (entrega == null) {
            response.setEntrega(null);
            response.setMensaje("Aún no hay repartidor asignado");
            response.setEta(null);
            response.setRuta(new ArrayList<>());
            return response;
        }

        response.setIdEntrega(entrega.getCodigo());
        response.setEstadoEntrega(entrega.getEstado().name());
        response.setEta(entrega.getTiempoEstimadoArribo());
        response.setUltimaActualizacion(entrega.getUltimaActualizacionEta());
        response.setDistanciaMetros(entrega.getDistanciaMetros());
        response.setDuracionEstimadaSegundos(entrega.getDuracionEstimadaSegundos());
        response.setOrigen(origenDesde(pedido.getRestaurante()));
        response.setDestino(destinoDesde(pedido.getDireccionEntrega()));
        response.setRuta(rutaSimplificada(pedido, entrega));

        if (entrega.getEstado() == EstadoEntrega.ENTREGADA) {
            response.setEta(null);
            response.setTiempoRemanenteSegundos(0L);
            return response;
        }

        if (entrega.getEstado() == EstadoEntrega.FALLIDA) {
            response.setMotivo(entrega.getMotivo());
            return response;
        }

        response.setTiempoRemanenteSegundos(calcularTiempoRemanente(entrega));
        return response;
    }

    @Override
    @Transactional
    public TrackingEventoResultadoDTO procesarEvento(
            String codigoEntrega,
            String tipoEvento,
            Entrega entregaEvento
    ) {

        if (!esEventoSoportado(tipoEvento)) {
            logger.warn("evento desconocido ignorado: {}", tipoEvento);
            throw new TrackingException(
                    "CONFLICTO - EVENTO_DESCONOCIDO_IGNORADO",
                    dataEvento(tipoEvento)
            );
        }

        Entrega entrega = entregaRepository.findByCodigo(codigoEntrega)
                .orElseThrow(() -> new TrackingException(
                "CONFLICTO - ENTREGA_NO_EXISTE",
                dataEntrega(codigoEntrega)
        ));

        if (entregaEvento != null) {
            if (entregaEvento.getEstado() != null) {
                entrega.setEstado(entregaEvento.getEstado());
            }

            entrega.setTiempoEstimadoArribo(entregaEvento.getTiempoEstimadoArribo());
            entrega.setUltimaActualizacionEta(entregaEvento.getUltimaActualizacionEta());
            entrega.setDistanciaMetros(entregaEvento.getDistanciaMetros());
            entrega.setDuracionEstimadaSegundos(entregaEvento.getDuracionEstimadaSegundos());

            if (entregaEvento.getMotivo() != null) {
                entrega.setMotivo(entregaEvento.getMotivo());
            }

            if (entregaEvento.getRutaTracking() != null) {
                entrega.setRutaTracking(entregaEvento.getRutaTracking());
            }
        }

        entregaRepository.save(entrega);

        return new TrackingEventoResultadoDTO(
                entrega.getCodigo(),
                null
        );
    }

    private void validarPropietario(Pedido pedido, String emailConsumidor) {

        if (emailConsumidor == null || emailConsumidor.isBlank()) {
            return;
        }

        if (!pedido.getEmailConsumidor().equals(emailConsumidor)) {
            throw new TrackingException(
                    "CONFLICTO - PEDIDO_NO_PERTENECE_AL_CONSUMIDOR",
                    dataPedido(pedido.getCodigo())
            );
        }
    }

    private CoordenadaDTO origenDesde(Restaurante restaurante) {
        if (restaurante == null) {
            return null;
        }

        return new CoordenadaDTO(
                restaurante.getLatitud(),
                restaurante.getLongitud()
        );
    }

    private CoordenadaDTO destinoDesde(Direccion direccion) {
        if (direccion == null
                || direccion.getUbicacion() == null
                || direccion.getUbicacion().size() < 2) {
            return null;
        }

        return new CoordenadaDTO(
                direccion.getUbicacion().get(0),
                direccion.getUbicacion().get(1)
        );
    }

    private List<CoordenadaDTO> rutaSimplificada(
            Pedido pedido,
            Entrega entrega
    ) {
        if (entrega.getRutaTracking() != null
                && !entrega.getRutaTracking().isEmpty()) {
            return limitarPuntos(
                    toCoordenadas(entrega.getRutaTracking())
            );
        }

        CoordenadaDTO origen = origenDesde(pedido.getRestaurante());
        CoordenadaDTO destino = destinoDesde(pedido.getDireccionEntrega());

        if (origen == null || destino == null) {
            return new ArrayList<>();
        }

        List<CoordenadaDTO> ruta = new ArrayList<>();
        ruta.add(origen);
        ruta.add(puntoIntermedio(origen, destino));
        ruta.add(destino);

        return ruta;
    }

    private CoordenadaDTO puntoIntermedio(
            CoordenadaDTO origen,
            CoordenadaDTO destino
    ) {
        return new CoordenadaDTO(
                (origen.getLat() + destino.getLat()) / 2,
                (origen.getLng() + destino.getLng()) / 2
        );
    }

    private List<CoordenadaDTO> limitarPuntos(List<CoordenadaDTO> ruta) {
        if (ruta.size() <= MAX_PUNTOS_RUTA) {
            return ruta;
        }
        return ruta.subList(0, MAX_PUNTOS_RUTA);
    }

    private Long calcularTiempoRemanente(Entrega entrega) {
        if (entrega.getTiempoEstimadoArribo() == null) {
            return null;
        }

        long segundos = Duration.between(
                Instant.now(),
                entrega.getTiempoEstimadoArribo()
        ).getSeconds();

        return Math.max(segundos, 0);
    }

    private boolean esEventoSoportado(String tipoEvento) {
        return "EntregaAsignada".equals(tipoEvento)
                || "EntregaRetirada".equals(tipoEvento)
                || "EntregaEnTrayecto".equals(tipoEvento)
                || "EntregaEntregada".equals(tipoEvento)
                || "EntregaFallida".equals(tipoEvento)
                || "ETAActualizado".equals(tipoEvento);
    }

    private List<PuntoRuta> toPuntosRuta(List<CoordenadaDTO> ruta) {
        List<PuntoRuta> puntos = new ArrayList<>();

        for (CoordenadaDTO p : ruta) {
            puntos.add(new PuntoRuta(p.getLat(), p.getLng()));
        }

        return puntos;
    }

    private List<CoordenadaDTO> toCoordenadas(List<PuntoRuta> ruta) {
        return ruta.stream()
                .map(p -> new CoordenadaDTO(p.getLat(), p.getLng()))
                .toList();
    }

    private Map<String, Object> dataPedido(String codigoPedido) {
        Map<String, Object> data = new HashMap<>();
        data.put("idPedido", codigoPedido);
        return data;
    }

    private Map<String, Object> dataEntrega(String codigoEntrega) {
        Map<String, Object> data = new HashMap<>();
        data.put("idEntrega", codigoEntrega);
        return data;
    }

    private Map<String, Object> dataEvento(String tipoEvento) {
        Map<String, Object> data = new HashMap<>();
        data.put("evento", tipoEvento);
        return data;
    }
}
