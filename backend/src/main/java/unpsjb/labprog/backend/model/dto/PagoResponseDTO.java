package unpsjb.labprog.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import unpsjb.labprog.backend.model.Precio;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagoResponseDTO {

    private String codigoPago;
    private String estadoPago;
    private String codigoPedido;
    private String estadoPedido;
    private String codigoTicket;
    private Precio monto;
    private String metodo;
    private String sugerencia;
    private Boolean idempotente;
    private List<SplitPagoDTO> splits;
    private ComisionPlataformaInfo comisionPlataforma;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SplitPagoDTO {

        private String destino;
        private String referenciaDestino;
        private Precio monto;
    }

   @Data
@NoArgsConstructor
@AllArgsConstructor
public static class ComisionPlataformaInfo {

    private Double montoAplicado;
    private String reglaAplicada;
    private String promocionAplicada;
}
}