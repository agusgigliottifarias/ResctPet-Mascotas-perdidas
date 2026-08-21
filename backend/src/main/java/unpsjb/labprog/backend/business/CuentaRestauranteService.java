package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.MovimientoCuentaRestaurante;
import unpsjb.labprog.backend.model.Precio;
import unpsjb.labprog.backend.model.SplitPago;
import unpsjb.labprog.backend.repository.MovimientoCuentaRestauranteRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CuentaRestauranteService {

    private final MovimientoCuentaRestauranteRepository movimientoRepository;

    public void registrarVenta(
            String codigoRestaurante,
            String codigoPedido,
            SplitPago split
    ) {
        MovimientoCuentaRestaurante movimiento =
                new MovimientoCuentaRestaurante();

        movimiento.setCodigoRestaurante(codigoRestaurante);
        movimiento.setCodigoPedido(codigoPedido);
        movimiento.setTipo("VENTA_PEDIDO");
        movimiento.setMonto(split.getMonto());
        movimiento.setDescripcion(
                "Venta generada por pedido " + codigoPedido
        );

        movimientoRepository.save(movimiento);
    }

    public List<MovimientoCuentaRestaurante> listarMovimientos(
            String codigoRestaurante
    ) {
        return movimientoRepository
                .findByCodigoRestauranteOrderByFechaMovimientoDesc(
                        codigoRestaurante
                );
    }

    public Precio calcularSaldo(String codigoRestaurante) {
        List<MovimientoCuentaRestaurante> movimientos =
                listarMovimientos(codigoRestaurante);

        double saldo = movimientos.stream()
                .mapToDouble(m -> m.getMonto().getMonto())
                .sum();

        String moneda = movimientos.isEmpty()
                ? "ARS"
                : movimientos.get(0).getMonto().getMoneda();

        return new Precio(saldo, moneda);
    }
}