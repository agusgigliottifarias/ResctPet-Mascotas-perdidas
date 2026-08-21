package unpsjb.labprog.backend.model;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;

import unpsjb.labprog.backend.model.enums.AccionPago;
import unpsjb.labprog.backend.model.enums.EstadoPago;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pagos")
@Data
@NoArgsConstructor
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idPago;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private UUID idPedido;

    @Column(nullable = false)
    private String emailConsumidor;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(
                    name = "monto",
                    column = @Column(name = "pago_monto")
            ),
            @AttributeOverride(
                    name = "moneda",
                    column = @Column(name = "pago_moneda")
            )
    })
    private Precio monto;

    @Column(nullable = false)
    private String metodo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccionPago accion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPago estado;

    private Instant fechaAutorizacion;

    private String codigoMotivo;

    private String detalleMotivo;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JoinColumn(name = "id_pago")
    private List<SplitPago> splits = new ArrayList<>();

    @PrePersist
    public void prePersist() {

        if (codigo == null) {
            codigo =
                    "P-" +
                    UUID.randomUUID()
                            .toString()
                            .substring(0, 8)
                            .toUpperCase();
        }

        if (fechaAutorizacion == null) {
            fechaAutorizacion = Instant.now();
        }
    }
}