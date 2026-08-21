package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.MetodoCalculoETA;

import java.time.Instant;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "entregas")
@Data
@NoArgsConstructor
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idEntrega;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private UUID idPedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEntrega estado;

    private Instant tiempoEstimadoArribo;

    private Double distanciaMetros;

    private Long duracionEstimadaSegundos;

    private Instant ultimaActualizacionEta;

    @Enumerated(EnumType.STRING)
    private MetodoCalculoETA metodoCalculoEta;

    private Instant fechaHoraEntregaReal;

    private String motivo;

    @ElementCollection
    @CollectionTable(
            name = "entrega_ruta_tracking",
            joinColumns = @JoinColumn(name = "id_entrega")
    )
    @OrderColumn(name = "orden")
    private List<PuntoRuta> rutaTracking = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "id_repartidor")
    private Repartidor repartidor;
}