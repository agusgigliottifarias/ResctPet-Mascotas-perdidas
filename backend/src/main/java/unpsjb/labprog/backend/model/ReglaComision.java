package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "reglas_comision")
@Data
@NoArgsConstructor
public class ReglaComision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_regla_comision")
    private Long idReglaComision;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String moneda;

    @Column(nullable = false)
    private Double porcentajeSobreTotal;

    @Column(nullable = false)
    private Double montoFijo;

    private Double topeMinimo;

    private Double topeMaximo;

    private String codigoRestaurante;

    private String zona;

    private String metodoPago;

    @Column(nullable = false)
    private Integer prioridad = 0;

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