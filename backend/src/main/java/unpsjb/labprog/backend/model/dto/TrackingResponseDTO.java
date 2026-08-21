package unpsjb.labprog.backend.model.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class TrackingResponseDTO {

    private String idPedido;
    private String idEntrega;
    private String estadoEntrega;
    private Instant eta;
    private Long tiempoRemanenteSegundos;
    private Instant ultimaActualizacion;
    private CoordenadaDTO origen;
    private CoordenadaDTO destino;
    private Double distanciaMetros;
    private Long duracionEstimadaSegundos;
    private List<CoordenadaDTO> ruta = new ArrayList<>();
    private Object entrega;
    private String mensaje;
    private String motivo;
}
