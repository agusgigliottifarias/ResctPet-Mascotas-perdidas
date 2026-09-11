package app.model.dto;

import app.model.enums.Especie;
import app.model.enums.TipoPublicacion;

import java.time.LocalDateTime;

public class PublicacionResponse {

    private Long id;
    private TipoPublicacion tipoPublicacion;
    private Especie especie;
    private String raza;
    private String edad;
    private String fecha;
    private String caracteristicas;
    private String fotografia;
    private Double latitud;
    private Double longitud;
    private LocalDateTime fechaCreacion;

    public PublicacionResponse() {
    }

    public PublicacionResponse(
            Long id,
            TipoPublicacion tipoPublicacion,
            Especie especie,
            String raza,
            String edad,
            String fecha,
            String caracteristicas,
            String fotografia,
            Double latitud,
            Double longitud,
            LocalDateTime fechaCreacion) {

        this.id = id;
        this.tipoPublicacion = tipoPublicacion;
        this.especie = especie;
        this.raza = raza;
        this.edad = edad;
        this.fecha = fecha;
        this.caracteristicas = caracteristicas;
        this.fotografia = fotografia;
        this.latitud = latitud;
        this.longitud = longitud;
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

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public String getEdad() {
        return edad;
    }

    public void setEdad(String edad) {
        this.edad = edad;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}