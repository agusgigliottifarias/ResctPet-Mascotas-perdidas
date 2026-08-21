package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import unpsjb.labprog.backend.model.*;
import unpsjb.labprog.backend.model.dto.*;
import unpsjb.labprog.backend.model.enums.*;
import unpsjb.labprog.backend.repository.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final PagoRepository pagoRepository;
    private final PedidoResponseMapper pedidoResponseMapper;
    private final PedidoCancelacionValidator pedidoCancelacionValidator;
    private final PedidoValidator pedidoValidator;
    private final PedidoFinder pedidoFinder;
    private final HistorialPedidoService historialPedidoService;
    private final PedidoCancelacionService pedidoCancelacionService;
    private final PedidoCreacionService pedidoCreacionService;
    private final PedidoRepartidorWorkflowService pedidoRepartidorWorkflowService;
    private final PedidoCocinaWorkflowService pedidoCocinaWorkflowService;

    @Override
    @Transactional
    public PedidoResponseDTO crearPedido(PedidoRequestDTO request) {

        Pedido pedido = pedidoCreacionService.crearPedido(request);

        return mapToResponseDTO(
                pedido,
                null,
                null
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoResponseDTO getPedido(
            String codigoPedido,
            String emailConsumidor
    ) {

        Pedido pedido
                = pedidoFinder.buscarPedidoDelConsumidor(codigoPedido, emailConsumidor);

        Ticket ticket
                = pedidoFinder.buscarTicketOpcional(pedido.getIdPedido());

        Entrega entrega
                = pedidoFinder.buscarEntregaOpcional(pedido.getIdPedido());

        pedidoValidator.validarConsistencia(ticket, entrega);

        return mapToResponseDTO(pedido, ticket, entrega);
    }

    @Override
    @Transactional
    public PedidoResponseDTO cancelarPedido(
            String codigoPedido,
            String emailConsumidor,
            String motivoCancelacion,
            boolean forzarErrorReembolso
    ) {

        Pedido pedido
                = pedidoFinder.buscarPedidoExistente(codigoPedido);

        pedidoValidator.validarPedidoPerteneceAlConsumidor(
                pedido,
                emailConsumidor
        );

        Ticket ticket
                = pedidoFinder.buscarTicketOpcional(pedido.getIdPedido());

        Entrega entrega
                = pedidoFinder.buscarEntregaOpcional(pedido.getIdPedido());

        Pago pago
                = pedidoFinder.buscarPagoOpcional(pedido.getIdPedido());

        pedidoCancelacionValidator.validarPedidoCancelable(pedido);
        pedidoCancelacionValidator.validarTicketCancelable(ticket);
        pedidoCancelacionValidator.validarEntregaCancelable(entrega);
        pedidoCancelacionService.cancelar(
                pedido,
                ticket,
                entrega,
                pago,
                motivoCancelacion,
                forzarErrorReembolso
        );

        historialPedidoService.actualizarHistorialPedido(pedido);

        return mapToResponseDTO(
                pedido,
                ticket,
                entrega
        );
    }

    @Override
    @Transactional
    public PedidoResponseDTO pagarPedido(
            String codigoPedido,
            String emailConsumidor
    ) {

        Pedido pedido
                = pedidoFinder.buscarPedidoDelConsumidor(codigoPedido, emailConsumidor);

        pedidoValidator.validarPedidoParaPago(pedido);
        pedidoValidator.validarPagoDuplicado(pedido.getIdPedido());

        pedido.setEstado(EstadoPedido.PAGO_CONFIRMADO);
        pedidoRepository.save(pedido);

        Pago pago = new Pago();

        pago.setIdPago(UUID.randomUUID());
        pago.setIdPedido(pedido.getIdPedido());
        pago.setEmailConsumidor(emailConsumidor);
        pago.setEstado(EstadoPago.CAPTURADO);
        pago.setMetodo("EFECTIVO");
        pago.setMonto(pedido.getTotal());

        pagoRepository.save(pago);

        historialPedidoService.actualizarHistorialPedido(pedido);

        return mapToResponseDTO(
                pedido,
                pedidoFinder.buscarTicketOpcional(pedido.getIdPedido()),
                pedidoFinder.buscarEntregaOpcional(pedido.getIdPedido())
        );
    }

    @Override
    @Transactional
    public PedidoResponseDTO aceptarPedidoRestaurante(
            String codigoPedido,
            String codigoRestaurante,
            String listoPara
    ) {
        return pedidoCocinaWorkflowService.aceptarPedidoRestaurante(
                codigoPedido,
                codigoRestaurante,
                listoPara
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPedidosPendientes() {
        return pedidoCocinaWorkflowService.listarPedidosPendientes();
    }

    @Override
    @Transactional
    public PedidoResponseDTO iniciarPreparacion(String codigoPedido) {
        return pedidoCocinaWorkflowService.iniciarPreparacion(codigoPedido);
    }

    @Override
    @Transactional
    public PedidoResponseDTO marcarPedidoListo(String codigoPedido) {
        return pedidoCocinaWorkflowService.marcarPedidoListo(codigoPedido);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPedidosParaRepartir() {
        return pedidoRepartidorWorkflowService.listarPedidosParaRepartir();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPedidosDeRepartidor(String codigoRepartidor) {
        return pedidoRepartidorWorkflowService.listarPedidosDeRepartidor(codigoRepartidor);
    }

    @Override
    @Transactional
    public PedidoResponseDTO asignarRepartidor(String codigoPedido, String codigoRepartidor) {
        return pedidoRepartidorWorkflowService.asignarRepartidor(codigoPedido, codigoRepartidor);
    }

    @Override
    @Transactional
    public PedidoResponseDTO aceptarEntrega(String codigoPedido, String codigoRepartidor) {
        return pedidoRepartidorWorkflowService.aceptarEntrega(codigoPedido, codigoRepartidor);
    }

    @Override
    @Transactional
    public PedidoResponseDTO rechazarEntrega(String codigoPedido, String codigoRepartidor) {
        return pedidoRepartidorWorkflowService.rechazarEntrega(codigoPedido, codigoRepartidor);
    }

    @Override
    @Transactional
    public PedidoResponseDTO tomarPedido(String codigoPedido, String codigoRepartidor) {
        return pedidoRepartidorWorkflowService.tomarPedido(codigoPedido, codigoRepartidor);
    }

    @Override
    @Transactional
    public PedidoResponseDTO retirarPedido(String codigoPedido, String codigoRepartidor) {
        return pedidoRepartidorWorkflowService.retirarPedido(codigoPedido, codigoRepartidor);
    }

    @Override
    @Transactional
    public PedidoResponseDTO entregarPedido(String codigoPedido, String codigoRepartidor) {
        return pedidoRepartidorWorkflowService.entregarPedido(codigoPedido, codigoRepartidor);
    }

    @Override
    @Transactional
    public PedidoResponseDTO confirmarRecepcion(
            String codigoPedido,
            String emailConsumidor
    ) {

        Pedido pedido
                = pedidoFinder.buscarPedidoDelConsumidor(
                        codigoPedido,
                        emailConsumidor
                );

        if (pedido.getEstado() != EstadoPedido.ENTREGADO) {
            throw conflicto("PEDIDO_NO_ESTA_ENTREGADO");
        }

        pedido.setEstado(EstadoPedido.RECIBIDO);

        pedidoRepository.save(pedido);

        historialPedidoService.actualizarHistorialPedido(pedido);

        return mapToResponseDTO(
                pedido,
                pedidoFinder.buscarTicketOpcional(pedido.getIdPedido()),
                pedidoFinder.buscarEntregaOpcional(pedido.getIdPedido())
        );
    }

    @Override
    @Transactional
    public PedidoResponseDTO calificarRepartidor(
            String codigoPedido,
            String emailConsumidor,
            Integer calificacion
    ) {
        return pedidoRepartidorWorkflowService.calificarRepartidor(
                codigoPedido,
                emailConsumidor,
                calificacion
        );
    }

    private PedidoResponseDTO mapToResponseDTO(
            Pedido pedido,
            Ticket ticket,
            Entrega entrega
    ) {
        Pago pago = pedidoFinder.buscarPagoOpcional(pedido.getIdPedido());

        return pedidoResponseMapper.toDTO(
                pedido,
                ticket,
                entrega,
                pago
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPedidosAdmin() {
        return pedidoRepository
                .findAll()
                .stream()
                .map(pedido -> mapToResponseDTO(
                pedido,
                pedidoFinder.buscarTicketOpcional(pedido.getIdPedido()),
                pedidoFinder.buscarEntregaOpcional(pedido.getIdPedido())
        ))
                .collect(Collectors.toList());
    }

    private ResponseStatusException conflicto(String mensaje) {

        return new ResponseStatusException(
                HttpStatus.CONFLICT,
                "CONFLICTO - " + mensaje
        );
    }
}
