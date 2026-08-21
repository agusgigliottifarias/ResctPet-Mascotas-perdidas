package unpsjb.labprog.backend.business;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.model.dto.NotificacionEtaResponseDTO;
import unpsjb.labprog.backend.repository.NotificacionEtaRepository;
import java.util.Optional;
import unpsjb.labprog.backend.model.NotificacionEta;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.enums.EstadoPedido;
import unpsjb.labprog.backend.repository.PedidoRepository;
import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.repository.EntregaRepository;
import java.time.Duration;
import java.time.Instant;

import unpsjb.labprog.backend.model.Repartidor;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.Consumidor;
import unpsjb.labprog.backend.repository.ConsumidorRepository;

@Service
@RequiredArgsConstructor
public class NotificacionEtaServiceImpl implements NotificacionEtaService {

    private static final Logger logger
            = LoggerFactory.getLogger(NotificacionEtaServiceImpl.class);

    private static final long UMBRAL_CAMBIO_MINUTOS = 3;
    private static final long RATE_LIMIT_MINUTOS = 2;

    private final NotificacionEtaRepository notificacionEtaRepository;
    private final PedidoRepository pedidoRepository;
    private final EntregaRepository entregaRepository;
    private final ConsumidorRepository consumidorRepository;

    @Override
    @Transactional
    public NotificacionEtaResponseDTO procesarEvento(
            String tipoEvento,
            String eventId,
            String idPedido,
            String idEntrega,
            String idRepartidor,
            String nombreRepartidor,
            String estadoEntrega,
            Instant timestamp,
            Instant eta,
            Instant etaAnterior,
            Instant etaNuevo
    ) {

        if (!esEventoSoportado(tipoEvento)) {

            logger.warn(
                    "evento desconocido ignorado: {}",
                    tipoEvento
            );

            throw new NotificacionEtaException(
                    "CONFLICTO - EVENTO_DESCONOCIDO_IGNORADO",
                    dataEvento(tipoEvento)
            );
        }

        Optional<NotificacionEta> existente
                = notificacionEtaRepository.findByEventId(
                        eventId
                );

        if (existente.isPresent()) {

            NotificacionEtaResponseDTO response
                    = new NotificacionEtaResponseDTO();

            response.setEventId(
                    eventId
            );

            response.setIdempotente(true);

            return response;
        }

        Pedido pedido = pedidoRepository.findByCodigo(idPedido)
                .orElseThrow(() -> new NotificacionEtaException(
                "CONFLICTO - PEDIDO_NO_ENCONTRADO",
                dataPedido(idPedido)
        ));

        Consumidor consumidor = consumidorRepository
                .findByEmail(pedido.getEmailConsumidor())
                .orElse(null);

        if (esEstadoFinal(pedido.getEstado())
                && !esEventoFinalDeEntrega(tipoEvento)) {
            throw new NotificacionEtaException(
                    "CONFLICTO - NOTIFICACION_NO_APLICA_ESTADO_FINAL",
                    dataPedidoEstado(pedido)
            );
        }

        Entrega entrega = entregaRepository.findByCodigo(idEntrega)
                .orElseThrow(() -> new NotificacionEtaException(
                "CONFLICTO - ENTREGA_NO_EXISTE",
                dataEntrega(idEntrega)
        ));

        if (esActualizacionEta(tipoEvento)
                && !superaUmbralCambio(etaAnterior, etaNuevo)) {

            NotificacionEtaResponseDTO response
                    = new NotificacionEtaResponseDTO();

            response.setEventId(eventId);
            response.setIdPedido(pedido.getCodigo());
            response.setIdEntrega(entrega.getCodigo());

            response.setResultado(
                    "SIN_NOTIFICACION_POR_UMBRAL"
            );

            return response;
        }

        if ("ETAActualizado".equals(tipoEvento)
                && !respetaRateLimit(pedido.getCodigo(), timestamp)) {

            NotificacionEtaResponseDTO response
                    = new NotificacionEtaResponseDTO();

            response.setEventId(eventId);
            response.setIdPedido(pedido.getCodigo());
            response.setIdEntrega(entrega.getCodigo());

            response.setResultado(
                    "SIN_NOTIFICACION_POR_RATE_LIMIT"
            );

            return response;
        }

        NotificacionEta notificacion = crearNotificacion(
                tipoEvento,
                eventId,
                estadoEntrega,
                timestamp,
                eta,
                etaNuevo,
                pedido,
                entrega,
                consumidor
        );

        notificacionEtaRepository.save(notificacion);

        return toResponse(notificacion);
    }

    private boolean esEventoSoportado(String tipoEvento) {

        return "EntregaAsignada".equals(tipoEvento)
                || "EntregaRetirada".equals(tipoEvento)
                || "EntregaEnTrayecto".equals(tipoEvento)
                || "EntregaEntregada".equals(tipoEvento)
                || "EntregaFallida".equals(tipoEvento)
                || "ETAActualizado".equals(tipoEvento);
    }

    private Map<String, Object> dataEvento(
            String tipoEvento
    ) {

        Map<String, Object> data = new HashMap<>();
        data.put("evento", tipoEvento);
        return data;
    }

    private boolean esEstadoFinal(EstadoPedido estado) {

        return estado == EstadoPedido.ENTREGADO
                || estado == EstadoPedido.CANCELADO
                || estado == EstadoPedido.RECHAZADO;
    }

    private boolean esEventoFinalDeEntrega(String tipoEvento) {

        return "EntregaEntregada".equals(tipoEvento)
                || "EntregaFallida".equals(tipoEvento);
    }

    private Map<String, Object> dataPedido(String codigoPedido) {

        Map<String, Object> data = new HashMap<>();
        data.put("idPedido", codigoPedido);
        return data;
    }

    private Map<String, Object> dataPedidoEstado(Pedido pedido) {

        Map<String, Object> data = new HashMap<>();
        data.put("idPedido", pedido.getCodigo());
        data.put("estado", pedido.getEstado().name());
        return data;
    }

    private Map<String, Object> dataEntrega(String codigoEntrega) {

        Map<String, Object> data = new HashMap<>();
        data.put("idEntrega", codigoEntrega);
        return data;
    }

    private NotificacionEta crearNotificacion(
            String tipoEvento,
            String eventId,
            String estadoEntrega,
            Instant timestampRequest,
            Instant etaRequest,
            Instant etaNuevo,
            Pedido pedido,
            Entrega entrega,
            Consumidor consumidor
    ) {

        Instant eta = obtenerEta(etaRequest, etaNuevo, entrega);
        Instant timestamp = timestampRequest != null
                ? timestampRequest
                : Instant.now();

        NotificacionEta notificacion = new NotificacionEta();

        notificacion.setEventId(eventId);

        notificacion.setEventId(eventId);
        notificacion.setIdPedido(pedido.getCodigo());
        notificacion.setIdEntrega(entrega.getCodigo());
        notificacion.setTimestamp(timestamp);
        notificacion.setEta(eta);
        notificacion.setEstadoEntrega(obtenerEstadoEntrega(estadoEntrega, entrega));
        notificacion.setTiempoRemanenteSegundos(
                calcularTiempoRemanente(timestamp, eta)
        );

        if (entrega.getRepartidor() != null) {
            notificacion.setIdRepartidor(
                    entrega.getRepartidor().getCodigo()
            );
            notificacion.setNombreRepartidor(
                    entrega.getRepartidor().getNombre()
            );
        }

        notificacion.setMensajeUsuario(
                mensajeUsuario(tipoEvento, notificacion)
        );

        boolean inApp = consumidor == null
                || consumidor.isNotificacionesInAppHabilitadas();

        boolean externa = consumidor == null
                || consumidor.isNotificacionesExternasHabilitadas();

        notificacion.setInAppEmitida(inApp);
        notificacion.setNotificacionExternaEmitida(externa);
        notificacion.setIdempotente(false);

        return notificacion;
    }

    private Instant obtenerEta(
            Instant eta,
            Instant etaNuevo,
            Entrega entrega
    ) {

        if (etaNuevo != null) {
            return etaNuevo;
        }

        if (eta != null) {
            return eta;
        }

        return entrega.getTiempoEstimadoArribo();
    }

    private EstadoEntrega obtenerEstadoEntrega(
            String estadoEntrega,
            Entrega entrega
    ) {

        if (estadoEntrega != null) {
            return EstadoEntrega.valueOf(estadoEntrega);
        }

        return entrega.getEstado();
    }

    private Long calcularTiempoRemanente(
            Instant timestamp,
            Instant eta
    ) {

        if (eta == null || timestamp == null) {
            return null;
        }

        long segundos = Duration.between(timestamp, eta).getSeconds();

        return Math.max(segundos, 0);
    }

    private String mensajeUsuario(
            String tipoEvento,
            NotificacionEta notificacion
    ) {

        Long minutos = notificacion.getTiempoRemanenteSegundos() == null
                ? null
                : Math.round(notificacion.getTiempoRemanenteSegundos() / 60.0);

        if ("EntregaAsignada".equals(tipoEvento)) {
            return "Repartidor asignado. Llega en ~" + minutos + " minutos.";
        }

        if ("EntregaRetirada".equals(tipoEvento)) {
            return "El repartidor retiró tu pedido. Llega en ~" + minutos + " minutos.";
        }

        if ("EntregaEnTrayecto".equals(tipoEvento)) {
            return "Tu pedido está en camino. Llega en ~" + minutos + " minutos.";
        }

        if ("EntregaEntregada".equals(tipoEvento)) {
            return "Tu pedido fue entregado.";
        }

        if ("EntregaFallida".equals(tipoEvento)) {
            return "Tu pedido no pudo entregarse.";
        }

        return "Actualizamos el tiempo estimado de arribo de tu pedido.";
    }

    private NotificacionEtaResponseDTO toResponse(
            NotificacionEta notificacion
    ) {

        NotificacionEtaResponseDTO.RepartidorNotificacion repartidor = null;

        if (notificacion.getIdRepartidor() != null) {
            repartidor = new NotificacionEtaResponseDTO.RepartidorNotificacion(
                    notificacion.getIdRepartidor(),
                    notificacion.getNombreRepartidor()
            );
        }

        NotificacionEtaResponseDTO response
                = new NotificacionEtaResponseDTO(
                        notificacion.getEventId(),
                        notificacion.getIdPedido(),
                        notificacion.getIdEntrega(),
                        notificacion.getTimestamp(),
                        notificacion.getEstadoEntrega(),
                        notificacion.getEta(),
                        notificacion.getTiempoRemanenteSegundos(),
                        repartidor,
                        notificacion.getMensajeUsuario(),
                        notificacion.getInAppEmitida(),
                        notificacion.getNotificacionExternaEmitida(),
                        notificacion.getIdempotente(),
                        null
                );

        response.setResultado("NOTIFICACION_EMITIDA");

        return response;
    }

    private boolean esActualizacionEta(String tipoEvento) {

        return "ETAActualizado".equals(tipoEvento);
    }

    private boolean superaUmbralCambio(
            Instant etaAnterior,
            Instant etaNuevo
    ) {

        if (etaAnterior == null || etaNuevo == null) {
            return true;
        }

        long diferenciaMinutos = Math.abs(
                Duration.between(etaAnterior, etaNuevo).toMinutes()
        );

        return diferenciaMinutos >= UMBRAL_CAMBIO_MINUTOS;
    }

    private boolean respetaRateLimit(
            String codigoPedido,
            Instant timestamp
    ) {

        Instant momentoActual = timestamp != null
                ? timestamp
                : Instant.now();

        return notificacionEtaRepository
                .findTopByIdPedidoOrderByTimestampDesc(codigoPedido)
                .map(ultima -> {
                    long minutos = Duration.between(
                            ultima.getTimestamp(),
                            momentoActual
                    ).toMinutes();

                    return minutos >= RATE_LIMIT_MINUTOS;
                })
                .orElse(true);
    }

}
