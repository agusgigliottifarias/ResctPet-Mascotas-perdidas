package unpsjb.labprog.backend.presenter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.RankingRepartidorService;
import unpsjb.labprog.backend.model.dto.RankingRepartidorResponseDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ranking/repartidores")
@CrossOrigin(origins = "*")
public class RankingRepartidorPresenter {

    private final RankingRepartidorService rankingRepartidorService;

    @GetMapping
    public ResponseEntity<Object> obtenerRanking(
            @RequestParam String periodo,
            @RequestParam(defaultValue = "ENTREGAS_COMPLETADAS") String metrica,
            @RequestParam(defaultValue = "DESC") String orden,
            @RequestParam(required = false) String zona,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size
    ) {
        RankingRepartidorResponseDTO respuesta = rankingRepartidorService.obtenerRanking(
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
