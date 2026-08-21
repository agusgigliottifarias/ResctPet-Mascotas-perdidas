package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.AuditoriaSplitPago;
import unpsjb.labprog.backend.repository.AuditoriaSplitPagoRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditoriaSplitPagoService {

    private final AuditoriaSplitPagoRepository auditoriaRepository;
 
    @Transactional
    public void registrar(
            String codigoPago,
            String codigoPedido,
            String motivo,
            String destinoAfectado,
            Double montoOriginal,
            Double montoAjustado,
            String detalle
    ) {

        AuditoriaSplitPago auditoria =
                new AuditoriaSplitPago();

        auditoria.setCodigoPago(codigoPago);
        auditoria.setCodigoPedido(codigoPedido);
        auditoria.setMotivo(motivo);
        auditoria.setDestinoAfectado(destinoAfectado);
        auditoria.setMontoOriginal(montoOriginal);
        auditoria.setMontoAjustado(montoAjustado);

        if (montoOriginal != null
                && montoAjustado != null) {

            auditoria.setDiferencia(
                    montoAjustado - montoOriginal
            );
        }

        auditoria.setDetalle(detalle);

        auditoriaRepository.save(auditoria);
    }
}