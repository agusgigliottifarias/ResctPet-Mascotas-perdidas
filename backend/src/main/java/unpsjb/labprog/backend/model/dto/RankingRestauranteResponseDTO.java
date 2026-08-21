package unpsjb.labprog.backend.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankingRestauranteResponseDTO {

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
        private String idRestaurante;
        private String nombre;
        private Long valor;
        private Boolean aceptaPedidos;
        private Double calificacionPromedio;
    }
}