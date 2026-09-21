package app.business;

import app.model.Publicacion;
import app.model.dto.FotografiaResponse;
import app.repository.PublicacionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FotografiaService {

    private final PublicacionRepository publicacionRepository;

    public FotografiaService(PublicacionRepository publicacionRepository) {
        this.publicacionRepository = publicacionRepository;
    }

    /**
     * T - 5.1.6: Prepara y valida la fotografía principal de una publicación para la comparación visual.
     */
    @Transactional(readOnly = true)
    public FotografiaResponse prepararFotografia(Long publicacionId) {

        if (publicacionId == null || publicacionId <= 0) {
            throw new IllegalArgumentException("El ID de la publicación debe ser un número positivo válido");
        }

        Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la publicación con ID: " + publicacionId));

        String fotoRaw = publicacion.getFotografia();

        if (fotoRaw == null || fotoRaw.trim().isEmpty()) {
            return new FotografiaResponse(
                    publicacionId,
                    null,
                    "SIN_FORMATO",
                    false,
                    "La publicación no cuenta con una fotografía principal registrada para la comparación"
            );
        }

        String fotoNormalizada = fotoRaw.trim();
        String formato = detectarFormato(fotoNormalizada);

        return new FotografiaResponse(
                publicacionId,
                fotoNormalizada,
                formato,
                true,
                "Fotografía principal preparada y lista para la comparación visual"
        );
    }

    private String detectarFormato(String urlOrBase64) {
        if (urlOrBase64.startsWith("data:image/")) {
            int idxEnd = urlOrBase64.indexOf(";base64");
            if (idxEnd > 11) {
                return urlOrBase64.substring(11, idxEnd).toLowerCase();
            }
            return "base64";
        }
        int lastDot = urlOrBase64.lastIndexOf('.');
        if (lastDot != -1 && lastDot < urlOrBase64.length() - 1) {
            return urlOrBase64.substring(lastDot + 1).toLowerCase();
        }
        return "jpg";
    }
}