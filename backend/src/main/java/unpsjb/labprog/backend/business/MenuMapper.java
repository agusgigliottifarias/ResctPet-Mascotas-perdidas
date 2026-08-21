package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.model.Adicional;
import unpsjb.labprog.backend.model.ItemMenu;
import unpsjb.labprog.backend.model.Menu;
import unpsjb.labprog.backend.model.Precio;

import unpsjb.labprog.backend.model.dto.AdicionalDTO;
import unpsjb.labprog.backend.model.dto.ItemDTO;
import unpsjb.labprog.backend.model.dto.MenuDTO;
import unpsjb.labprog.backend.model.dto.MenuDetalleDTO;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MenuMapper {

    public MenuDetalleDTO toDetalleDTO(Menu menu) {

        MenuDetalleDTO dto = new MenuDetalleDTO();

        dto.setCodigoRestaurante(menu.getRestaurante().getCodigo());
        dto.setNombreRestaurante(menu.getRestaurante().getNombre());
        dto.setMetodosPago(menu.getRestaurante().getMetodosPago());

        MenuDTO menuDto = toDTO(menu);
        menuDto.setItems(toItemsDisponiblesDTO(menu));

        dto.setMenu(menuDto);

        return dto;
    }

    public MenuDTO toDTO(Menu menu) {

        MenuDTO dto = new MenuDTO();

        dto.setCodigo(menu.getCodigo());
        dto.setNombre(menu.getNombre());
        dto.setActivo(menu.getActivo());

        return dto;
    }

    private List<ItemDTO> toItemsDisponiblesDTO(Menu menu) {
        return menu.getItems()
                .stream()
                .filter(item -> item.getDisponible() != null && item.getDisponible())
                .map(this::toItemDTO)
                .collect(Collectors.toList());
    }

    private ItemDTO toItemDTO(ItemMenu item) {

        Precio precioBase = item.getPrecio();

        List<AdicionalDTO> adicionales = item.getAdicionales()
                .stream()
                .map(adicional -> toAdicionalDTO(adicional, precioBase))
                .collect(Collectors.toList());

        return new ItemDTO(
                item.getCodigo(),
                item.getNombre(),
                precioBase,
                item.getDisponible(),
                adicionales
        );
    }

    private AdicionalDTO toAdicionalDTO(Adicional adicional, Precio precioBase) {

        String moneda = precioBase != null ? precioBase.getMoneda() : "ARS";

        return new AdicionalDTO(
                adicional.getCodigo(),
                adicional.getNombre(),
                new Precio(adicional.getPrecio(), moneda)
        );
    }
}