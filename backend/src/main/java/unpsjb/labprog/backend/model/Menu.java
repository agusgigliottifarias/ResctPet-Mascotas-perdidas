package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "menus")
@Data
@NoArgsConstructor
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idMenu;

    @Column(nullable = false, unique = true)
    private String codigo;

    private String nombre;
    private Boolean activo;
    private Boolean principal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_restaurante")
    private Restaurante restaurante;

    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL)
    private List<ItemMenu> items;
}