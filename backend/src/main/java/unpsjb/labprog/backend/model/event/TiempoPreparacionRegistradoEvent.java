package unpsjb.labprog.backend.model.event;

import java.time.Instant;

public class TiempoPreparacionRegistradoEvent {

    private final String idTicket;
    private final String idPedido;
    private final Instant inicioPreparacion;
    private final Instant finPreparacion;
    private final Long duracionSegundos;
    private final Instant ocurridoEn;

    public TiempoPreparacionRegistradoEvent(
            String idTicket,
            String idPedido,
            Instant inicioPreparacion,
            Instant finPreparacion,
            Long duracionSegundos
    ) {
        this.idTicket = idTicket;
        this.idPedido = idPedido;
        this.inicioPreparacion = inicioPreparacion;
        this.finPreparacion = finPreparacion;
        this.duracionSegundos = duracionSegundos;
        this.ocurridoEn = Instant.now();
    }

    public String getIdTicket() {
        return idTicket;
    }

    public String getIdPedido() {
        return idPedido;
    }

    public Instant getInicioPreparacion() {
        return inicioPreparacion;
    }

    public Instant getFinPreparacion() {
        return finPreparacion;
    }

    public Long getDuracionSegundos() {
        return duracionSegundos;
    }

    public Instant getOcurridoEn() {
        return ocurridoEn;
    }
}