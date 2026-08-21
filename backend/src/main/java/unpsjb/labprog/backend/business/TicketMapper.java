package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.dto.TicketResponseDTO;
import unpsjb.labprog.backend.repository.PedidoRepository;
import unpsjb.labprog.backend.repository.RestauranteRepository;

@Component
public class TicketMapper {

    private final PedidoRepository pedidoRepository;
    private final RestauranteRepository restauranteRepository;

    public TicketMapper(
            PedidoRepository pedidoRepository,
            RestauranteRepository restauranteRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.restauranteRepository = restauranteRepository;
    }

    public TicketResponseDTO toDTO(Ticket ticket) {

        TicketResponseDTO dto = new TicketResponseDTO();

        Pedido pedido = pedidoRepository
                .findById(ticket.getIdPedido())
                .orElseThrow();

        Restaurante restaurante = restauranteRepository
                .findById(ticket.getIdRestaurante())
                .orElseThrow();

        dto.setIdTicket(ticket.getCodigo());
        dto.setIdPedido(pedido.getCodigo());
        dto.setIdRestaurante(restaurante.getCodigo());
        dto.setEstadoTicket(ticket.getEstado().name());
        dto.setMotivo(ticket.getMotivo());
        dto.setInicioPreparacion(ticket.getInicioPreparacion());
        dto.setFinPreparacion(ticket.getFinPreparacion());
        dto.setDuracionPreparacionSegundos(ticket.getDuracionPreparacionSegundos());
        dto.setAnuladoEn(ticket.getAnuladoEn());
        dto.setListoPara(ticket.getListoPara());

        return dto;
    }
}