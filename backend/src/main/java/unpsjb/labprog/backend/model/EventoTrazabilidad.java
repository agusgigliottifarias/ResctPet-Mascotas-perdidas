package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import unpsjb.labprog.backend.model.enums.ActorTrazabilidad;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "eventos_trazabilidad")
@Data
@NoArgsConstructor
public class EventoTrazabilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idEventoTrazabilidad;

    @Column(nullable = false, unique = true)
    private String eventId;

    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false)
    private String idPedido;

    private String idPago;

    private String idTicket;

    private String idEntrega;

    private String idLiquidacion;

    @Column(nullable = false)
    private Instant timestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActorTrazabilidad actorTipo;

    @Column(length = 5000)
    private String payload;

    private String correlacionId;

    private String causationId;

    @PrePersist
    public void prePersist() {

        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }
}