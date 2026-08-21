package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "eventos_split_pago")
@Data
@NoArgsConstructor
public class EventoSplitPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento_split_pago")
    private Long idEventoSplitPago;

    @Column(nullable = false)
    private String codigoPago;

    @Column(nullable = false)
    private String codigoPedido;

    @Column(nullable = false)
    private String tipoEvento;

    private String detalle;

    @Column(nullable = false, updatable = false)
    private Instant creadoEn;

    @PrePersist
    public void prePersist() {
        if (creadoEn == null) {
            creadoEn = Instant.now();
        }
    }
}