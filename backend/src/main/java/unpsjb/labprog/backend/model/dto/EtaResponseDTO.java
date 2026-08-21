package unpsjb.labprog.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
public class EtaResponseDTO {

    private String idEntrega;
    private String idPedido;
    private String metodoCalculo;
    private Double distanciaMetros;
    private Long duracionEstimadaSegundos;
    private Instant timestampCalculo;
    private Instant eta;
    private Instant ultimaActualizacion;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Resultado {

        private String statusText;
        private EtaResponseDTO data;
    }
}