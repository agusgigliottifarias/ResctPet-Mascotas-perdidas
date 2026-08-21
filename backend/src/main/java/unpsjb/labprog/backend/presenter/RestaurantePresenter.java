package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.RestauranteService;
import unpsjb.labprog.backend.model.dto.RestauranteDTO;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/restaurantes")
public class RestaurantePresenter {

    private final RestauranteService restauranteService;

    @Autowired
    public RestaurantePresenter(
            RestauranteService restauranteService
    ) {
        this.restauranteService = restauranteService;
    }

    @GetMapping
    public Object search(
            @RequestParam(value = "nombreContiene", required = false) String nombre,
            @RequestParam(required = false) String tipoCocina,
            @RequestParam(required = false) String ciudad,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(value = "radioKm", required = false) Double radioKm,
            Pageable pageable
    ) {

        Page<RestauranteDTO> page = restauranteService.search(
                nombre,
                tipoCocina,
                ciudad,
                lat,
                lon,
                radioKm,
                pageable
        );

        Map<String, Object> data = new HashMap<>();

        data.put(
                "restaurants",
                page.getContent()
        );

        data.put(
                "page",
                Map.of(
                        "number", page.getNumber(),
                        "size", page.getSize(),
                        "totalElements", page.getTotalElements()
                )
        );

        return Response.ok(
                data,
                "OK"
        );
    }

    @GetMapping("/{codigo}")
    public Object getByCodigo(@PathVariable("codigo") String codigo) {
        RestauranteDTO dto = restauranteService.findByCodigo(codigo);

        return Response.ok(
                dto,
                "OK"
        );
    }
}
