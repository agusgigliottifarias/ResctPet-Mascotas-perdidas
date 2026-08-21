package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.ItemPedido;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.enums.EstadoTicket;
import unpsjb.labprog.backend.repository.TicketRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TiempoPreparacionRestauranteService {

    private static final int MINUTOS_BASE = 10;
    private static final int MINUTOS_POR_TICKET_EN_COCINA = 5;
    private static final int MINUTOS_POR_ITEM_EXTRA = 2;
    private static final int MINUTOS_MAXIMOS = 60;

    private static final List<EstadoTicket> ESTADOS_EN_COCINA = List.of(
            EstadoTicket.ACEPTADO,
            EstadoTicket.TOMADO,
            EstadoTicket.EN_PREPARACION
    );

    private final TicketRepository ticketRepository;

    public Instant calcularEstimadoListo(Pedido pedido) {
        int cantidadTicketsEnCocina = ticketRepository.contarTicketsPorRestauranteYEstados(
                pedido.getRestaurante().getIdRestaurante(),
                ESTADOS_EN_COCINA
        );

        int cantidadItems = calcularCantidadItems(pedido);

        int minutosEstimados = MINUTOS_BASE
                + cantidadTicketsEnCocina * MINUTOS_POR_TICKET_EN_COCINA
                + Math.max(0, cantidadItems - 1) * MINUTOS_POR_ITEM_EXTRA;

        minutosEstimados = Math.min(minutosEstimados, MINUTOS_MAXIMOS);

        return Instant.now().plus(Duration.ofMinutes(minutosEstimados));
    }

    public boolean restauranteSinCapacidad(UUID idRestaurante) {
        int cantidadTicketsEnCocina = ticketRepository.contarTicketsPorRestauranteYEstados(
                idRestaurante,
                List.of(EstadoTicket.TOMADO, EstadoTicket.EN_PREPARACION)
        );

        return cantidadTicketsEnCocina >= 100;
    }

    private int calcularCantidadItems(Pedido pedido) {
        if (pedido.getLineas() == null || pedido.getLineas().isEmpty()) {
            return 1;
        }

        return pedido.getLineas()
                .stream()
                .map(ItemPedido::getCantidad)
                .filter(cantidad -> cantidad != null && cantidad > 0)
                .mapToInt(Integer::intValue)
                .sum();
    }
}
