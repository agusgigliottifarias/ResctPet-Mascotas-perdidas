package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import unpsjb.labprog.backend.model.*;
import unpsjb.labprog.backend.model.dto.*;
import unpsjb.labprog.backend.model.enums.*;
import unpsjb.labprog.backend.repository.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoCocinaWorkflowService {

    private final PedidoRepository pedidoRepository;
    private final TicketRepository ticketRepository;
    private final RestauranteRepository restauranteRepository;
    private final ItemMenuRepository itemMenuRepository;

    private final TicketService ticketService;
    private final PedidoValidator pedidoValidator;
    private final PedidoFinder pedidoFinder;
    private final HistorialPedidoService historialPedidoService;
    private final PedidoEntregaService pedidoEntregaService;
    private final SeleccionRepartidorService seleccionRepartidorService;
    private final TiempoPreparacionRestauranteService tiempoPreparacionRestauranteService;
    private final PedidoResponseMapper pedidoResponseMapper;

    @Transactional
    public PedidoResponseDTO aceptarPedidoRestaurante(
            String codigoPedido,
            String codigoRestaurante,
            String listoPara
    ) {
        Pedido pedido = pedidoFinder.buscarPedidoExistente(codigoPedido);

        Restaurante restaurante;

        if (codigoRestaurante != null) {
            restaurante = restauranteRepository
                    .findByCodigo(codigoRestaurante)
                    .orElseThrow(() -> conflicto("RESTAURANTE_NO_ENCONTRADO"));
        } else {
            restaurante = pedido.getRestaurante();

            if (restaurante == null) {
                throw conflicto("RESTAURANTE_NO_ENCONTRADO");
            }
        }

        pedidoValidator.validarPedidoPerteneceARestaurante(pedido, restaurante);
        pedidoValidator.validarPedidoAceptable(pedido);

        if (listoPara != null) {
            pedidoValidator.validarTiempoCompromiso(Instant.parse(listoPara));
        }

        Ticket ticket = pedidoFinder.buscarTicketExistente(pedido.getIdPedido());

        pedidoValidator.validarTicketAceptable(ticket);
        pedidoValidator.validarRestauranteDisponible(restaurante);

        if (tiempoPreparacionRestauranteService.restauranteSinCapacidad(
                restaurante.getIdRestaurante()
        )) {
            throw conflicto("SIN_CAPACIDAD_OPERATIVA");
        }

        for (ItemPedido itemPedido : pedido.getLineas()) {
            ItemMenu itemMenu = itemMenuRepository
                    .findByCodigoAndMenu_Restaurante_Codigo(
                            itemPedido.getCodigoItemMenu(),
                            restaurante.getCodigo()
                    )
                    .orElseThrow(() -> conflicto("ITEM_NO_ENCONTRADO"));

            if (!itemMenu.getDisponible()) {
                throw conflicto("ITEMS_NO_DISPONIBLES");
            }
        }

        ticket.setEstado(EstadoTicket.TOMADO);

        if (listoPara != null) {
            ticket.setListoPara(Instant.parse(listoPara));
        } else {
            ticket.setListoPara(
                    tiempoPreparacionRestauranteService.calcularEstimadoListo(pedido)
            );
        }

        ticket.setEstimadoListo(ticket.getListoPara());
        ticket.setFechaHoraAceptacion(Instant.now());
        ticket.setAceptadoPor(restaurante.getCodigo());

        try {
            ticketRepository.save(ticket);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw conflicto("OPERACION_CONCURRENTE");
        }

        Entrega entrega = pedidoFinder.buscarEntregaOpcional(pedido.getIdPedido());

        if (entrega == null) {
            entrega = pedidoEntregaService.asignarRepartidor(
                    pedido,
                    ticket,
                    seleccionRepartidorService.seleccionar().getCodigo()
            );
        }

        historialPedidoService.actualizarHistorialPedido(pedido);

        return mapToResponseDTO(pedido, ticket, entrega);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPedidosPendientes() {
        List<EstadoPedido> estadosCocina = List.of(
                EstadoPedido.APROBADO
        );

        return pedidoRepository
                .findByEstadoIn(estadosCocina)
                .stream()
                .map(p -> mapToResponseDTO(
                p,
                pedidoFinder.buscarTicketOpcional(p.getIdPedido()),
                null
        ))
                .collect(Collectors.toList());
    }

    @Transactional
    public PedidoResponseDTO iniciarPreparacion(String codigoPedido) {
        Pedido pedido = pedidoFinder.buscarPedidoExistente(codigoPedido);
        Ticket ticket = pedidoFinder.buscarTicketExistente(pedido.getIdPedido());

        ticketService.marcarEnPreparacion(codigoPedido);

        ticket = pedidoFinder.buscarTicketExistente(pedido.getIdPedido());

        historialPedidoService.actualizarHistorialPedido(pedido);

        return mapToResponseDTO(
                pedido,
                ticket,
                pedidoFinder.buscarEntregaOpcional(pedido.getIdPedido())
        );
    }

    @Transactional
    public PedidoResponseDTO marcarPedidoListo(String codigoPedido) {
        Pedido pedido = pedidoFinder.buscarPedidoExistente(codigoPedido);
        Ticket ticket = pedidoFinder.buscarTicketExistente(pedido.getIdPedido());

        ticketService.marcarListo(codigoPedido);

        ticket = pedidoFinder.buscarTicketExistente(pedido.getIdPedido());

        historialPedidoService.actualizarHistorialPedido(pedido);

        return mapToResponseDTO(
                pedido,
                ticket,
                pedidoFinder.buscarEntregaOpcional(pedido.getIdPedido())
        );
    }

    private PedidoResponseDTO mapToResponseDTO(
            Pedido pedido,
            Ticket ticket,
            Entrega entrega
    ) {
        Pago pago = pedidoFinder.buscarPagoOpcional(pedido.getIdPedido());

        return pedidoResponseMapper.toDTO(
                pedido,
                ticket,
                entrega,
                pago
        );
    }

    private ResponseStatusException conflicto(String mensaje) {
        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}
