package unpsjb.labprog.backend.business;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.model.Pago;
import unpsjb.labprog.backend.model.SplitPago;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.dto.DistribucionPagosResponseDTO;
import unpsjb.labprog.backend.repository.PagoRepository;
import unpsjb.labprog.backend.repository.PedidoRepository;


@Service
@RequiredArgsConstructor
public class MetricasPagoServiceImpl implements MetricasPagoService {

    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;

    @Override
    public DistribucionPagosResponseDTO obtenerDistribucionPagos(
            Instant desde,
            Instant hasta,
            String moneda,
            Integer bucketSize,
            String idRestaurante,
            String zona,
            String idConsumidor,
            String destinoSplit,
            Boolean incluirSplits,
            Boolean incluirNoCapturados,
            Double outlierThreshold,
            Integer outliersPage,
            Integer outliersSize
    ) {
        validarFiltros(desde, hasta, moneda, bucketSize);

        List<Pago> pagos = pagoRepository.findPagosParaDistribucion(
                desde,
                hasta,
                moneda,
                incluirNoCapturados,
                idRestaurante,
                zona,
                idConsumidor
        );

        if ("ALL".equals(moneda)) {
            return armarRespuestaPorMoneda(pagos);
        }

        DistribucionPagosResponseDTO respuesta = new DistribucionPagosResponseDTO();

        respuesta.setMoneda(moneda);
        respuesta.setFiltros(new DistribucionPagosResponseDTO.Filtros(idRestaurante, zona));

        if (pagos.isEmpty()) {
            cargarMetricasEnCero(respuesta);
            return respuesta;
        }

        List<Double> montos = obtenerMontosOrdenados(pagos);

        respuesta.setCantidadPagos(pagos.size());
        respuesta.setMin(montos.get(0));
        respuesta.setMax(montos.get(montos.size() - 1));
        respuesta.setPromedio(calcularPromedio(montos));
        respuesta.setMediana(calcularPercentil(montos, 50));
        respuesta.setP75(calcularPercentil(montos, 75));
        respuesta.setP90(calcularPercentil(montos, 90));
        respuesta.setP95(calcularPercentil(montos, 95));
        respuesta.setP99(calcularPercentil(montos, 99));

        respuesta.setBuckets(calcularBuckets(montos, bucketSize));

        if (Boolean.TRUE.equals(incluirSplits)) {
            List<SplitPago> splits = obtenerSplits(pagos, destinoSplit);
            respuesta.setSplits(calcularDistribucionSplits(splits, pagos.size()));
        }

        List<DistribucionPagosResponseDTO.OutlierPago> outliers = calcularOutliers(
                pagos,
                outlierThreshold,
                respuesta.getP99()
        );

        respuesta.setOutliers(
                paginarOutliers(
                        outliers,
                        outliersPage,
                        outliersSize
                )
        );

        respuesta.setOutliersPage(
                new DistribucionPagosResponseDTO.OutliersPage(
                        outliersPage,
                        outliersSize,
                        outliers.size()
                )
        );

        return respuesta;
    }

    private void validarFiltros(
            Instant desde,
            Instant hasta,
            String moneda,
            Integer bucketSize
    ) {
        if (desde.isAfter(hasta)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - RANGO_FECHAS_INVALIDO"
            );
        }

        if (bucketSize != null && bucketSize <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - FILTRO_INVALIDO"
            );
        }

        if (moneda == null || moneda.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - FILTRO_INVALIDO"
            );
        }

        if (!moneda.equals("ARS")
                && !moneda.equals("USD")
                && !moneda.equals("ALL")) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CONFLICTO - FILTRO_INVALIDO"
            );
        }
    }

    private void cargarMetricasEnCero(
            DistribucionPagosResponseDTO respuesta
    ) {
        respuesta.setCantidadPagos(0);
        respuesta.setMin(0);
        respuesta.setMax(0);
        respuesta.setPromedio(0);
        respuesta.setMediana(0);
        respuesta.setP75(0);
        respuesta.setP90(0);
        respuesta.setP95(0);
        respuesta.setP99(0);
    }

    private DistribucionPagosResponseDTO armarRespuestaPorMoneda(
            List<Pago> pagos
    ) {
        DistribucionPagosResponseDTO respuesta = new DistribucionPagosResponseDTO();
        respuesta.setMoneda("ALL");

        Map<String, Integer> cantidadesPorMoneda = new HashMap<>();

        for (Pago pago : pagos) {
            String monedaPago = pago.getMonto().getMoneda();

            if (!cantidadesPorMoneda.containsKey(monedaPago)) {
                cantidadesPorMoneda.put(monedaPago, 0);
            }

            cantidadesPorMoneda.put(
                    monedaPago,
                    cantidadesPorMoneda.get(monedaPago) + 1
            );
        }

        List<DistribucionPagosResponseDTO> porMoneda = new ArrayList<>();

        for (String monedaPago : cantidadesPorMoneda.keySet()) {
            DistribucionPagosResponseDTO dto = new DistribucionPagosResponseDTO();
            dto.setMoneda(monedaPago);
            dto.setCantidadPagos(cantidadesPorMoneda.get(monedaPago));
            porMoneda.add(dto);
        }

        respuesta.setPorMoneda(porMoneda);

        return respuesta;
    }

    private List<Double> obtenerMontosOrdenados(
            List<Pago> pagos
    ) {
        List<Double> montos = new ArrayList<>();

        for (Pago pago : pagos) {
            montos.add(pago.getMonto().getMonto());
        }

        Collections.sort(montos);

        return montos;
    }

    private double calcularPromedio(
            List<Double> montos
    ) {
        double total = 0;

        for (Double monto : montos) {
            total += monto;
        }

        if (montos.isEmpty()) {
            return 0;
        }

        return total / montos.size();
    }

    private double calcularPercentil(
            List<Double> montos,
            int percentil
    ) {
        if (montos.isEmpty()) {
            return 0;
        }

        int indice = (int) Math.ceil((percentil / 100.0) * montos.size()) - 1;

        if (indice < 0) {
            indice = 0;
        }

        if (indice >= montos.size()) {
            indice = montos.size() - 1;
        }

        return montos.get(indice);
    }

    private List<DistribucionPagosResponseDTO.Bucket> calcularBuckets(
            List<Double> montos,
            Integer bucketSize
    ) {
        List<DistribucionPagosResponseDTO.Bucket> buckets = new ArrayList<>();

        if (montos.isEmpty()) {
            return buckets;
        }

        int tamanioBucket = bucketSize != null ? bucketSize : 5000;
        double max = montos.get(montos.size() - 1);

        for (double desde = 0; desde <= max; desde += tamanioBucket) {
            double hasta = desde + tamanioBucket;

            double montoTotal = 0;
            int cantidad = 0;

            for (Double monto : montos) {
                if (monto >= desde && monto < hasta) {
                    cantidad++;
                    montoTotal += monto;
                }
            }

            if (cantidad > 0) {
                buckets.add(
                        new DistribucionPagosResponseDTO.Bucket(
                                desde,
                                hasta,
                                cantidad,
                                montoTotal
                        )
                );
            }
        }

        return buckets;
    }

    private List<SplitPago> obtenerSplits(
            List<Pago> pagos,
            String destinoSplit
    ) {
        List<SplitPago> splits = new ArrayList<>();

        for (Pago pago : pagos) {
            for (SplitPago split : pago.getSplits()) {

                if (destinoSplit == null
                        || destinoSplit.isBlank()
                        || split.getDestino().equals(destinoSplit)) {

                    splits.add(split);
                }
            }
        }

        return splits;
    }

    private List<DistribucionPagosResponseDTO.SplitDistribucion> calcularDistribucionSplits(
            List<SplitPago> splits,
            int cantidadPagos
    ) {
        List<DistribucionPagosResponseDTO.SplitDistribucion> resultado = new ArrayList<>();

        if (splits.isEmpty()) {
            return resultado;
        }

        Map<String, Double> totalesPorDestino = new HashMap<>();
        double totalGeneral = 0;

        for (SplitPago split : splits) {
            String destino = split.getDestino();
            double monto = split.getMonto().getMonto();

            totalGeneral += monto;

            if (!totalesPorDestino.containsKey(destino)) {
                totalesPorDestino.put(destino, 0.0);
            }

            totalesPorDestino.put(
                    destino,
                    totalesPorDestino.get(destino) + monto
            );
        }

        for (String destino : totalesPorDestino.keySet()) {
            double totalDestino = totalesPorDestino.get(destino);

            double porcentaje = 0;
            if (totalGeneral != 0) {
                porcentaje = totalDestino / totalGeneral;
            }

            double promedio = 0;
            if (cantidadPagos != 0) {
                promedio = totalDestino / cantidadPagos;
            }

            resultado.add(
                    new DistribucionPagosResponseDTO.SplitDistribucion(
                            destino,
                            totalDestino,
                            porcentaje,
                            promedio
                    )
            );
        }

        return resultado;
    }

    private List<DistribucionPagosResponseDTO.OutlierPago> calcularOutliers(
        List<Pago> pagos,
        Double outlierThreshold,
        double p99
) {
    List<DistribucionPagosResponseDTO.OutlierPago> outliers = new ArrayList<>();

    double limite = p99;

    if (outlierThreshold != null) {
        limite = outlierThreshold;
    }

    for (Pago pago : pagos) {
        if (pago.getMonto().getMonto() > limite) {

            Pedido pedido = pedidoRepository.findById(
                    pago.getIdPedido()
            ).orElse(null);

            String codigoPedido = pago.getIdPedido().toString();
            String codigoRestaurante = null;

            if (pedido != null) {
                codigoPedido = pedido.getCodigo();

                if (pedido.getRestaurante() != null) {
                    codigoRestaurante = pedido.getRestaurante().getCodigo();
                }
            }

            outliers.add(
                    new DistribucionPagosResponseDTO.OutlierPago(
                            pago.getCodigo(),
                            codigoPedido,
                            pago.getMonto().getMonto(),
                            codigoRestaurante,
                            pago.getFechaAutorizacion()
                    )
            );
        }
    }

    return outliers;
}

    private List<DistribucionPagosResponseDTO.OutlierPago> paginarOutliers(
            List<DistribucionPagosResponseDTO.OutlierPago> outliers,
            Integer page,
            Integer size
    ) {
        List<DistribucionPagosResponseDTO.OutlierPago> pagina = new ArrayList<>();

        int inicio = page * size;

        if (inicio >= outliers.size()) {
            return pagina;
        }

        int fin = Math.min(
                inicio + size,
                outliers.size()
        );

        for (int i = inicio; i < fin; i++) {
            pagina.add(outliers.get(i));
        }

        return pagina;
    }
}