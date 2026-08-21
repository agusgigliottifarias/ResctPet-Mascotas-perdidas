package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reglas_split")
@Data
@NoArgsConstructor
public class ReglaSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_regla_split")
    private Long idReglaSplit;

    @Column(nullable = false)
    private String destino;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private Double valor;

    private Double minimo;

    private Double maximo;
}