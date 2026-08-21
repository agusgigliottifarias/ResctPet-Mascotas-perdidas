package unpsjb.labprog.backend.model;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "items_pedido")
@Data
@NoArgsConstructor
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String codigoItemMenu;

    private String nombre;

    private Integer cantidad;

    @Embedded
    private Precio precioUnitario;

    @ElementCollection
    @CollectionTable(
            name = "item_pedido_adicionales",
            joinColumns = @JoinColumn(name = "item_pedido_id")
    )
    private List<String> adicionalesElegidos;

    @ElementCollection
    @CollectionTable(
            name = "item_pedido_nombres_adicionales",
            joinColumns = @JoinColumn(name = "item_pedido_id")
    )
    private List<String> nombresAdicionales;
}
