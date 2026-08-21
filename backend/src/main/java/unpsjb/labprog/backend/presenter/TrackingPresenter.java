package unpsjb.labprog.backend.presenter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.TrackingService;
import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.PuntoRuta;
import unpsjb.labprog.backend.model.dto.TrackingEventoResultadoDTO;
import unpsjb.labprog.backend.model.dto.TrackingResponseDTO;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TrackingPresenter {

    private final TrackingService trackingService;

    @GetMapping("/pedidos/{codigoPedido}/tracking")
    public ResponseEntity<Object> consultarTracking(
            @PathVariable String codigoPedido,
            @RequestParam(required = false) String emailConsumidor,
            @RequestHeader(value = "X-Consumidor-Email", required = false) String emailHeader
    ) {

        TrackingResponseDTO tracking = trackingService.consultarTracking(
                codigoPedido,
                resolverEmail(emailConsumidor, emailHeader)
        );

        String statusText = "ASIGNADA".equals(tracking.getEstadoEntrega())
                ? "OK - RUTA_NO_DISPONIBLE"
                : "OK";

        return Response.ok(
                tracking,
                statusText
        );
    }

    @PostMapping("/tracking/entregas/{codigoEntrega}/eventos/{tipoEvento}")
    public ResponseEntity<Object> procesarEvento(
            @PathVariable String codigoEntrega,
            @PathVariable String tipoEvento,
            @RequestBody(required = false) Map<String, Object> body
    ) {

        Entrega entregaEvento = new Entrega();

        if (body != null) {

            if (body.get("estadoEntrega") != null) {
                entregaEvento.setEstado(
                        EstadoEntrega.valueOf(
                                body.get("estadoEntrega").toString()
                        )
                );
            }

            if (body.get("eta") != null) {
                entregaEvento.setTiempoEstimadoArribo(
                        Instant.parse(body.get("eta").toString())
                );
            }

            if (body.get("ultimaActualizacion") != null) {
                entregaEvento.setUltimaActualizacionEta(
                        Instant.parse(body.get("ultimaActualizacion").toString())
                );
            }

            if (body.get("distanciaMetros") != null) {
                entregaEvento.setDistanciaMetros(
                        ((Number) body.get("distanciaMetros")).doubleValue()
                );
            }

            if (body.get("duracionEstimadaSegundos") != null) {
                entregaEvento.setDuracionEstimadaSegundos(
                        ((Number) body.get("duracionEstimadaSegundos")).longValue()
                );
            }

            if (body.get("motivo") != null) {
                entregaEvento.setMotivo(
                        body.get("motivo").toString()
                );
            }

            if (body.get("ruta") instanceof List<?> rutaBody) {

                List<PuntoRuta> ruta = new ArrayList<>();

                for (Object punto : rutaBody) {

                    Map<?, ?> p = (Map<?, ?>) punto;

                    ruta.add(
                            new PuntoRuta(
                                    ((Number) p.get("lat")).doubleValue(),
                                    ((Number) p.get("lng")).doubleValue()
                            )
                    );
                }

                entregaEvento.setRutaTracking(ruta);
            }
        }

        TrackingEventoResultadoDTO resultado
                = trackingService.procesarEvento(
                        codigoEntrega,
                        tipoEvento,
                        entregaEvento
                );

        return Response.ok(
                resultado,
                "OK"
        );
    }

    private String resolverEmail(
            String emailConsumidor,
            String emailHeader
    ) {

        if (emailConsumidor != null
                && !emailConsumidor.isBlank()) {
            return emailConsumidor;
        }

        return emailHeader;
    }
}
