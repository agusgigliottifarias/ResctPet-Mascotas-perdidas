package unpsjb.labprog.backend.model.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class DistribucionPagosResponseDTO {

    private String moneda;

    private int cantidadPagos;

    private double min;
    private double max;
    private double promedio;
    private double mediana;

    private double p75;
    private double p90;
    private double p95;
    private double p99;

    private List<Bucket> buckets = new ArrayList<>();
    private List<SplitDistribucion> splits = new ArrayList<>();
    private List<OutlierPago> outliers = new ArrayList<>();
    private OutliersPage outliersPage;
    private List<DistribucionPagosResponseDTO> porMoneda = new ArrayList<>();
    private Filtros filtros;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Bucket {

        private double desde;
        private double hasta;
        private int cantidad;
        private double montoTotal;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SplitDistribucion {

        private String destino;
        private double montoTotalDestino;
        private double porcentajeSobreTotal;
        private double promedioPorPago;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OutlierPago {

        private String idPago;
        private String idPedido;
        private double monto;
        private String idRestaurante;
        private Instant timestamp;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OutliersPage {

        private int number;
        private int size;
        private int totalElements;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Filtros {

        private String idRestaurante;
        private String zona;
    }
}