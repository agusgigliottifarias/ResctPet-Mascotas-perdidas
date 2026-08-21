package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "splits_pago")
@Data
@NoArgsConstructor
public class SplitPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String destino;

    private String referenciaDestino;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "monto", column = @Column(name = "split_monto")),
        @AttributeOverride(name = "moneda", column = @Column(name = "split_moneda"))
    })
    private Precio monto;

    @Column(nullable = false)
    private boolean liquidable = false;

    private Instant fechaLiquidable;

    @Column(nullable = false)
    private String reglaAplicada;

    @Column(nullable = false, updatable = false)
    private Instant creadoEn;

    @PrePersist
    public void prePersist() {
        if (creadoEn == null) {
            creadoEn = Instant.now();
        }
    }
}