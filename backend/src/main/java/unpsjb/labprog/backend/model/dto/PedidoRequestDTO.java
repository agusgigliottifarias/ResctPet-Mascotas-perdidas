package unpsjb.labprog.backend.model.dto;

import unpsjb.labprog.backend.model.dto.LineaPedidoRequestDTO;

import lombok.Data;
import java.util.List;

@Data
public class PedidoRequestDTO {

    private String emailConsumidor;
    private String codigoRestaurante;
    private String codigoPedido;
    private DireccionDTO direccionEntrega;
    private String horaEntrega;
    private List<LineaPedidoRequestDTO> lineas;
    private String metodoPago;
}