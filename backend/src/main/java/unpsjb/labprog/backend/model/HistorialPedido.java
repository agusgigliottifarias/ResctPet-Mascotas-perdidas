package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "historial_pedidos")
@Data
@NoArgsConstructor
public class HistorialPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idHistorial;

    @Column(nullable = false, unique = true)
    private String codigoPedido;

    @Column(nullable = false)
    private String emailConsumidor;

    @Column(nullable = false)
    private String estado;

    @Embedded
    private Precio total;

    @Column(nullable = false)
    private Instant creadoEn;

    private String codigoRestaurante;

    private String nombreRestaurante;

    private String estadoTicket;

    private String estadoEntrega;

    private Instant fechaActualizacion;

    @PrePersist
    public void prePersist() {

        if (creadoEn == null) {
            creadoEn = Instant.now();
        }

        if (fechaActualizacion == null) {
            fechaActualizacion = Instant.now();
        }
    }

    @PreUpdate
    public void updateTimestamp() {
        fechaActualizacion = Instant.now();
    }
}