package app.model.dto;

import java.util.List;

public class PublicacionPageResponse {

    private List<PublicacionResponse> contenido;
    private int pagina;
    private int tamanio;
    private long totalElementos;
    private int totalPaginas;

    public PublicacionPageResponse() {
    }

    public PublicacionPageResponse(
            List<PublicacionResponse> contenido,
            int pagina,
            int tamanio,
            long totalElementos,
            int totalPaginas) {

        this.contenido = contenido;
        this.pagina = pagina;
        this.tamanio = tamanio;
        this.totalElementos = totalElementos;
        this.totalPaginas = totalPaginas;
    }

    public List<PublicacionResponse> getContenido() {
        return contenido;
    }

    public void setContenido(List<PublicacionResponse> contenido) {
        this.contenido = contenido;
    }

    public int getPagina() {
        return pagina;
    }

    public void setPagina(int pagina) {
        this.pagina = pagina;
    }

    public int getTamanio() {
        return tamanio;
    }

    public void setTamanio(int tamanio) {
        this.tamanio = tamanio;
    }

    public long getTotalElementos() {
        return totalElementos;
    }

    public void setTotalElementos(long totalElementos) {
        this.totalElementos = totalElementos;
    }

    public int getTotalPaginas() {
        return totalPaginas;
    }

    public void setTotalPaginas(int totalPaginas) {
        this.totalPaginas = totalPaginas;
    }
}