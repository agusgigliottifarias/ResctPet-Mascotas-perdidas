package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "configuraciones_split")
@Data
@NoArgsConstructor
public class ConfiguracionSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_configuracion_split")
    private Long idConfiguracionSplit;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String moneda;

    @Column(nullable = false)
    private boolean activa = true;

    @Column(name = "codigo_restaurante")
    private String codigoRestaurante;

    @Column(name = "creado_en")
    private Instant creadoEn;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_configuracion_split")
    private List<ReglaSplit> reglas = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (creadoEn == null) {
            creadoEn = Instant.now();
        }
    }
}