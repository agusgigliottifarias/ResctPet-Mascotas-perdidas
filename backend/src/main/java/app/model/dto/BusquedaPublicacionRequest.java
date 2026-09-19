package app.model.dto;

import app.model.enums.Especie;
import app.model.enums.TipoPublicacion;

public class BusquedaPublicacionRequest {

    private Especie especie;
    private TipoPublicacion tipoPublicacion;
    private String fecha;
    private String raza;
    private String caracteristicas;

    private Double latitud;
    private Double longitud;
    private Double radioKm;

    public BusquedaPublicacionRequest() {
    }

    public Especie getEspecie() {
        return especie;
    }

    public void setEspecie(Especie especie) {
        this.especie = especie;
    }

    public TipoPublicacion getTipoPublicacion() {
        return tipoPublicacion;
    }

    public void setTipoPublicacion(TipoPublicacion tipoPublicacion) {
        this.tipoPublicacion = tipoPublicacion;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public String getCaracteristicas() {
        return caracteristicas;
    }

    public void setCaracteristicas(String caracteristicas) {
        this.caracteristicas = caracteristicas;
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

    public Double getRadioKm() {
        return radioKm;
    }

    public void setRadioKm(Double radioKm) {
        this.radioKm = radioKm;
    }
}