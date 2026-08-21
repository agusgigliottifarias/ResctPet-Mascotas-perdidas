package unpsjb.labprog.backend.model.dto;

import java.time.Instant;

public class TicketResponseDTO {

    private String idTicket;
    private String idPedido;
    private String idRestaurante;
    private String estadoTicket;
    private String motivo;

    private Instant inicioPreparacion;
    private Instant finPreparacion;
    private Long duracionPreparacionSegundos;
    private Instant anuladoEn;
    private Instant listoPara;
    private Boolean idempotente;

    public String getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(String idTicket) {
        this.idTicket = idTicket;
    }

    public String getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(String idPedido) {
        this.idPedido = idPedido;
    }

    public String getIdRestaurante() {
        return idRestaurante;
    }

    public void setIdRestaurante(String idRestaurante) {
        this.idRestaurante = idRestaurante;
    }

    public String getEstadoTicket() {
        return estadoTicket;
    }

    public void setEstadoTicket(String estadoTicket) {
        this.estadoTicket = estadoTicket;
    }

    public Instant getInicioPreparacion() {
        return inicioPreparacion;
    }

    public void setInicioPreparacion(Instant inicioPreparacion) {
        this.inicioPreparacion = inicioPreparacion;
    }

    public Long getDuracionPreparacionSegundos() {
        return duracionPreparacionSegundos;
    }

    public void setDuracionPreparacionSegundos(Long duracionPreparacionSegundos) {
        this.duracionPreparacionSegundos = duracionPreparacionSegundos;
    }

    public Instant getAnuladoEn() {
        return anuladoEn;
    }

    public void setAnuladoEn(Instant anuladoEn) {
        this.anuladoEn = anuladoEn;
    }

    public Instant getFinPreparacion() {
        return finPreparacion;
    }

    public void setFinPreparacion(Instant finPreparacion) {
        this.finPreparacion = finPreparacion;
    }

    public Instant getListoPara() {
        return listoPara;
    }

    public void setListoPara(Instant listoPara) {
        this.listoPara = listoPara;
    }

    public Boolean getIdempotente() {
        return idempotente;
    }

    public void setIdempotente(Boolean idempotente) {
        this.idempotente = idempotente;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

}
