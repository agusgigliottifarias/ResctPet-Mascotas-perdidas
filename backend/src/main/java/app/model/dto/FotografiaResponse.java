package app.model.dto;

public class FotografiaResponse {

    private Long publicacionId;
    private String url;
    private String formato;
    private boolean esValida;
    private String mensaje;

    public FotografiaResponse() {
    }

    public FotografiaResponse(Long publicacionId, String url, String formato, boolean esValida, String mensaje) {
        this.publicacionId = publicacionId;
        this.url = url;
        this.formato = formato;
        this.esValida = esValida;
        this.mensaje = mensaje;
    }

    public Long getPublicacionId() {
        return publicacionId;
    }

    public void setPublicacionId(Long publicacionId) {
        this.publicacionId = publicacionId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getFormato() {
        return formato;
    }

    public void setFormato(String formato) {
        this.formato = formato;
    }

    public boolean isEsValida() {
        return esValida;
    }

    public void setEsValida(boolean esValida) {
        this.esValida = esValida;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}