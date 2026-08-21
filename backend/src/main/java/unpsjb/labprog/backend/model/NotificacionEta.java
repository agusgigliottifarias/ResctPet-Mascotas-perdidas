package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notificaciones_eta")
@Data
@NoArgsConstructor
public class NotificacionEta {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idNotificacionEta;

    @Column(nullable = false, unique = true)
    private String eventId;

    @Column(nullable = false)
    private String idPedido;

    @Column(nullable = false)
    private String idEntrega;

    @Column(nullable = false)
    private Instant timestamp;

    private Instant eta;

    private Long tiempoRemanenteSegundos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEntrega estadoEntrega;

    private String idRepartidor;

    private String nombreRepartidor;

    private String mensajeUsuario;

    private Boolean inAppEmitida;

    private Boolean notificacionExternaEmitida;

    private Boolean idempotente;

    @PrePersist
    public void prePersist() {

        if (inAppEmitida == null) {
            inAppEmitida = true;
        }

        if (notificacionExternaEmitida == null) {
            notificacionExternaEmitida = false;
        }

        if (idempotente == null) {
            idempotente = false;
        }
    }
}