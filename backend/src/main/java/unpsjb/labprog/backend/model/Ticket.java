package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import unpsjb.labprog.backend.model.enums.EstadoTicket;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "tickets",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_ticket_pedido",
                        columnNames = "idPedido"
                )
        }
)
@Data
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idTicket;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private UUID idPedido;

    @Column(nullable = false)
    private UUID idRestaurante;

    @Version
    private Long version;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTicket estado;

    private Instant listoPara;

    private Instant fechaHoraAceptacion;

    private String aceptadoPor;

    private Instant inicioPreparacion;

    private Instant finPreparacion;

    private Long duracionPreparacionSegundos;

    private Instant anuladoEn;

    private String actualizadoPor;

    private String motivo;

    private Instant fechaUltimaActualizacion;

    @Enumerated(EnumType.STRING)
    private EstadoTicket estadoAnterior;

    private Instant fechaCreacion;

    private Instant estimadoListo;

    private String direccionEntrega;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> items = new ArrayList<>();

    @PrePersist
    public void prePersist() {

        if (fechaCreacion == null) {
            fechaCreacion = Instant.now();
        }
    }
}