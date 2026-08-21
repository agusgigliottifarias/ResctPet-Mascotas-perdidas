package unpsjb.labprog.backend.business;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.model.Repartidor;
import unpsjb.labprog.backend.model.SplitPago;
import unpsjb.labprog.backend.model.dto.SaldoRepartidorDTO;
import unpsjb.labprog.backend.repository.RepartidorRepository;
import unpsjb.labprog.backend.repository.SplitPagoRepository;

@Service
@RequiredArgsConstructor
public class SaldoRepartidorServiceImpl
        implements SaldoRepartidorService {

    private final RepartidorRepository repartidorRepository;
    private final SplitPagoRepository splitPagoRepository;

    @Override
    public SaldoRepartidorDTO consultarSaldo(
            String codigoRepartidor
    ) {

        Repartidor repartidor = repartidorRepository
                .findByCodigo(codigoRepartidor)
                .orElseThrow(() -> new RuntimeException(
                        "CONFLICTO - REPARTIDOR_NO_ENCONTRADO"));

        List<SplitPago> splitsLiquidables =
                splitPagoRepository.findLiquidablesByRepartidor(
                        codigoRepartidor);

        BigDecimal saldoLiquidable = BigDecimal.ZERO;

        List<SaldoRepartidorDTO.Movimiento> movimientos =
                new ArrayList<>();

        for (SplitPago split : splitsLiquidables) {

            double monto =
                    split.getMonto().getMonto();

            saldoLiquidable =
                    saldoLiquidable.add(
                            BigDecimal.valueOf(monto));

            SaldoRepartidorDTO.Movimiento movimiento =
                    SaldoRepartidorDTO.Movimiento.builder()
                            .tipo("ENTREGA_ENTREGADA")
                            .idReferencia(
                                    split.getId().toString()
                            )
                            .monto(monto)
                            .timestamp(
                                    split.getFechaLiquidable()
                            )
                            .build();

            movimientos.add(movimiento);
        }

        return SaldoRepartidorDTO.builder()
                .idRepartidor(repartidor.getCodigo())
                .moneda("ARS")
                .saldoLiquidable(saldoLiquidable)
                .saldoEnLiquidacion(BigDecimal.ZERO)
                .saldoPagado(BigDecimal.ZERO)
                .ultimaActualizacion(Instant.now())
                .movimientos(movimientos)
                .build();
    }
}