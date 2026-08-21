package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Entity
@Table(name = "items_menu")
@Data
@NoArgsConstructor
public class ItemMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idItem;

    @Column(nullable = false, unique = true)
    private String codigo;

    private String nombre;
    private Boolean disponible;

    @Embedded
    private Precio precio;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_item")
    private List<Adicional> adicionales = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_menu")
    private Menu menu;

    public Double getPrecioTotal() {

        Double total =
                (precio != null && precio.getMonto() != null)
                        ? precio.getMonto()
                        : 0.0;

        if (adicionales != null) {

            total += adicionales.stream()
                    .mapToDouble(a ->
                            a.getPrecio() != null
                                    ? a.getPrecio()
                                    : 0.0
                    )
                    .sum();
        }

        return total;
    }
}