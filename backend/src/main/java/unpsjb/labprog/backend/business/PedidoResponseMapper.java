package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Component;
import unpsjb.labprog.backend.model.*;
import unpsjb.labprog.backend.model.dto.PedidoResponseDTO;
import unpsjb.labprog.backend.model.enums.EstadoPago;
import unpsjb.labprog.backend.model.enums.EstadoEntrega;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component
public class PedidoResponseMapper {

    public PedidoResponseDTO toDTO(
            Pedido pedido,
            Ticket ticket,
            Entrega entrega,
            Pago pago
    ) {
        PedidoResponseDTO dto = new PedidoResponseDTO();

        dto.setCodigoPedido(pedido.getCodigo());
        dto.setEstadoPedido(pedido.getEstado().name());
        dto.setEmailConsumidor(pedido.getEmailConsumidor());
        dto.setTotal(pedido.getTotal());
        dto.setDireccionEntrega(pedido.getDireccionEntrega());
        dto.setFechaHoraCancelacion(pedido.getFechaHoraCancelacion());
        dto.setMotivoCancelacion(pedido.getMotivoCancelacion());
        dto.setFechaHoraRechazo(pedido.getFechaHoraRechazo());
        dto.setMotivoRechazo(pedido.getMotivoRechazo());
        dto.setDetalleMotivoRechazo(pedido.getDetalleMotivoRechazo());

        mapearRestaurante(dto, pedido);
        mapearLineas(dto, pedido);
        mapearTicket(dto, ticket);
        mapearEntrega(dto, entrega);
        mapearPago(dto, pago);
        mapearHonorario(dto, pago);
        calcularTiempo(dto, ticket, entrega);

        dto.setStatus_text(generarStatusText(dto));

        return dto;
    }

    private void mapearHonorario(PedidoResponseDTO dto, Pago pago) {

        if (pago == null || pago.getSplits() == null) {
            dto.setHonorario(null);
            return;
        }

        SplitPago splitRepartidor = pago.getSplits().stream()
                .filter(split -> "REPARTIDOR".equals(split.getDestino()))
                .findFirst()
                .orElse(null);

        if (splitRepartidor == null) {
            dto.setHonorario(null);
            return;
        }

        PedidoResponseDTO.HonorarioDTO honorario = new PedidoResponseDTO.HonorarioDTO();

        honorario.setMonto(splitRepartidor.getMonto().getMonto());
        honorario.setMoneda(splitRepartidor.getMonto().getMoneda());
        honorario.setLiquidable(splitRepartidor.isLiquidable());
        honorario.setFechaLiquidable(splitRepartidor.getFechaLiquidable());

        dto.setHonorario(honorario);
    }

    private void mapearRestaurante(PedidoResponseDTO dto, Pedido pedido) {
        if (pedido.getRestaurante() == null) {
            return;
        }

        PedidoResponseDTO.RestauranteInfo restaurante = new PedidoResponseDTO.RestauranteInfo();

        restaurante.setCodigoRestaurante(pedido.getRestaurante().getCodigo());
        restaurante.setNombre(pedido.getRestaurante().getNombre());
        restaurante.setLatitud(pedido.getRestaurante().getLatitud());
        restaurante.setLongitud(pedido.getRestaurante().getLongitud());

        dto.setRestaurante(restaurante);
    }

    private void mapearLineas(PedidoResponseDTO dto, Pedido pedido) {
        List<PedidoResponseDTO.ItemDetalleDTO> items = new ArrayList<>();

        if (pedido.getLineas() != null) {
            for (ItemPedido item : pedido.getLineas()) {
                PedidoResponseDTO.ItemDetalleDTO detalle = new PedidoResponseDTO.ItemDetalleDTO();

                detalle.setNombreItem(item.getNombre());
                detalle.setCantidad(item.getCantidad());
                detalle.setPrecio(item.getPrecioUnitario());
                detalle.setCodigosAdicionales(item.getAdicionalesElegidos());
                detalle.setNombresAdicionales(item.getNombresAdicionales());

                items.add(detalle);
            }
        }

        dto.setLineas(items);
    }

    private void mapearTicket(PedidoResponseDTO dto, Ticket ticket) {
        if (ticket == null) {
            dto.setTicket(null);
            return;
        }

        PedidoResponseDTO.TicketDTO ticketDTO = new PedidoResponseDTO.TicketDTO();

        ticketDTO.setCodigoTicket(ticket.getCodigo());
        ticketDTO.setEstado(ticket.getEstado().name());
        ticketDTO.setMotivo(ticket.getMotivo());
        ticketDTO.setListoPara(ticket.getListoPara());
        ticketDTO.setEstimadoListo(ticket.getEstimadoListo());

        dto.setTicket(ticketDTO);
    }

    private void mapearEntrega(PedidoResponseDTO dto, Entrega entrega) {
        if (entrega == null) {
            dto.setEntrega(null);
            dto.setRepartidor(null);
            return;
        }

        PedidoResponseDTO.EntregaDTO entregaDTO = new PedidoResponseDTO.EntregaDTO();

        entregaDTO.setCodigoEntrega(entrega.getCodigo());
        entregaDTO.setEstado(entrega.getEstado().name());
        entregaDTO.setTiempoEstimadoArribo(entrega.getTiempoEstimadoArribo());
        entregaDTO.setFechaHoraEntregaReal(entrega.getFechaHoraEntregaReal());

        dto.setEntrega(entregaDTO);

        if (entrega.getRepartidor() == null
                || entrega.getEstado() == EstadoEntrega.ASIGNADA) {
            dto.setRepartidor(null);
            return;
        }
        PedidoResponseDTO.RepartidorDTO repartidorDTO = new PedidoResponseDTO.RepartidorDTO();

        repartidorDTO.setCodigoRepartidor(entrega.getRepartidor().getCodigo());
        repartidorDTO.setNombre(entrega.getRepartidor().getNombre());
        repartidorDTO.setTipoVehiculo(entrega.getRepartidor().getTipoVehiculo());
        repartidorDTO.setEstado(entrega.getRepartidor().getEstado().name());

        repartidorDTO.setCalificacionPromedio(
                entrega.getRepartidor().getCalificacionPromedio()
        );

        repartidorDTO.setCantidadCalificaciones(
                entrega.getRepartidor().getCantidadCalificaciones()
        );

        dto.setRepartidor(repartidorDTO);
    }

    private void mapearPago(PedidoResponseDTO dto, Pago pago) {
        if (pago == null) {
            dto.setPago(null);
            return;
        }

        PedidoResponseDTO.PagoDTO pagoDTO = new PedidoResponseDTO.PagoDTO();

        pagoDTO.setEstado(pago.getEstado().name());
        pagoDTO.setRequiereReembolso(
                pago.getEstado() == EstadoPago.CAPTURADO
                || pago.getEstado() == EstadoPago.REEMBOLSO_PENDIENTE
        );

        dto.setPago(pagoDTO);
    }

    private void calcularTiempo(PedidoResponseDTO dto, Ticket ticket, Entrega entrega) {

        if ("ENTREGADO".equals(dto.getEstadoPedido())
                || "RECIBIDO".equals(dto.getEstadoPedido())) {
            dto.setTiempoRemanenteEstimado(null);
            dto.setEstimacionVencida(false);
            return;
        }

        Instant referencia = obtenerReferenciaDeEstimacion(ticket, entrega);

        if (referencia == null) {
            dto.setTiempoRemanenteEstimado(null);
            dto.setEstimacionVencida(false);
            return;
        }

        long segundos = Duration.between(Instant.now(), referencia).getSeconds();

        dto.setTiempoRemanenteEstimado(segundos <= 0 ? 0L : segundos);
        dto.setEstimacionVencida(segundos <= 0);
    }

    private Instant obtenerReferenciaDeEstimacion(Ticket ticket, Entrega entrega) {

        if (entrega != null && entrega.getTiempoEstimadoArribo() != null) {
            return entrega.getTiempoEstimadoArribo();
        }

        if (ticket != null && ticket.getListoPara() != null) {
            return ticket.getListoPara();
        }

        if (ticket != null && ticket.getEstimadoListo() != null) {
            return ticket.getEstimadoListo();
        }

        return null;
    }

    private String generarStatusText(PedidoResponseDTO dto) {

        List<String> estados = new ArrayList<>();

        if (dto.getTiempoRemanenteEstimado() == null) {
            estados.add("SIN_ESTIMACION");
        }
        if (Boolean.TRUE.equals(dto.getEstimacionVencida())) {
            estados.add("ESTIMACION_VENCIDA");
        }
        if (dto.getRepartidor() == null) {
            estados.add("SIN_REPARTIDOR_ASIGNADO");
        }

        return estados.isEmpty()
                ? "OK"
                : "OK - " + String.join(" - ", estados);
    }
}
