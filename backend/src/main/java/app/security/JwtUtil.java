package app.security;

import org.springframework.stereotype.Component;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "RescPetSecretKeyParaAutenticacionDeUsuariosMascotas2026";
    private static final long EXPIRATION_TIME_MS = 86400000L; // 24 Horas

    public String generarToken(Long usuarioId, String email) {
        long now = System.currentTimeMillis();
        long exp = now + EXPIRATION_TIME_MS;

        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payloadJson = String.format(
                "{\"id\":%d,\"sub\":\"%s\",\"iat\":%d,\"exp\":%d}",
                usuarioId, email, now / 1000, exp / 1000
        );

        String headerEncoded = Base64.getUrlEncoder().withoutPadding().encodeToString(headerJson.getBytes(StandardCharsets.UTF_8));
        String payloadEncoded = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));

        String signatureInput = headerEncoded + "." + payloadEncoded;
        String signatureEncoded = hmacSha256(signatureInput, SECRET_KEY);

        return signatureInput + "." + signatureEncoded;
    }

    private String hmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error al firmar el token de autenticación", e);
        }
    }
}