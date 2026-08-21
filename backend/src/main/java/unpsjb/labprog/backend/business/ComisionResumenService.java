package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Pago;
import unpsjb.labprog.backend.model.SplitPago;
import unpsjb.labprog.backend.model.dto.ComisionResumenDTO;
import unpsjb.labprog.backend.repository.PagoRepository;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComisionResumenService {

    private final PagoRepository pagoRepository;

    public ComisionResumenDTO obtenerResumen(
            Instant desde,
            Instant hasta,
            String moneda,
            String idRestaurante
    ) {

        List<Pago> pagos =
                pagoRepository
                        .findPagosCapturadosParaResumenComisiones(
                                desde,
                                hasta,
                                moneda,
                                idRestaurante
                        );

        double totalComisiones = pagos.stream()
                .flatMap(p -> p.getSplits().stream())
                .filter(s -> "PLATAFORMA".equals(
                        s.getDestino()
                ))
                .mapToDouble(s -> s.getMonto().getMonto())
                .sum();

        int cantidadPagos = pagos.size();

        double promedioComision =
                cantidadPagos == 0
                        ? 0
                        : totalComisiones / cantidadPagos;

        return new ComisionResumenDTO(
                moneda,
                idRestaurante,
                totalComisiones,
                cantidadPagos,
                promedioComision
        );
    }
}