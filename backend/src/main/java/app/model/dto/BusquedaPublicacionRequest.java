package app.model.dto;

import app.model.enums.Especie;
import app.model.enums.TipoPublicacion;

public class BusquedaPublicacionRequest {

    private Especie especie;
    private TipoPublicacion tipoPublicacion;
    private String fecha;

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
}