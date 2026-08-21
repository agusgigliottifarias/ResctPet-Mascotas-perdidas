package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.Repartidor;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.EstadoRepartidor;
import unpsjb.labprog.backend.repository.EntregaRepository;

@Service
@RequiredArgsConstructor
public class TicketEntregaService {

    private final EntregaRepository entregaRepository;

    public void actualizarEntregaTicketListo(
        Ticket ticket
) {
    // Cuando el pedido queda LISTO en cocina
    // no debe cambiar el estado de la entrega.
    // El estado EN_LOCAL se asigna cuando
    // el repartidor llega al restaurante.
}

    public void actualizarEntregaTicketAnulado(
            Ticket ticket
    ) {

        entregaRepository
                .findByIdPedido(ticket.getIdPedido())
                .ifPresent(entrega -> {

                    entrega.setEstado(EstadoEntrega.FALLIDA);

                    Repartidor repartidor = entrega.getRepartidor();

                    if (repartidor != null) {
                        repartidor.setEstado(EstadoRepartidor.EN_LINEA);
                    }

                    entregaRepository.save(entrega);
                });
    }
}