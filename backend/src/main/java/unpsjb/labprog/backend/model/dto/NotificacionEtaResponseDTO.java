package unpsjb.labprog.backend.model.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionEtaResponseDTO {

    private String eventId;
    private String idPedido;
    private String idEntrega;
    private Instant timestamp;
    private EstadoEntrega estadoEntrega;
    private Instant eta;
    private Long tiempoRemanenteSegundos;
    private RepartidorNotificacion repartidor;
    private String mensajeUsuario;
    private Boolean idempotente;
    private Boolean inAppEmitida;
    private Boolean notificacionExternaEmitida;
    private String resultado;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RepartidorNotificacion {

        private String idRepartidor;
        private String nombre;
    }
}