package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "auditorias_split_pago")
@Data
@NoArgsConstructor
public class AuditoriaSplitPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria_split_pago")
    private Long idAuditoriaSplitPago;

    @Column(nullable = false)
    private String codigoPago;

    @Column(nullable = false)
    private String codigoPedido;

    @Column(nullable = false)
    private String motivo;

    private String destinoAfectado;

    private Double montoOriginal;

    private Double montoAjustado;

    private Double diferencia;

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