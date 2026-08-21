package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.model.HistorialPedido;
import unpsjb.labprog.backend.model.dto.HistorialPedidoDTO;

@Component
public class HistorialPedidoMapper {

    public HistorialPedidoDTO toDTO(HistorialPedido historialPedido) {

        HistorialPedidoDTO dto = new HistorialPedidoDTO();

        dto.setCodigoPedido(historialPedido.getCodigoPedido());
        dto.setEstado(historialPedido.getEstado());
        dto.setCreadoEn(historialPedido.getCreadoEn());
        dto.setTotal(historialPedido.getTotal());

        dto.setCodigoRestaurante(historialPedido.getCodigoRestaurante());
        dto.setNombreRestaurante(historialPedido.getNombreRestaurante());

        dto.setEstadoTicket(historialPedido.getEstadoTicket());
        dto.setEstadoEntrega(historialPedido.getEstadoEntrega());

        return dto;
    }
}