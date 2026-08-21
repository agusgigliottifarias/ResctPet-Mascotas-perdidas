package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;
import unpsjb.labprog.backend.model.*;
import unpsjb.labprog.backend.model.dto.DireccionDTO;
import unpsjb.labprog.backend.model.dto.LineaPedidoRequestDTO;

import java.util.List;

@Component
public class PedidoFactory {

    public Direccion crearDireccion(DireccionDTO direccionRequest) {
        Direccion direccion = new Direccion();

        direccion.setCalle(direccionRequest.getCalle());
        direccion.setNumero(direccionRequest.getNumero());
        direccion.setCiudad(direccionRequest.getCiudad());
        direccion.setProvincia(direccionRequest.getProvincia());
        direccion.setUbicacion(direccionRequest.getUbicacion());

        return direccion;
    }

    public ItemPedido crearItemPedido(
            ItemMenu item,
            LineaPedidoRequestDTO linea
    ) {
        ItemPedido itemPedido = new ItemPedido();

        itemPedido.setCodigoItemMenu(item.getCodigo());
        itemPedido.setNombre(item.getNombre());
        itemPedido.setCantidad(linea.getCantidad());
        itemPedido.setAdicionalesElegidos(linea.getAdicionales());

        List<String> nombresAdicionales =
                item.getAdicionales()
                        .stream()
                        .filter(adicional ->
                                linea.getAdicionales() != null
                                        && linea.getAdicionales()
                                        .contains(adicional.getCodigo())
                        )
                        .map(Adicional::getNombre)
                        .toList();

        itemPedido.setNombresAdicionales(nombresAdicionales);

        double precioBase = item.getPrecio().getMonto();
        double precioAdicionales = calcularPrecioAdicionales(item, linea);

        itemPedido.setPrecioUnitario(
                crearPrecio(precioBase + precioAdicionales, "ARS")
        );

        return itemPedido;
    }

    public Precio crearPrecio(
            double monto,
            String moneda
    ) {
        Precio precio = new Precio();

        precio.setMonto(monto);
        precio.setMoneda(moneda);

        return precio;
    }

    private double calcularPrecioAdicionales(
            ItemMenu item,
            LineaPedidoRequestDTO linea
    ) {
        if (linea.getAdicionales() == null || item.getAdicionales() == null) {
            return 0;
        }

        return item.getAdicionales()
                .stream()
                .filter(a ->
                        linea.getAdicionales()
                                .stream()
                                .anyMatch(enviado ->
                                        enviado.equalsIgnoreCase(a.getNombre())
                                                || enviado.equals(a.getCodigo())
                                )
                )
                .mapToDouble(Adicional::getPrecio)
                .sum();
    }
}