package unpsjb.labprog.backend.model.event;

import java.time.Instant;

public class EntregaEntregadaEvent {

    private String codigoEntrega;
    private String codigoPedido;
    private String codigoRepartidor;
    private Instant ocurridoEn;

    public EntregaEntregadaEvent(
            String codigoEntrega,
            String codigoPedido,
            String codigoRepartidor
    ) {
        this.codigoEntrega = codigoEntrega;
        this.codigoPedido = codigoPedido;
        this.codigoRepartidor = codigoRepartidor;
        this.ocurridoEn = Instant.now();
    }

    public String getCodigoEntrega() {
        return codigoEntrega;
    }

    public String getCodigoPedido() {
        return codigoPedido;
    }

    public String getCodigoRepartidor() {
        return codigoRepartidor;
    }

    public Instant getOcurridoEn() {
        return ocurridoEn;
    }
}