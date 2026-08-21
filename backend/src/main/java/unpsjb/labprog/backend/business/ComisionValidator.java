package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;
import unpsjb.labprog.backend.model.ReglaComision;

@Component
public class ComisionValidator {

    public void validar(ReglaComision regla) {

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
                && regla.getVigenciaDesde().isAfter(
                        regla.getVigenciaHasta())) {

            throw conflicto("REGLA_COMISION_INVALIDA");
        }
    }

    private RuntimeException conflicto(
            String mensaje
    ) {

        return new RuntimeException(
                "CONFLICTO - " + mensaje
        );
    }
}