package unpsjb.labprog.backend.business;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.PromocionComision;
import unpsjb.labprog.backend.model.ReglaComision;
import unpsjb.labprog.backend.repository.PromocionComisionRepository;
import unpsjb.labprog.backend.repository.ReglaComisionRepository;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComisionService {

    private final ReglaComisionRepository reglaComisionRepository;
    private final PromocionComisionRepository promocionComisionRepository;
    private final AuditoriaSplitPagoService auditoriaSplitPagoService;

    public ResultadoComision calcular(
            Pedido pedido,
            double total,
            String moneda,
            String metodoPago
    ) {

        List<ReglaComision> reglas =
                reglaComisionRepository.findReglasAplicables(
                        moneda,
                        pedido.getRestaurante().getCodigo(),
                        pedido.getRestaurante().getCiudad(),
                        metodoPago,
                        Instant.now()
                );

        if (reglas.isEmpty()) {
            throw conflicto("REGLAS_COMISION_NO_CONFIGURADAS");
        }

        ReglaComision regla = reglas.get(0);

        validar(regla);

        double montoCalculado =
                total * regla.getPorcentajeSobreTotal()
                + regla.getMontoFijo();

        double montoAplicado = montoCalculado;
        String promocionAplicada = null;

        if (regla.getTopeMinimo() != null
                && montoAplicado < regla.getTopeMinimo()) {
            montoAplicado = regla.getTopeMinimo();
        }

        if (regla.getTopeMaximo() != null
                && montoAplicado > regla.getTopeMaximo()) {
            montoAplicado = regla.getTopeMaximo();
        }

        var promocion = promocionComisionRepository
                .findActivaByRestaurante(
                        pedido.getRestaurante().getCodigo(),
                        Instant.now()
                );

        if (promocion.isPresent()) {

            PromocionComision promo = promocion.get();

            promocionAplicada = promo.getCodigo();

            double montoAntesPromo = montoAplicado;
            double descuento = total * promo.getDescuentoPorcentaje();

            montoAplicado = montoAplicado - descuento;

            auditoriaSplitPagoService.registrar(
                    "PENDIENTE",
                    pedido.getCodigo(),
                    "PROMOCION_COMISION_APLICADA",
                    "PLATAFORMA",
                    montoAntesPromo,
                    montoAplicado,
                    "Promoción aplicada: " + promo.getCodigo()
            );

            if (montoAplicado < 0) {

                auditoriaSplitPagoService.registrar(
                        "PENDIENTE",
                        pedido.getCodigo(),
                        "AJUSTE_COMISION_A_CERO",
                        "PLATAFORMA",
                        montoAplicado,
                        0.0,
                        "Promoción dejó comisión negativa: " + promo.getCodigo()
                );

                montoAplicado = 0;
            }
        }

        montoAplicado = Math.round(montoAplicado);

        return new ResultadoComision(
                regla.getCodigo(),
                regla.getPorcentajeSobreTotal(),
                regla.getMontoFijo(),
                regla.getTopeMinimo(),
                regla.getTopeMaximo(),
                montoCalculado,
                montoAplicado,
                promocionAplicada
        );
    }

    private void validar(ReglaComision regla) {

        if (regla.getPorcentajeSobreTotal() == null
                || regla.getPorcentajeSobreTotal() < 0
                || regla.getPorcentajeSobreTotal() > 1) {
            throw conflicto("REGLA_COMISION_INVALIDA");
        }

        if (regla.getMontoFijo() == null
                || regla.getMontoFijo() < 0) {
            throw conflicto("REGLA_COMISION_INVALIDA");
        }

        if (regla.getTopeMinimo() != null
                && regla.getTopeMinimo() < 0) {
            throw conflicto("REGLA_COMISION_INVALIDA");
        }

        if (regla.getTopeMaximo() != null
                && regla.getTopeMaximo() < 0) {
            throw conflicto("REGLA_COMISION_INVALIDA");
        }

        if (regla.getVigenciaDesde() != null
                && regla.getVigenciaHasta() != null
                && regla.getVigenciaDesde().isAfter(regla.getVigenciaHasta())) {
            throw conflicto("REGLA_COMISION_INVALIDA");
        }
    }

    private RuntimeException conflicto(String mensaje) {
        return new RuntimeException("CONFLICTO - " + mensaje);
    }

    @Data
    @AllArgsConstructor
    public static class ResultadoComision {

        private String reglaAplicada;
        private Double porcentaje;
        private Double montoFijo;
        private Double topeMinimo;
        private Double topeMaximo;
        private Double montoCalculado;
        private Double montoAplicado;
        private String promocionAplicada;
    }
}