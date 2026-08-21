package unpsjb.labprog.backend.model.event;

import java.time.Instant;

public class TicketListoEvent {

    private String codigoTicket;
    private String codigoPedido;
    private String codigoRestaurante;
    private Instant ocurridoEn;

    public TicketListoEvent(
            String codigoTicket,
            String codigoPedido,
            String codigoRestaurante
    ) {
        this.codigoTicket = codigoTicket;
        this.codigoPedido = codigoPedido;
        this.codigoRestaurante = codigoRestaurante;
        this.ocurridoEn = Instant.now();
    }

    public String getCodigoTicket() {
        return codigoTicket;
    }

    public String getCodigoPedido() {
        return codigoPedido;
    }

    public String getCodigoRestaurante() {
        return codigoRestaurante;
    }

    public Instant getOcurridoEn() {
        return ocurridoEn;
    }
}