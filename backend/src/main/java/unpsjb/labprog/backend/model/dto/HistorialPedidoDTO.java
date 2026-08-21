package unpsjb.labprog.backend.model.dto;

import lombok.Data;
import unpsjb.labprog.backend.model.Precio;

import java.time.Instant;

@Data
public class HistorialPedidoDTO {

    private String codigoPedido;
    private String estado;
    private Instant creadoEn;
    private Precio total;
    private String codigoRestaurante;
    private String nombreRestaurante;
    private String estadoTicket;
    private String estadoEntrega;
}