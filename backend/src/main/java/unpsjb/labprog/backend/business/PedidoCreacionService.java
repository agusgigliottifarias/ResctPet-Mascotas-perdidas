package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.*;
import unpsjb.labprog.backend.model.dto.LineaPedidoRequestDTO;
import unpsjb.labprog.backend.model.dto.PedidoRequestDTO;
import unpsjb.labprog.backend.model.enums.EstadoPedido;
import unpsjb.labprog.backend.repository.ItemMenuRepository;
import unpsjb.labprog.backend.repository.PedidoRepository;
import unpsjb.labprog.backend.repository.RestauranteRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PedidoCreacionService {

    private final PedidoRepository pedidoRepository;
    private final RestauranteRepository restauranteRepository;
    private final ItemMenuRepository itemMenuRepository;

    private final PedidoValidator pedidoValidator;
    private final PedidoFactory pedidoFactory;
    private final PedidoCodeGenerator pedidoCodeGenerator;

    @Transactional
    public Pedido crearPedido(PedidoRequestDTO request) {

        Restaurante restaurante = restauranteRepository
                .findByCodigo(request.getCodigoRestaurante())
                .orElseThrow(() -> conflicto("RESTAURANTE_NO_ENCONTRADO"));

        pedidoValidator.validarRestauranteDisponible(restaurante);
        validarLineas(request);

        if (request.getDireccionEntrega() != null) {
            pedidoValidator.validarDireccionDentroDelRango(
                    restaurante,
                    request.getDireccionEntrega().getUbicacion()
            );
        }

        Pedido pedido = construirPedidoBase(request, restaurante);

        List<ItemPedido> lineas = new ArrayList<>();
        double totalMonto = 0;

        for (LineaPedidoRequestDTO linea : request.getLineas()) {

            if (linea.getCantidad() <= 0) {
                throw conflicto("CANTIDAD_INVALIDA");
            }

            ItemMenu item = itemMenuRepository
                    .findByCodigoAndMenu_Restaurante_Codigo(
                            linea.getCodigoItem(),
                            request.getCodigoRestaurante()
                    )
                    .orElseThrow(() -> conflicto("ITEM_NO_ENCONTRADO_EN_MENU"));

            if (!item.getDisponible()) {
                throw conflicto("ITEM_NO_DISPONIBLE");
            }

            ItemPedido itemPedido = pedidoFactory.crearItemPedido(item, linea);

            totalMonto += itemPedido.getPrecioUnitario().getMonto()
                    * linea.getCantidad();

            lineas.add(itemPedido);
        }

        pedido.setLineas(lineas);
        pedido.setTotal(pedidoFactory.crearPrecio(totalMonto, "ARS"));

        return pedidoRepository.save(pedido);
    }

    private Pedido construirPedidoBase(
            PedidoRequestDTO request,
            Restaurante restaurante
    ) {
        Pedido pedido = new Pedido();

        pedido.setIdPedido(UUID.randomUUID());
        pedido.setCodigo(pedidoCodeGenerator.generarCodigoPedido());
        pedido.setEmailConsumidor(request.getEmailConsumidor());
        pedido.setRestaurante(restaurante);
        pedido.setEstado(EstadoPedido.CREACION_PENDIENTE);
        pedido.setMetodoPago(request.getMetodoPago());

        if (request.getDireccionEntrega() != null) {
            pedido.setDireccionEntrega(
                    pedidoFactory.crearDireccion(request.getDireccionEntrega())
            );
        }

        return pedido;
    }

    private void validarLineas(PedidoRequestDTO request) {

        if (request.getLineas() == null || request.getLineas().isEmpty()) {
            throw conflicto("PEDIDO_SIN_ITEMS");
        }
    }

    private ResponseStatusException conflicto(String mensaje) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}