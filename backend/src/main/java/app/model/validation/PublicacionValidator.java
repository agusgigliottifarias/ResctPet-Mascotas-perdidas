package app.model.validation;

import app.model.dto.PublicacionRequest;

public class PublicacionValidator {

    public static void validar(PublicacionRequest publicacion) {

        if (publicacion == null) {
            throw new IllegalArgumentException("La publicación no puede ser nula");
        }

        if (publicacion.getTipoPublicacion() == null) {
            throw new IllegalArgumentException(
                    "El tipo de publicación es obligatorio"
            );
        }

        if (publicacion.getEspecie() == null) {
            throw new IllegalArgumentException(
                    "La especie es obligatoria"
            );
        }

        if (publicacion.getFecha() == null ||
                publicacion.getFecha().isBlank()) {
            throw new IllegalArgumentException(
                    "La fecha es obligatoria"
            );
        }

        if (publicacion.getCaracteristicas() == null ||
                publicacion.getCaracteristicas().isBlank()) {
            throw new IllegalArgumentException(
                    "Las características son obligatorias"
            );
        }

        if (publicacion.getCaracteristicas().length() > 500) {
            throw new IllegalArgumentException(
                    "Las características no pueden superar los 500 caracteres"
            );
        }

        if (publicacion.getFotografia() == null ||
                publicacion.getFotografia().isBlank()) {
            throw new IllegalArgumentException(
                    "La fotografía principal es obligatoria"
            );
        }

        if (publicacion.getLatitud() == null) {
            throw new IllegalArgumentException(
                    "La latitud es obligatoria"
            );
        }

        if (publicacion.getLongitud() == null) {
            throw new IllegalArgumentException(
                    "La longitud es obligatoria"
            );
        }

        if (publicacion.getLatitud() < -90 ||
                publicacion.getLatitud() > 90) {
            throw new IllegalArgumentException(
                    "La latitud debe estar entre -90 y 90"
            );
        }

        if (publicacion.getLongitud() < -180 ||
                publicacion.getLongitud() > 180) {
            throw new IllegalArgumentException(
                    "La longitud debe estar entre -180 y 180"
            );
        }
    }
}