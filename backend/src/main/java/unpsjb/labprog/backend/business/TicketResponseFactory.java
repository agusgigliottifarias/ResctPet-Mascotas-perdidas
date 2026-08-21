package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.dto.TicketResponseDTO;

@Component
@RequiredArgsConstructor
public class TicketResponseFactory {

    private final TicketMapper ticketMapper;

    public TicketResponseDTO construir(
            Ticket ticket,
            boolean idempotente
    ) {

        TicketResponseDTO dto = ticketMapper.toDTO(ticket);

        dto.setIdempotente(idempotente);

        return dto;
    }
}