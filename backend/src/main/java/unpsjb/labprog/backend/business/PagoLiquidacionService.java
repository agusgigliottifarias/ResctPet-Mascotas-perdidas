package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import unpsjb.labprog.backend.model.Pago;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.repository.PagoRepository;
import unpsjb.labprog.backend.model.enums.EstadoPago;
import unpsjb.labprog.backend.repository.SplitPagoRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PagoLiquidacionService {

    private final PagoRepository pagoRepository;
    private final SplitPagoRepository splitPagoRepository;

    @Transactional(readOnly = true)
    public void validarHonorarioRepartidor(Pedido pedido) {

        Pago pago = obtenerPagoCapturado(pedido);

        boolean tieneHonorarioRepartidor
                = pago.getSplits()
                        .stream()
                        .anyMatch(split
                                -> "REPARTIDOR".equals(split.getDestino())
                        );

        if (!tieneHonorarioRepartidor) {
            throw conflicto("HONORARIO_NO_DEFINIDO_PARA_REPARTIDOR");
        }
    }
 
   @Transactional
    public void marcarHonorarioLiquidable(
            Pedido pedido,
            String codigoRepartidor
    ) {

        Pago pago = obtenerPagoCapturado(pedido);

        for (var split : pago.getSplits()) {

            if ("REPARTIDOR".equals(split.getDestino())) {
                split.setReferenciaDestino(codigoRepartidor);
                split.setLiquidable(true);
                split.setFechaLiquidable(Instant.now());

                splitPagoRepository.save(split);
            }
        }

        pagoRepository.save(pago);
    }

    @Transactional
    public void marcarSplitsLiquidables(Pedido pedido) {

        Pago pago = obtenerPagoCapturado(pedido);

        pago.getSplits()
                .forEach(split -> {
                    split.setLiquidable(true);
                    split.setFechaLiquidable(Instant.now());
                });

        pagoRepository.save(pago);
    }

    private Pago obtenerPagoCapturado(Pedido pedido) {

        return pagoRepository
                .findAllByIdPedidoOrderByFechaAutorizacionDesc(
                        pedido.getIdPedido()
                )
                .stream()
                .filter(pago -> pago.getEstado() == EstadoPago.CAPTURADO)
                .findFirst()
                .orElseThrow(()
                        -> conflicto("PAGO_NO_ENCONTRADO"));
    }

    private ResponseStatusException conflicto(String mensaje) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}
