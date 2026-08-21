package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.Pedido;
import unpsjb.labprog.backend.model.Restaurante;
import unpsjb.labprog.backend.model.dto.PagoRequestDTO;
import unpsjb.labprog.backend.model.enums.EstadoPago;
import unpsjb.labprog.backend.model.enums.EstadoPedido;
import unpsjb.labprog.backend.repository.PagoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoValidatorService {

    private final PagoRepository pagoRepository;

    public void validarCamposObligatorios(PagoRequestDTO request) {

        if (request.getCodigoPedido() == null || request.getCodigoPedido().isBlank()
                || request.getEmailConsumidor() == null || request.getEmailConsumidor().isBlank()
                || request.getMonto() == null || request.getMonto().getMonto() == null
                || request.getMonto().getMoneda() == null
                || request.getMetodo() == null || request.getMetodo().isBlank()
                || request.getAccion() == null) {
            throw conflicto("CAMPOS_REQUERIDOS");
        }
    }

    public void validarPropiedadPedido(Pedido pedido, String emailConsumidor) {
        if (!pedido.getEmailConsumidor().equals(emailConsumidor)) {
            throw conflicto("PEDIDO_NO_PERTENECE_AL_CONSUMIDOR");
        }
    }

    public void validarRestaurante(Pedido pedido) {

        Restaurante restaurante = pedido.getRestaurante();

        if (restaurante == null) {
            throw conflicto("RESTAURANTE_NO_ENCONTRADO");
        }

        if (!Boolean.TRUE.equals(restaurante.getAceptaPedidos())) {
            throw conflicto("RESTAURANTE_NO_ACEPTA_PEDIDOS");
        }
    }

    public void validarPedidoPagable(Pedido pedido) {

        if (pedido.getEstado() != EstadoPedido.CREACION_PENDIENTE
                && !(pedido.getEstado() == EstadoPedido.RECHAZADO
                && "PAGO_FALLIDO".equals(pedido.getMotivoRechazo()))) {
            throw conflicto("NO_REINTENTABLE");
        }
    }

    public void validarPagoDuplicado(Pedido pedido) {

        if (pagoRepository.existsByIdPedidoAndEstadoIn(
                pedido.getIdPedido(),
                List.of(EstadoPago.CAPTURADO, EstadoPago.AUTORIZADO))) {
            throw conflicto("PAGO_DUPLICADO_POR_PEDIDO");
        }
    }

    public void validarMonto(Pedido pedido, PagoRequestDTO request) {

        if (request.getMonto().getMonto() <= 0) {
            throw conflicto("MONTO_INVALIDO");
        }

        if (!pedido.getTotal().getMoneda().equals(request.getMonto().getMoneda())) {
            throw conflicto("MONEDA_NO_COINCIDE");
        }

        if (Math.abs(
                pedido.getTotal().getMonto() - request.getMonto().getMonto()
        ) > 0.01) {
            throw conflicto("MONTO_NO_COINCIDE_CON_TOTAL");
        }
    }

    public void validarMetodoPago(PagoRequestDTO request) {

        List<String> metodosSoportados = List.of(
                "EFECTIVO", "MERCADOPAGO", "TARJETA", "TARJETA_VISA",
                "TARJETA_MASTER", "VISA_DEBITO", "MASTERCARD_DEBITO",
                "MAESTRO", "WALLET_CPL", "TRANSFERENCIA"
        );

        if (!metodosSoportados.contains(request.getMetodo())) {
            throw conflicto("METODO_PAGO_NO_SOPORTADO");
        }
    }

    private RuntimeException conflicto(String mensaje) {
        return new RuntimeException(
                "CONFLICTO - " + mensaje
        );
    }
}