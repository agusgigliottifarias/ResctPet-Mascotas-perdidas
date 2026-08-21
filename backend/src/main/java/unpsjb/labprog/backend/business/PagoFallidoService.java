package unpsjb.labprog.backend.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.*;
import unpsjb.labprog.backend.model.dto.*;
import unpsjb.labprog.backend.model.enums.*;
import unpsjb.labprog.backend.repository.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PagoFallidoService {

    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;
    private final EntregaRepository entregaRepository;
    private final PagoHistorialService pagoHistorialService;
    private final PagoResponseMapper pagoResponseMapper;

    public boolean esPagoRechazado(PagoRequestDTO request) {
        return request.getSimulacion() != null
                && "RECHAZADO".equals(request.getSimulacion().get("forzarResultado"));
    }

    public boolean esErrorProveedor(PagoRequestDTO request) {
        return request.getSimulacion() != null
                && "ERROR".equals(request.getSimulacion().get("forzarResultado"));
    }

    public void manejarPagoFallido(
            Pedido pedido,
            PagoRequestDTO request,
            String mensaje
    ) {
        pedido.setEstado(EstadoPedido.RECHAZADO);
        pedido.setFechaHoraRechazo(Instant.now());
        pedido.setMotivoRechazo("PAGO_FALLIDO");

        pedido.setDetalleMotivoRechazo(
                String.valueOf(request.getSimulacion().get("detalleMotivo"))
        );

        pedidoRepository.save(pedido);

        invalidarEntregaSiExiste(pedido);

        Pago pago = registrarPagoRechazado(pedido, request);

        pagoHistorialService.actualizarHistorialPedido(pedido);

        throw new PagoFallidoException(
                mensaje,
                respuestaPagoRechazado(pedido, pago)
        );
    }

    private void invalidarEntregaSiExiste(Pedido pedido) {
        entregaRepository.findByIdPedido(pedido.getIdPedido())
                .ifPresent(entrega -> {
                    entrega.setEstado(EstadoEntrega.FALLIDA);
                    entrega.setMotivo("PAGO_FALLIDO");
                    entrega.setRepartidor(null);

                    entregaRepository.save(entrega);
                });
    }

    private Pago registrarPagoRechazado(
            Pedido pedido,
            PagoRequestDTO request
    ) {
        Pago pago = new Pago();

        pago.setIdPago(UUID.randomUUID());
        pago.setCodigo("P-" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase());

        pago.setIdPedido(pedido.getIdPedido());
        pago.setEmailConsumidor(request.getEmailConsumidor());
        pago.setMonto(request.getMonto());
        pago.setMetodo(request.getMetodo());
        pago.setAccion(request.getAccion());
        pago.setEstado(EstadoPago.RECHAZADO);
        pago.setFechaAutorizacion(Instant.now());
        pago.setCodigoMotivo("PAGO_FALLIDO");

        if (request.getSimulacion() != null) {
            pago.setDetalleMotivo(
                    String.valueOf(request.getSimulacion().get("detalleMotivo"))
            );
        }

        pago.setSplits(new ArrayList<>());

        return pagoRepository.save(pago);
    }

    private PagoResponseDTO respuestaPagoRechazado(
            Pedido pedido,
            Pago pago
    ) {
        PagoResponseDTO response = pagoResponseMapper.toDTO(pago, pedido, null);
        response.setSugerencia("Reintentar cambiando medio de pago");

        return response;
    }
}