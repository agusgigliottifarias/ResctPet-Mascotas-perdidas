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
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.dto.RankingRestauranteResponseDTO;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;
import unpsjb.labprog.backend.model.enums.MetricaRanking;
import unpsjb.labprog.backend.model.enums.OrdenRanking;
import unpsjb.labprog.backend.model.enums.PeriodoRanking;
import unpsjb.labprog.backend.repository.EntregaRepository;
import unpsjb.labprog.backend.repository.RestauranteRepository;

@Service
@RequiredArgsConstructor
public class RankingRestauranteServiceImpl implements RankingRestauranteService {

    private static final ZoneId ZONA_HORARIA = ZoneId.of("America/Argentina/Catamarca");
    private static final int SIZE_MAXIMO = 50;

    private final EntregaRepository entregaRepository;
    private final RestauranteRepository restauranteRepository;

    @Override
    public RankingRestauranteResponseDTO obtenerRanking(
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
        validarZona(zona);

        if (!MetricaRanking.PEDIDOS_ENTREGADOS.equals(metricaRanking)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - METRICA_NO_SOPORTADA"
            );
        }

        RangoFechas rango = calcularRango(periodoRanking);

        List<Pedido> pedidos = entregaRepository.findPedidosEntregadosParaRankingRestaurantes(
                EstadoEntrega.ENTREGADA,
                rango.desde(),
                rango.hasta(),
                zona
        );

        List<RankingRestauranteResponseDTO.Item> items = armarItems(pedidos, ordenRanking);
        List<RankingRestauranteResponseDTO.Item> pagina = paginar(items, page, size);

        return new RankingRestauranteResponseDTO(
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

    private void validarZona(String zona) {
        if (zona == null || zona.isBlank()) {
            return;
        }

        if (restauranteRepository.countByCiudadIgnoreCase(zona) == 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - ZONA_INEXISTENTE"
            );
        }
    }

    private RangoFechas calcularRango(PeriodoRanking periodo) {
        LocalDate hoy = LocalDate.now(ZONA_HORARIA);

        return switch (periodo) {
            case HOY ->
                rangoDesdeHasta(hoy, hoy.plusDays(1));
            case ULTIMOS_7_DIAS ->
                rangoDesdeHasta(hoy.minusDays(6), hoy.plusDays(1));
            case ULTIMOS_30_DIAS ->
                rangoDesdeHasta(hoy.minusDays(29), hoy.plusDays(1));
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

    private List<RankingRestauranteResponseDTO.Item> armarItems(
            List<Pedido> pedidos,
            OrdenRanking orden
    ) {
        Map<String, AcumuladoRestaurante> acumulados = new LinkedHashMap<>();

        for (Pedido pedido : pedidos) {
            Restaurante restaurante = pedido.getRestaurante();

            if (restaurante == null) {
                continue;
            }

            acumulados
                    .computeIfAbsent(
                            restaurante.getCodigo(),
                            codigo -> new AcumuladoRestaurante(restaurante)
                    )
                    .sumarPedido();
        }

        List<AcumuladoRestaurante> ranking = new ArrayList<>(acumulados.values());
        ranking.sort(comparador(orden));

        List<RankingRestauranteResponseDTO.Item> items = new ArrayList<>();

        for (int i = 0; i < ranking.size(); i++) {
            AcumuladoRestaurante acumulado = ranking.get(i);
            Restaurante restaurante = acumulado.restaurante();

            items.add(new RankingRestauranteResponseDTO.Item(
                    i + 1,
                    restaurante.getCodigo(),
                    restaurante.getNombre(),
                    acumulado.pedidosEntregados(),
                    restaurante.getAceptaPedidos(),
                    0.0
            ));
        }

        return items;
    }

    private Comparator<AcumuladoRestaurante> comparador(OrdenRanking orden) {
        Comparator<AcumuladoRestaurante> desempate = Comparator
                .comparing((AcumuladoRestaurante a) -> a.restaurante().getNombre())
                .thenComparing(a -> a.restaurante().getCodigo());

        if (OrdenRanking.ASC.equals(orden)) {
            return Comparator
                    .comparingLong(AcumuladoRestaurante::pedidosEntregados)
                    .thenComparing(desempate);
        }

        return Comparator
                .comparingLong(AcumuladoRestaurante::pedidosEntregados)
                .reversed()
                .thenComparing(desempate);
    }

    private List<RankingRestauranteResponseDTO.Item> paginar(
            List<RankingRestauranteResponseDTO.Item> items,
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

    private static class AcumuladoRestaurante {

        private final Restaurante restaurante;
        private long pedidosEntregados;

        AcumuladoRestaurante(Restaurante restaurante) {
            this.restaurante = restaurante;
        }

        void sumarPedido() {
            pedidosEntregados++;
        }

        Restaurante restaurante() {
            return restaurante;
        }

        long pedidosEntregados() {
            return pedidosEntregados;
        }
    }
}