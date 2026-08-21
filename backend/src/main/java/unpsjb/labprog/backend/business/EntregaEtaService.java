package unpsjb.labprog.backend.business;

import java.time.Duration;
import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.model.Direccion;
import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.dto.EtaResponseDTO;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.MetodoCalculoETA;
import unpsjb.labprog.backend.repository.EntregaRepository;
import unpsjb.labprog.backend.repository.PedidoRepository;

@Service
@RequiredArgsConstructor
public class EntregaEtaService {

    private final EntregaRepository entregaRepository;
    private final PedidoRepository pedidoRepository;

    private static final long RATE_LIMIT_SEGUNDOS = 30;
    private static final double VELOCIDAD_PROMEDIO_KMH = 25.0;

    public EtaResponseDTO.Resultado calcularEta(
            String codigoEntrega,
            Instant timestampCalculoRequest,
            String tipoVehiculo,
            Boolean servicioExternoDisponible,
            Boolean cambioEstado
    ) {

        Entrega entrega = entregaRepository.findByCodigo(codigoEntrega)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - ENTREGA_NO_EXISTE"
        ));

        Pedido pedido = pedidoRepository.findById(entrega.getIdPedido())
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - PEDIDO_NO_EXISTE"
        ));

        validarEstado(entrega);
        validarUbicaciones(pedido);

        Instant timestampCalculo = obtenerTimestampCalculo(timestampCalculoRequest);

        if (!Boolean.TRUE.equals(cambioEstado)
                && superaRateLimit(entrega, timestampCalculo)) {
            EtaResponseDTO data = new EtaResponseDTO();
            data.setIdEntrega(entrega.getCodigo());
            data.setIdPedido(pedido.getCodigo());

            return new EtaResponseDTO.Resultado(
                    "OK - SIN_RECALCULO_POR_RATE_LIMIT",
                    data
            );
        }

        double distanciaMetros = calcularDistanciaMetros(pedido);

        MetodoCalculoETA metodoCalculo = obtenerMetodoCalculo(servicioExternoDisponible);

        long duracionEstimadaSegundos = calcularDuracionEstimadaSegundos(
                distanciaMetros,
                metodoCalculo
        );

        validarDuracion(duracionEstimadaSegundos);

        Instant eta = timestampCalculo.plusSeconds(duracionEstimadaSegundos);

        validarEta(eta, timestampCalculo);

        entrega.setDistanciaMetros(distanciaMetros);
        entrega.setDuracionEstimadaSegundos(duracionEstimadaSegundos);
        entrega.setTiempoEstimadoArribo(eta);
        entrega.setUltimaActualizacionEta(timestampCalculo);
        entrega.setMetodoCalculoEta(metodoCalculo);

        entregaRepository.save(entrega);

        EtaResponseDTO data = new EtaResponseDTO();

        data.setIdEntrega(entrega.getCodigo());
        data.setIdPedido(pedido.getCodigo());
        data.setMetodoCalculo(metodoCalculo.name());
        data.setDistanciaMetros(distanciaMetros);
        data.setDuracionEstimadaSegundos(duracionEstimadaSegundos);
        data.setTimestampCalculo(timestampCalculo);
        data.setEta(eta);
        data.setUltimaActualizacion(timestampCalculo);

        String statusText = metodoCalculo == MetodoCalculoETA.FALLBACK_INTERNO
                ? "OK - ETA_FALLBACK"
                : "OK";

        return new EtaResponseDTO.Resultado(statusText, data);
    }

    private Instant obtenerTimestampCalculo(Instant timestampCalculo) {

        if (timestampCalculo != null) {
            return timestampCalculo;
        }

        return Instant.now();
    }

    private MetodoCalculoETA obtenerMetodoCalculo(Boolean servicioExternoDisponible) {

        if (Boolean.TRUE.equals(servicioExternoDisponible)) {
            return MetodoCalculoETA.ROUTING_EXTERNO;
        }

        return MetodoCalculoETA.FALLBACK_INTERNO;
    }

    private void validarEstado(Entrega entrega) {

        if (entrega.getEstado() == EstadoEntrega.ENTREGADA
                || entrega.getEstado() == EstadoEntrega.FALLIDA) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - ETA_NO_APLICA_ESTADO_FINAL"
            );
        }
    }

    private boolean superaRateLimit(
            Entrega entrega,
            Instant timestampCalculo
    ) {

        if (entrega.getUltimaActualizacionEta() == null) {
            return false;
        }

        long segundos = Duration.between(
                entrega.getUltimaActualizacionEta(),
                timestampCalculo
        ).getSeconds();

        return segundos < RATE_LIMIT_SEGUNDOS;
    }

    private void validarUbicaciones(Pedido pedido) {

        Restaurante restaurante = pedido.getRestaurante();
        Direccion destino = pedido.getDireccionEntrega();

        if (restaurante == null
                || restaurante.getLatitud() == null
                || restaurante.getLongitud() == null
                || destino == null
                || destino.getUbicacion() == null
                || destino.getUbicacion().size() < 2
                || destino.getUbicacion().get(0) == null
                || destino.getUbicacion().get(1) == null) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - UBICACION_INCOMPLETA"
            );
        }
    }

    private double calcularDistanciaMetros(Pedido pedido) {

        double latRetiro = pedido.getRestaurante().getLatitud();
        double lonRetiro = pedido.getRestaurante().getLongitud();

        double latDestino = pedido.getDireccionEntrega().getUbicacion().get(0);
        double lonDestino = pedido.getDireccionEntrega().getUbicacion().get(1);

        return distanciaHaversineMetros(
                latRetiro,
                lonRetiro,
                latDestino,
                lonDestino
        );
    }

    private double distanciaHaversineMetros(
            double lat1,
            double lon1,
            double lat2,
            double lon2
    ) {

        final double radioTierraMetros = 6371000;

        double diferenciaLatitud = Math.toRadians(lat2 - lat1);
        double diferenciaLongitud = Math.toRadians(lon2 - lon1);

        double a = Math.sin(diferenciaLatitud / 2)
                * Math.sin(diferenciaLatitud / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(diferenciaLongitud / 2)
                * Math.sin(diferenciaLongitud / 2);

        double c = 2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
        );

        return radioTierraMetros * c;
    }

    private long calcularDuracionEstimadaSegundos(
            double distanciaMetros,
            MetodoCalculoETA metodoCalculo
    ) {

        double velocidadMetrosPorSegundo;

        if (metodoCalculo == MetodoCalculoETA.ROUTING_EXTERNO) {
            velocidadMetrosPorSegundo = 5.33;
        } else {
            velocidadMetrosPorSegundo = VELOCIDAD_PROMEDIO_KMH * 1000 / 3600;
        }

        long duracion = Math.round(distanciaMetros / velocidadMetrosPorSegundo);

        return Math.max(duracion, 60);
    }

    private void validarDuracion(long duracionEstimadaSegundos) {

        if (duracionEstimadaSegundos <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - DURACION_INVALIDA"
            );
        }
    }

    private void validarEta(
            Instant eta,
            Instant timestampCalculo
    ) {

        if (!eta.isAfter(timestampCalculo)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - ETA_INVALIDO"
            );
        }
    }
}
