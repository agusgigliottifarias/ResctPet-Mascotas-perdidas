package app.model.dto;

import java.util.List;

public class CoincidenciaResponse {

    private Long publicacionOrigenId;
    private int totalCandidatos;
    private List<PublicacionResponse> candidatos;

    public CoincidenciaResponse() {
    }

    public CoincidenciaResponse(Long publicacionOrigenId, int totalCandidatos, List<PublicacionResponse> candidatos) {
        this.publicacionOrigenId = publicacionOrigenId;
        this.totalCandidatos = totalCandidatos;
        this.candidatos = candidatos;
    }

    public Long getPublicacionOrigenId() {
        return publicacionOrigenId;
    }

    public void setPublicacionOrigenId(Long publicacionOrigenId) {
        this.publicacionOrigenId = publicacionOrigenId;
    }

    public int getTotalCandidatos() {
        return totalCandidatos;
    }

    public void setTotalCandidatos(int totalCandidatos) {
        this.totalCandidatos = totalCandidatos;
    }

    public List<PublicacionResponse> getCandidatos() {
        return candidatos;
    }

    public void setCandidatos(List<PublicacionResponse> candidatos) {
        this.candidatos = candidatos;
    }
}