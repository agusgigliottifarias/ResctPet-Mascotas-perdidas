package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Menu;
import unpsjb.labprog.backend.model.dto.MenuDTO;
import unpsjb.labprog.backend.model.dto.MenuDetalleDTO;
import unpsjb.labprog.backend.repository.MenuRepository;
import unpsjb.labprog.backend.repository.RestauranteRepository;

@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Autowired
    private MenuMapper menuMapper;

    @Override
    public MenuDetalleDTO getMenuPrincipal(String codigoRestaurante) {

        validarRestaurante(codigoRestaurante);

        Menu menu = menuRepository
                .findPrincipalByCodigoRestaurante(codigoRestaurante)
                .orElseThrow(() -> new RuntimeException("MENU_NO_ENCONTRADO"));

        return menuMapper.toDetalleDTO(menu);
    }

    @Override
    public Page<MenuDTO> listarMenus(
            String codigoRestaurante,
            Boolean activo,
            int page,
            int size
    ) {

        validarRestaurante(codigoRestaurante);

        PageRequest pageable = PageRequest.of(page, size);

        Page<Menu> menus;

        if (activo != null) {
            menus = menuRepository.findByCodigoRestauranteAndActivo(
                    codigoRestaurante,
                    activo,
                    pageable
            );
        } else {
            menus = menuRepository.findByCodigoRestaurante(
                    codigoRestaurante,
                    pageable
            );
        }

        return menus.map(menuMapper::toDTO);
    }

    @Override
    public MenuDetalleDTO getMenuEspecifico(
            String codigoRestaurante,
            String codigoMenu
    ) {

        validarRestaurante(codigoRestaurante);

        Menu menu = menuRepository
                .findByCodigoMenuAndCodigoRestaurante(
                        codigoMenu,
                        codigoRestaurante
                )
                .orElseThrow(() -> new RuntimeException("MENU_NO_ENCONTRADO"));

        return menuMapper.toDetalleDTO(menu);
    }

    private void validarRestaurante(String codigoRestaurante) {

        if (!restauranteRepository.existsByCodigo(codigoRestaurante)) {
            throw new RuntimeException("RESTAURANTE_NO_ENCONTRADO");
        }
    }
}
