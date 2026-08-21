package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.model.Pago;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Ticket;
import unpsjb.labprog.backend.model.dto.PagoResponseDTO;
import unpsjb.labprog.backend.model.enums.EstadoPago;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PagoResponseMapper {

    public PagoResponseDTO toDTO(
            Pago pago,
            Pedido pedido,
            Ticket ticket
    ) {

        List<PagoResponseDTO.SplitPagoDTO> splits =
                pago.getSplits()
                        .stream()
                        .map(s -> new PagoResponseDTO.SplitPagoDTO(
                                s.getDestino(),
                                s.getReferenciaDestino(),
                                s.getMonto()
                        ))
                        .collect(Collectors.toList());

        PagoResponseDTO.ComisionPlataformaInfo comisionPlataforma =
                pago.getSplits()
                        .stream()
                        .filter(s -> "PLATAFORMA".equals(s.getDestino()))
                        .findFirst()
                        .map(s -> new PagoResponseDTO.ComisionPlataformaInfo(
                                s.getMonto().getMonto(),
                                s.getReglaAplicada(),
                                null
                        ))
                        .orElse(null);

        PagoResponseDTO response = new PagoResponseDTO(
                pago.getCodigo(),
                pago.getEstado().name(),
                pedido.getCodigo(),
                pedido.getEstado().name(),
                ticket != null ? ticket.getCodigo() : null,
                pago.getMonto(),
                pago.getMetodo(),
                null,
                false,
                splits,
                comisionPlataforma
        );

        if (pago.getEstado() == EstadoPago.RECHAZADO) {
            response.setSugerencia(
                    "Reintentar cambiando medio de pago"
            );
        }

        return response;
    }
}