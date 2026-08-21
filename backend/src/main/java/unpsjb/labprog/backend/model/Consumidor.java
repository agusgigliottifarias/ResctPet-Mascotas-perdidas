package unpsjb.labprog.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "consumidores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consumidor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idConsumidor;

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Builder.Default
    private boolean activo = true;

    @Builder.Default
    private boolean notificacionesInAppHabilitadas = true;

    @Builder.Default
    private boolean notificacionesExternasHabilitadas = true;
}
