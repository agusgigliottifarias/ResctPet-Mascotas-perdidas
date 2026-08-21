package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import unpsjb.labprog.backend.model.enums.EstadoPedido;

import java.time.Instant;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idPedido;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String emailConsumidor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado;

    @Version
    private Long version;

    private Instant fechaCreacion;

    private Instant fechaHoraCancelacion;

    private String motivoCancelacion;

    private Instant fechaHoraRechazo;

    private String motivoRechazo;

    private String detalleMotivoRechazo;

    @Column(name = "metodo_pago")
    private String metodoPago;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "monto", column = @Column(name = "total_monto")),
        @AttributeOverride(name = "moneda", column = @Column(name = "total_moneda"))
    })
    private Precio total;

    @Embedded
    private Direccion direccionEntrega;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_restaurante")
    private Restaurante restaurante;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_pedido")
    private List<ItemPedido> lineas = new ArrayList<>();

    @PrePersist
    public void prePersist() {

        if (fechaCreacion == null) {
            fechaCreacion = Instant.now();
        }
    }
}