package unpsjb.labprog.backend.business;

import org.springframework.data.domain.Page;

import unpsjb.labprog.backend.model.dto.MenuDTO;
import unpsjb.labprog.backend.model.dto.MenuDetalleDTO;

public interface MenuService {

    MenuDetalleDTO getMenuPrincipal(String codigoRestaurante);

    Page<MenuDTO> listarMenus(
            String codigoRestaurante,
            Boolean activo,
            int page,
            int size
    );

    MenuDetalleDTO getMenuEspecifico(
            String codigoRestaurante,
            String codigoMenu
    );
}