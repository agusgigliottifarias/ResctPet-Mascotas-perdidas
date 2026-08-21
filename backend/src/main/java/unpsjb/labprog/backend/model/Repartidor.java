package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import unpsjb.labprog.backend.model.enums.EstadoRepartidor;

import java.util.UUID;

@Entity
@Table(name = "repartidores")
@Data
@NoArgsConstructor
public class Repartidor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idRepartidor;

    @Column(nullable = false, unique = true)
    private String codigo;

    private String nombre;

    private String tipoVehiculo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoRepartidor estado;

    private Double calificacionPromedio = 0.0;

    private Integer cantidadCalificaciones = 0;
}