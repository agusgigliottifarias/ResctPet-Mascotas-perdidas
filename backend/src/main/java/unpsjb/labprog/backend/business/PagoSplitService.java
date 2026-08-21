package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.ConfiguracionSplit;
import unpsjb.labprog.backend.model.Pago;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Precio;
import unpsjb.labprog.backend.model.ReglaSplit;
import unpsjb.labprog.backend.model.SplitPago;
import unpsjb.labprog.backend.repository.ConfiguracionSplitRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoSplitService {

    private final ConfiguracionSplitRepository configuracionSplitRepository;
    private final AuditoriaSplitPagoService auditoriaSplitPagoService;
    private final ComisionService comisionService;

    public List<SplitPago> calcularSplits(
            Pedido pedido,
            Precio total
    ) {

        if (total == null || total.getMonto() <= 0) {
            throw conflicto("MONTO_INVALIDO");
        }

        ConfiguracionSplit configuracion
                = configuracionSplitRepository
                        .findActivaByMonedaAndRestaurante(
                                total.getMoneda(),
                                pedido.getRestaurante().getCodigo()
                        )
                        .orElseGet(()
                                -> configuracionSplitRepository
                                .findDefaultActivaByMoneda(
                                        total.getMoneda()
                                )
                                .orElseThrow(()
                                        -> conflicto(
                                        "REGLAS_SPLIT_NO_CONFIGURADAS"
                                )
                                )
                        );

        double totalPorcentajes = configuracion.getReglas()
                .stream()
                .filter(r -> "PORCENTAJE".equals(r.getTipo()))
                .mapToDouble(ReglaSplit::getValor)
                .sum();

        if (Math.abs(totalPorcentajes - 1.0) > 0.0001) {
            throw conflicto("SPLIT_NO_CUADRA");
        }

        List<SplitPago> splits = new ArrayList<>();

        double montoTotal = total.getMonto();

        for (ReglaSplit regla : configuracion.getReglas()) {

            double montoSplit;
            String reglaAplicada = configuracion.getCodigo();

            if ("PLATAFORMA".equals(regla.getDestino())) {

                ComisionService.ResultadoComision resultado
                        = comisionService.calcular(
                                pedido,
                                montoTotal,
                                total.getMoneda(),
                                "TARJETA"
                        );

                montoSplit = resultado.getMontoAplicado();
                reglaAplicada = resultado.getReglaAplicada();

                auditoriaSplitPagoService.registrar(
                        "PENDIENTE",
                        pedido.getCodigo(),
                        "COMISION_PLATAFORMA_APLICADA",
                        "PLATAFORMA",
                        resultado.getMontoCalculado(),
                        resultado.getMontoAplicado(),
                        "Regla aplicada: " + resultado.getReglaAplicada()
                        + " - Restaurante: " + pedido.getRestaurante().getCodigo()
                );

            } else if ("PORCENTAJE".equals(regla.getTipo())) {

                montoSplit = montoTotal * regla.getValor();

            } else {

                montoSplit = regla.getValor();
            }

            double montoOriginal = montoSplit;

            if (regla.getMinimo() != null
                    && montoSplit < regla.getMinimo()) {

                montoSplit = regla.getMinimo();

                auditoriaSplitPagoService.registrar(
                        "PENDIENTE",
                        pedido.getCodigo(),
                        "AJUSTE_TOPE_MINIMO_" + regla.getDestino(),
                        regla.getDestino(),
                        montoOriginal,
                        montoSplit,
                        "Aplicación de tope mínimo"
                );
            }

            if (regla.getMaximo() != null
                    && montoSplit > regla.getMaximo()) {

                montoSplit = regla.getMaximo();

                auditoriaSplitPagoService.registrar(
                        "PENDIENTE",
                        pedido.getCodigo(),
                        "AJUSTE_TOPE_MAXIMO_" + regla.getDestino(),
                        regla.getDestino(),
                        montoOriginal,
                        montoSplit,
                        "Aplicación de tope máximo"
                );
            }

            String referenciaDestino = null;

            if ("RESTAURANTE".equals(regla.getDestino())) {
                referenciaDestino = pedido.getRestaurante().getCodigo();
            }

            SplitPago split = crearSplit(
                    regla.getDestino(),
                    referenciaDestino,
                    montoSplit,
                    total.getMoneda()
            );

            split.setReglaAplicada(reglaAplicada);

            splits.add(split);
        }

        ajustarDiferenciaRedondeo(
                splits,
                total.getMonto()
        );

        return splits;

    }

    public void validarSplits(
            Pago pago
    ) {

        double totalSplits = pago.getSplits()
                .stream()
                .mapToDouble(s -> s.getMonto().getMonto())
                .sum();

        double totalPago = pago.getMonto().getMonto();

        if (Math.abs(totalSplits - totalPago) > 0.01) {
            throw conflicto("SPLIT_NO_CUADRA");
        }
    }

    private SplitPago crearSplit(
            String destino,
            String referenciaDestino,
            double monto,
            String moneda
    ) {

        SplitPago split = new SplitPago();

        split.setDestino(destino);
        split.setReferenciaDestino(referenciaDestino);
        split.setMonto(new Precio(monto, moneda));

        return split;
    }

    private void ajustarDiferenciaRedondeo(
            List<SplitPago> splits,
            double montoTotal
    ) {

        double sumaSplits = splits.stream()
                .mapToDouble(s -> s.getMonto().getMonto())
                .sum();

        double diferencia = montoTotal - sumaSplits;

        if (Math.abs(diferencia) <= 0.0001) {
            return;
        }

        SplitPago splitRestaurante = splits.stream()
                .filter(s -> "RESTAURANTE".equals(s.getDestino()))
                .findFirst()
                .orElseThrow(() -> conflicto("SPLIT_NO_CUADRA"));

        double montoActual = splitRestaurante.getMonto().getMonto();
        double montoNuevo = montoActual + diferencia;

        splitRestaurante.setMonto(
                new Precio(
                        montoNuevo,
                        splitRestaurante.getMonto().getMoneda()
                )
        );

        auditoriaSplitPagoService.registrar(
                "PENDIENTE",
                "PENDIENTE",
                "AJUSTE_REDONDEO",
                "RESTAURANTE",
                montoActual,
                montoNuevo,
                "Diferencia para cuadrar split asignada al restaurante"
        );
    }

    private RuntimeException conflicto(
            String mensaje
    ) {

        return new RuntimeException(
                "CONFLICTO - " + mensaje
        );
    }
}
