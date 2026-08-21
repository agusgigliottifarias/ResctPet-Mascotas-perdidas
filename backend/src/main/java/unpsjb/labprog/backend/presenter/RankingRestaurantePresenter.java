package unpsjb.labprog.backend.presenter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.RankingRestauranteService;
import unpsjb.labprog.backend.model.dto.RankingRestauranteResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ranking/restaurantes")
@CrossOrigin(origins = "*")
public class RankingRestaurantePresenter {

    private final RankingRestauranteService rankingRestauranteService;

    @GetMapping
    public ResponseEntity<Object> obtenerRanking(
            @RequestParam String periodo,
            @RequestParam(defaultValue = "PEDIDOS_ENTREGADOS") String metrica,
            @RequestParam(defaultValue = "DESC") String orden,
            @RequestParam(required = false) String zona,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size
    ) {

        RankingRestauranteResponseDTO respuesta =
                rankingRestauranteService.obtenerRanking(
                        periodo,
                        metrica,
                        orden,
                        zona,
                        page,
                        size
                );

        return Response.ok(respuesta, "OK");
    }
}