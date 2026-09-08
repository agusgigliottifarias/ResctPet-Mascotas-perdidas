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
    private LocalDateTime fechaCreacion;

    public PublicacionResponse() {
    }

    public PublicacionResponse(
            Long id,
            TipoPublicacion tipoPublicacion,
            Especie especie,
            String fecha,
            String caracteristicas,
            String fotografia,
            LocalDateTime fechaCreacion) {

        this.id = id;
        this.tipoPublicacion = tipoPublicacion;
        this.especie = especie;
        this.fecha = fecha;
        this.caracteristicas = caracteristicas;
        this.fotografia = fotografia;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}