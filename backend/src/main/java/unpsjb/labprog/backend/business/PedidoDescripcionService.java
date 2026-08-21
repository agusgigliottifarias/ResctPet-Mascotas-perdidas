package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.ItemPedido;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoDescripcionService {

    public String describirItems(List<ItemPedido> items) {

        return items.stream()
                .map(item ->
                        item.getCantidad()
                                + "x "
                                + item.getNombre()
                )
                .collect(Collectors.joining(", "));
    }
}