package unpsjb.labprog.backend.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import unpsjb.labprog.backend.model.Precio;
import unpsjb.labprog.backend.model.enums.AccionPago;

import java.util.Map;

@Data
@NoArgsConstructor
public class PagoRequestDTO {

    private String codigoPedido;
    private String emailConsumidor;
    private Precio monto;
    private String metodo;
    private AccionPago accion;
    private Map<String, Object> simulacion;
}