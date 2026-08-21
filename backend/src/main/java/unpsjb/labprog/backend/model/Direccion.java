package unpsjb.labprog.backend.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ElementCollection;
import lombok.Data;

import java.util.List;

@Embeddable
@Data
public class Direccion {

    private String calle;
    private String numero;
    private String ciudad;
    private String provincia;

    @ElementCollection
    private List<Double> ubicacion; 
}