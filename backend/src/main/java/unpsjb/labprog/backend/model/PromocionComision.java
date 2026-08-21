package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "promociones_comision")
@Data
@NoArgsConstructor
public class PromocionComision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPromocionComision;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String codigoRestaurante;

    @Column(nullable = false)
    private Double descuentoPorcentaje;

    @Column(nullable = false)
    private Boolean activa = true;

    private Instant vigenciaDesde;

    private Instant vigenciaHasta;

    @Column(nullable = false, updatable = false)
    private Instant creadoEn;

    @PrePersist
    public void prePersist() {
        if (creadoEn == null) {
            creadoEn = Instant.now();
        }
    }
}