package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "movimientos_cuenta_restaurante")
@Data
@NoArgsConstructor
public class MovimientoCuentaRestaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_movimiento")
    private UUID idMovimiento;

    @Column(name = "codigo_restaurante", nullable = false)
    private String codigoRestaurante;

    @Column(name = "codigo_pedido")
    private String codigoPedido;

    @Column(nullable = false)
    private String tipo;

    @Embedded
    private Precio monto;

    @Column(name = "fecha_movimiento", nullable = false)
    private Instant fechaMovimiento;

    private String descripcion;

    @PrePersist
    public void prePersist() {

        if (fechaMovimiento == null) {
            fechaMovimiento = Instant.now();
        }
    }
}