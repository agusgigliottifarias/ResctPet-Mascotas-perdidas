package unpsjb.labprog.backend.business;

import java.util.List;

import unpsjb.labprog.backend.model.dto.PedidoRequestDTO;
import unpsjb.labprog.backend.model.dto.PedidoResponseDTO;

public interface PedidoService {

    PedidoResponseDTO crearPedido(
            PedidoRequestDTO request
    );

    PedidoResponseDTO getPedido(
            String codigoPedido,
            String emailConsumidor
    );

    PedidoResponseDTO cancelarPedido(
            String codigoPedido,
            String emailConsumidor,
            String motivoCancelacion,
            boolean forzarErrorReembolso
    );

    PedidoResponseDTO pagarPedido(
            String codigoPedido,
            String emailConsumidor
    );

    List<PedidoResponseDTO> listarPedidosParaRepartir();

    PedidoResponseDTO asignarRepartidor(
            String codigoPedido,
            String codigoRepartidor
    );

    PedidoResponseDTO aceptarEntrega(
            String codigoPedido,
            String codigoRepartidor
    );

    PedidoResponseDTO rechazarEntrega(
            String codigoPedido,
            String codigoRepartidor
    );

    PedidoResponseDTO tomarPedido(
            String codigoPedido,
            String codigoRepartidor
    );

    PedidoResponseDTO retirarPedido(
            String codigoPedido,
            String codigoRepartidor
    );

    PedidoResponseDTO entregarPedido(
            String codigoPedido,
            String codigoRepartidor
    );

    PedidoResponseDTO confirmarRecepcion(
            String codigoPedido,
            String emailConsumidor
    );

    PedidoResponseDTO calificarRepartidor(
            String codigoPedido,
            String emailConsumidor,
            Integer calificacion
    );

    List<PedidoResponseDTO> listarPedidosDeRepartidor(
            String codigoRepartidor
    );

    PedidoResponseDTO aceptarPedidoRestaurante(
            String codigoPedido,
            String codigoRestaurante,
            String listoPara
    );

    List<PedidoResponseDTO> listarPedidosPendientes();

    PedidoResponseDTO iniciarPreparacion(
            String codigoPedido
    );

    PedidoResponseDTO marcarPedidoListo(
            String codigoPedido
    );

    List<PedidoResponseDTO> listarPedidosAdmin();
}
