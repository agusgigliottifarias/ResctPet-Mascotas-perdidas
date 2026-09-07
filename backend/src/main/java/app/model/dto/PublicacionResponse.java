package app.model.dto;

import app.model.enums.Especie;
import app.model.enums.TipoPublicacion;

import java.time.LocalDateTime;

public class PublicacionResponse {

    private Long id;
    private TipoPublicacion tipoPublicacion;
    private Especie especie;
    private String fecha;
    private String caracteristicas;
    private String fotografia;
    private Double latitud;
    private Double longitud;
    private Long usuarioId;
    private LocalDateTime fechaCreacion;

    public PublicacionResponse() {
    }

    public PublicacionResponse(Long id, TipoPublicacion tipoPublicacion, Especie especie, String fecha,
            String caracteristicas, String fotografia, Double latitud, Double longitud,
            Long usuarioId, LocalDateTime fechaCreacion) {
        this.id = id;
        this.tipoPublicacion = tipoPublicacion;
        this.especie = especie;
        this.fecha = fecha;
        this.caracteristicas = caracteristicas;
        this.fotografia = fotografia;
        this.latitud = latitud;
        this.longitud = longitud;
        this.usuarioId = usuarioId;
        this.fechaCreacion = fechaCreacion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoPublicacion getTipoPublicacion() {
        return tipoPublicacion;
    }

    public void setTipoPublicacion(TipoPublicacion tipoPublicacion) {
        this.tipoPublicacion = tipoPublicacion;
    }

    public Especie getEspecie() {
        return especie;
    }

    public void setEspecie(Especie especie) {
        this.especie = especie;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getCaracteristicas() {
        return caracteristicas;
    }

    public void setCaracteristicas(String caracteristicas) {
        this.caracteristicas = caracteristicas;
    }

    public String getFotografia() {
        return fotografia;
    }

    public void setFotografia(String fotografia) {
        this.fotografia = fotografia;
    }

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}