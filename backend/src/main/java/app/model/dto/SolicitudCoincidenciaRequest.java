package app.model.dto;

public class SolicitudCoincidenciaRequest {

    private Long publicacionId;
    private Double radioKm;

    public SolicitudCoincidenciaRequest() {
    }

    public SolicitudCoincidenciaRequest(Long publicacionId, Double radioKm) {
        this.publicacionId = publicacionId;
        this.radioKm = radioKm;
    }

    public Long getPublicacionId() {
        return publicacionId;
    }

    public void setPublicacionId(Long publicacionId) {
        this.publicacionId = publicacionId;
    }

    public Double getRadioKm() {
        return radioKm;
    }

    public void setRadioKm(Double radioKm) {
        this.radioKm = radioKm;
    }
}