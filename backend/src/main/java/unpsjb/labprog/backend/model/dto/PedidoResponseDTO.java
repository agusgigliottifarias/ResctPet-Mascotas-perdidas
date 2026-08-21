package unpsjb.labprog.backend.model.dto;

import lombok.Data;
import unpsjb.labprog.backend.model.Precio;
import unpsjb.labprog.backend.model.Direccion;

import java.time.Instant;
import java.util.List;

@Data
public class PedidoResponseDTO {

    private String codigoPedido;
    private String estadoPedido;
    private String emailConsumidor;
    private String status_text;
    private RestauranteInfo restaurante;
    private Precio total;
    private List<ItemDetalleDTO> lineas;
    private Direccion direccionEntrega;
    private TicketDTO ticket;
    private EntregaDTO entrega;
    private RepartidorDTO repartidor;
    private Long tiempoRemanenteEstimado;
    private Boolean estimacionVencida;
    private String motivoCancelacion;
    private Instant fechaHoraCancelacion;
    private Instant fechaHoraRechazo;
    private String motivoRechazo;
    private String detalleMotivoRechazo;
    private PagoDTO pago;
    private HonorarioDTO honorario;

    @Data
    public static class RestauranteInfo {

        private String codigoRestaurante;
        private String nombre;
        private Double latitud;
        private Double longitud;
    }

    @Data
    public static class ItemDetalleDTO {

        private String nombreItem;

        private Integer cantidad;

        private Precio precio;

        private List<String> codigosAdicionales;

        private List<String> nombresAdicionales;
    }

    @Data
    public static class TicketDTO {

        private String codigoTicket;
        private String estado;
        private Instant listoPara;
        private Instant estimadoListo;
        private String motivo;
    }

    @Data
    public static class EntregaDTO {

        private String codigoEntrega;
        private String estado;
        private Instant tiempoEstimadoArribo;
        private Instant fechaHoraEntregaReal;
    }

    @Data
    public static class RepartidorDTO {

        private String codigoRepartidor;
        private String nombre;
        private String tipoVehiculo;
        private String estado;

        private Double calificacionPromedio;
        private Integer cantidadCalificaciones;
    }

    @Data
    public static class PagoDTO {

        private String estado;
        private Boolean requiereReembolso;
    }

    @Data
    public static class HonorarioDTO {

        private Double monto;
        private String moneda;
        private Boolean liquidable;
        private Instant fechaLiquidable;
    }
}
