package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.MenuService;
import unpsjb.labprog.backend.model.dto.MenuDTO;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/restaurantes")
@CrossOrigin(origins = "*")
public class MenuPresenter {

    @Autowired
    private MenuService menuService;

    @GetMapping("/{codigoRestaurante}/menus/principal")
    public ResponseEntity<Object> getPrincipal(
            @PathVariable String codigoRestaurante
    ) {

        return Response.ok(
                menuService.getMenuPrincipal(codigoRestaurante),
                "OK"
        );
    }

    @GetMapping("/{codigoRestaurante}/menus/{codigoMenu}")
    public ResponseEntity<Object> getEspecifico(
            @PathVariable String codigoRestaurante,
            @PathVariable String codigoMenu
    ) {

        return Response.ok(
                menuService.getMenuEspecifico(
                        codigoRestaurante,
                        codigoMenu
                ),
                "OK"
        );
    }

    @GetMapping("/{codigoRestaurante}/menus")
    public ResponseEntity<Object> listar(
            @PathVariable String codigoRestaurante,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Page<MenuDTO> pagedData =
                menuService.listarMenus(
                        codigoRestaurante,
                        activo,
                        page,
                        size
                );

        Map<String, Object> pageInfo = new HashMap<>();

        pageInfo.put("number", pagedData.getNumber());
        pageInfo.put("size", pagedData.getSize());
        pageInfo.put("totalElements", pagedData.getTotalElements());

        Map<String, Object> data = new HashMap<>();

        data.put("page", pageInfo);
        data.put("menus", pagedData.getContent());

        return Response.ok(data, "OK");
    }
}