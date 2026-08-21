package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.EventoSplitPago;
import unpsjb.labprog.backend.repository.EventoSplitPagoRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventoSplitPagoService {

    private final EventoSplitPagoRepository eventoRepository;
 
    @Transactional
    public void registrar(
            String codigoPago,
            String codigoPedido,
            String tipoEvento,
            String detalle
    ) {

        EventoSplitPago evento = new EventoSplitPago();

        evento.setCodigoPago(codigoPago);
        evento.setCodigoPedido(codigoPedido);
        evento.setTipoEvento(tipoEvento);
        evento.setDetalle(detalle);

        eventoRepository.save(evento);
    }
}