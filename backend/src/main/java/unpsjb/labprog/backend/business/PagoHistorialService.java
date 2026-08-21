package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.HistorialPedido;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.repository.HistorialPedidoRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PagoHistorialService {

    private final HistorialPedidoRepository historialPedidoRepository;
 
    @Transactional
    public void actualizarHistorialPedido(
            Pedido pedido
    ) {

        HistorialPedido historial
                = historialPedidoRepository
                        .findByCodigoPedido(
                                pedido.getCodigo()
                        )
                        .orElse(new HistorialPedido());

        historial.setCodigoPedido(
                pedido.getCodigo()
        );

        historial.setEmailConsumidor(
                pedido.getEmailConsumidor()
        );

        historial.setEstado(
                pedido.getEstado().name()
        );

        historial.setTotal(
                pedido.getTotal()
        );

        historial.setFechaActualizacion(
                Instant.now()
        );

        historialPedidoRepository.save(historial);
    }
}