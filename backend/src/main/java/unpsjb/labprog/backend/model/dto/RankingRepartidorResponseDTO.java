package unpsjb.labprog.backend.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankingRepartidorResponseDTO {

    private String periodo;
    private String metrica;
    private String orden;
    private String zona;
    private Integer page;
    private Integer size;
    private Integer total;
    private List<Item> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item {

        private Integer posicion;
        private String idRepartidor;
        private String nombre;
        private Long valor;
        private String estado;
        private String tipoVehiculo;
        private Double calificacionPromedio;
    }
}