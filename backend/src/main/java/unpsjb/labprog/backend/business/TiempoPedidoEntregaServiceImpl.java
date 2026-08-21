package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.dto.TiempoPedidoEntregaMetricasDTO;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.repository.EntregaRepository;
import unpsjb.labprog.backend.repository.PedidoRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TiempoPedidoEntregaServiceImpl implements TiempoPedidoEntregaService {

    private final EntregaRepository entregaRepository;
    private final PedidoRepository pedidoRepository;

    @Override
    public TiempoPedidoEntregaMetricasDTO calcular(
            Instant desde,
            Instant hasta
    ) {

        if (desde.isAfter(hasta)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - RANGO_FECHAS_INVALIDO"
            );
        }

        List<Entrega> entregas = entregaRepository.findEntregadasParaMetricas(
                EstadoEntrega.ENTREGADA,
                desde,
                hasta
        );

        List<Long> duraciones = new ArrayList<>();

        for (Entrega entrega : entregas) {

            Pedido pedido = pedidoRepository
                    .findById(entrega.getIdPedido())
                    .orElse(null);

            if (
                    pedido != null
                    && pedido.getFechaCreacion() != null
                    && entrega.getFechaHoraEntregaReal() != null
            ) {

                long segundos = Duration.between(
                        pedido.getFechaCreacion(),
                        entrega.getFechaHoraEntregaReal()
                ).getSeconds();

                if (segundos >= 0) {
                    duraciones.add(segundos);
                }
            }
        }

        if (duraciones.isEmpty()) {
            return new TiempoPedidoEntregaMetricasDTO(
                    0,
                    0,
                    0,
                    0
            );
        }

        long total = 0;

        for (Long duracion : duraciones) {
            total += duracion;
        }

        long promedio = total / duraciones.size();
        long minimo = Collections.min(duraciones);
        long maximo = Collections.max(duraciones);

        return new TiempoPedidoEntregaMetricasDTO(
                duraciones.size(),
                promedio,
                minimo,
                maximo
        );
    }
}