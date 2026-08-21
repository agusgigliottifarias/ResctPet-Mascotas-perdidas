package unpsjb.labprog.backend.business;
import unpsjb.labprog.backend.model.Pedido;

import java.time.Instant;
import java.util.Map;

public interface HistorialPedidoService {

    Map<String, Object> obtenerHistorial(
            String emailConsumidor,
            String estado,
            Instant desde,
            Instant hasta,
            String codigoRestaurante,
            int page,
            int size
    );

    void actualizarHistorialPedido(Pedido pedido);

}