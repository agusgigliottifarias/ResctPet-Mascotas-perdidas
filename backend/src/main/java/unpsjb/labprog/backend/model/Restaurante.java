package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "restaurantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID idRestaurante;

    @Column(nullable = false, unique = true)
    private String codigo;

    private String nombre;
    private String tipoCocina;
    private String ciudad;
    private Boolean aceptaPedidos;

    private Double latitud;
    private Double longitud;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "restaurante_metodos_pago",
            joinColumns = @JoinColumn(name = "id_restaurante")
    )
    @Column(name = "metodo_pago")
    private List<String> metodosPago;
}
