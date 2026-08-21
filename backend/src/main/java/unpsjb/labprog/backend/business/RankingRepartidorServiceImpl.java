package unpsjb.labprog.backend.business;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.model.Entrega;
import unpsjb.labprog.backend.model.Repartidor;
import unpsjb.labprog.backend.model.dto.RankingRepartidorResponseDTO;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.MetricaRanking;
import unpsjb.labprog.backend.model.enums.OrdenRanking;
import unpsjb.labprog.backend.model.enums.PeriodoRanking;
import unpsjb.labprog.backend.repository.EntregaRepository;

@Service
@RequiredArgsConstructor
public class RankingRepartidorServiceImpl implements RankingRepartidorService {

    private static final ZoneId ZONA_HORARIA = ZoneId.of("America/Argentina/Catamarca");
    private static final int SIZE_MAXIMO = 50;

    private final EntregaRepository entregaRepository;

    @Override
    public RankingRepartidorResponseDTO obtenerRanking(
            String periodo,
            String metrica,
            String orden,
            String zona,
            Integer page,
            Integer size
    ) {
        PeriodoRanking periodoRanking = parsePeriodo(periodo);
        MetricaRanking metricaRanking = parseMetrica(metrica);
        OrdenRanking ordenRanking = parseOrden(orden);
        validarPaginacion(page, size);

        RangoFechas rango = calcularRango(periodoRanking);

        List<Entrega> entregas = entregaRepository.findEntregadasParaRanking(
                EstadoEntrega.ENTREGADA,
                rango.desde(),
                rango.hasta(),
                zona
        );

        List<RankingRepartidorResponseDTO.Item> items = armarItems(entregas, ordenRanking);
        List<RankingRepartidorResponseDTO.Item> pagina = paginar(items, page, size);

        return new RankingRepartidorResponseDTO(
                periodoRanking.name(),
                metricaRanking.name(),
                ordenRanking.name(),
                zona,
                page,
                size,
                items.size(),
                pagina
        );
    }

    private PeriodoRanking parsePeriodo(String periodo) {
        try {
            return PeriodoRanking.valueOf(periodo);
        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - PERIODO_NO_SOPORTADO"
            );
        }
    }

    private MetricaRanking parseMetrica(String metrica) {
        try {
            return MetricaRanking.valueOf(metrica);
        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - METRICA_NO_SOPORTADA"
            );
        }
    }

    private OrdenRanking parseOrden(String orden) {
        if (orden == null || orden.isBlank()) {
            return OrdenRanking.DESC;
        }

        try {
            return OrdenRanking.valueOf(orden);
        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - ORDEN_NO_SOPORTADO"
            );
        }
    }

    private void validarPaginacion(Integer page, Integer size) {
        if (page == null || size == null || page < 0 || size <= 0 || size > SIZE_MAXIMO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - PAGINACION_INVALIDA"
            );
        }
    }

    private RangoFechas calcularRango(PeriodoRanking periodo) {
        LocalDate hoy = LocalDate.now(ZONA_HORARIA);

        return switch (periodo) {
            case HOY -> rangoDesdeHasta(hoy, hoy.plusDays(1));
            case ULTIMOS_7_DIAS -> rangoDesdeHasta(hoy.minusDays(6), hoy.plusDays(1));
            case ULTIMOS_30_DIAS -> rangoDesdeHasta(hoy.minusDays(29), hoy.plusDays(1));
            case MES_ACTUAL -> {
                YearMonth mesActual = YearMonth.from(hoy);
                yield rangoDesdeHasta(mesActual.atDay(1), mesActual.plusMonths(1).atDay(1));
            }
            case MES_ANTERIOR -> {
                YearMonth mesAnterior = YearMonth.from(hoy).minusMonths(1);
                yield rangoDesdeHasta(mesAnterior.atDay(1), mesAnterior.plusMonths(1).atDay(1));
            }
        };
    }

    private RangoFechas rangoDesdeHasta(LocalDate desde, LocalDate hasta) {
        return new RangoFechas(
                desde.atStartOfDay(ZONA_HORARIA).toInstant(),
                hasta.atStartOfDay(ZONA_HORARIA).toInstant()
        );
    }

    private List<RankingRepartidorResponseDTO.Item> armarItems(
            List<Entrega> entregas,
            OrdenRanking orden
    ) {
        Map<String, AcumuladoRepartidor> acumulados = new LinkedHashMap<>();

        for (Entrega entrega : entregas) {
            Repartidor repartidor = entrega.getRepartidor();

            if (repartidor == null) {
                continue;
            }

            acumulados
                    .computeIfAbsent(
                            repartidor.getCodigo(),
                            codigo -> new AcumuladoRepartidor(repartidor)
                    )
                    .sumarEntrega();
        }

        List<AcumuladoRepartidor> ranking = new ArrayList<>(acumulados.values());
        ranking.sort(comparador(orden));

        List<RankingRepartidorResponseDTO.Item> items = new ArrayList<>();

        for (int i = 0; i < ranking.size(); i++) {
            AcumuladoRepartidor acumulado = ranking.get(i);
            Repartidor repartidor = acumulado.repartidor();

            items.add(
                    new RankingRepartidorResponseDTO.Item(
                            i + 1,
                            repartidor.getCodigo(),
                            repartidor.getNombre(),
                            acumulado.entregasCompletadas(),
                            repartidor.getEstado().name(),
                            repartidor.getTipoVehiculo(),
                            repartidor.getCalificacionPromedio()
                    )
            );
        }

        return items;
    }

    private Comparator<AcumuladoRepartidor> comparador(OrdenRanking orden) {
        Comparator<AcumuladoRepartidor> desempate = Comparator
                .comparing((AcumuladoRepartidor a) -> a.repartidor().getNombre())
                .thenComparing(a -> a.repartidor().getCodigo());

        if (OrdenRanking.ASC.equals(orden)) {
            return Comparator
                    .comparingLong(AcumuladoRepartidor::entregasCompletadas)
                    .thenComparing(desempate);
        }

        return Comparator
                .comparingLong(AcumuladoRepartidor::entregasCompletadas)
                .reversed()
                .thenComparing(desempate);
    }

    private List<RankingRepartidorResponseDTO.Item> paginar(
            List<RankingRepartidorResponseDTO.Item> items,
            Integer page,
            Integer size
    ) {
        int desde = page * size;

        if (desde >= items.size()) {
            return List.of();
        }

        int hasta = Math.min(desde + size, items.size());
        return items.subList(desde, hasta);
    }

    private record RangoFechas(Instant desde, Instant hasta) {
    }

    private static class AcumuladoRepartidor {

        private final Repartidor repartidor;
        private long entregasCompletadas;

        AcumuladoRepartidor(Repartidor repartidor) {
            this.repartidor = repartidor;
        }

        void sumarEntrega() {
            entregasCompletadas++;
        }

        Repartidor repartidor() {
            return repartidor;
        }

        long entregasCompletadas() {
            return entregasCompletadas;
        }
    }
}