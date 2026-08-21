package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;
import unpsjb.labprog.backend.model.Pedido;

import java.util.UUID;

@Component
public class PedidoCodeGenerator {

    public String generarCodigoPedido() {

        return "O-" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }

    public String generarCodigoTicket(Pedido pedido) {

        return "T-" + pedido.getCodigo()
                .replace("O-", "");
    }

    public String generarCodigoEntrega(Pedido pedido) {

        return "E-" + pedido.getCodigo()
                .replace("O-", "");
    }
}