package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.dto.PagoRequestDTO;
import unpsjb.labprog.backend.model.dto.PagoResponseDTO;

import java.util.UUID;

public interface PagoService {

    PagoResponseDTO procesarPago(
            PagoRequestDTO request
    );

    PagoResponseDTO obtenerPago(
            String codigoPago
    );

    void procesarReembolso(
            UUID idPedido
    );

    PagoResponseDTO ejecutarSplit(String codigoPago);

    PagoResponseDTO reembolsarPago(
            String codigoPago
    );
}
