# language: es
Característica: Publicación de mascota perdida

  Esquema del escenario: Crear una publicación de mascota perdida correctamente
    Dado un usuario registrado con id <usuario_id>
    Cuando se crea la publicación de mascota perdida:
      | tipoPublicacion   | especie   | fecha   | caracteristicas   | fotografia   | latitud   | longitud   | usuarioId   |
      | <tipoPublicacion> | <especie> | <fecha> | <caracteristicas> | <fotografia> | <latitud> | <longitud> | <usuario_id> |
    Entonces la respuesta HTTP debe ser status <status_code>
    Y el mensaje de la respuesta debe ser "<mensaje>"
    Y la respuesta contiene la publicación registrada:
      | tipoPublicacion   | especie   | fecha   | caracteristicas   |
      | <tipoPublicacion> | <especie> | <fecha> | <caracteristicas> |

    Ejemplos:
      | usuario_id | tipoPublicacion | especie | fecha      | caracteristicas            | fotografia  | latitud    | longitud   | status_code | mensaje                                                      |
      | 1          | PERDIDA         | PERRO   | 2026-09-01 | Perro caniche color blanco | perro01.jpg | -38.000421 | -57.556102 | 201         | Publicación creada y fotografía asociada exitosamente        |
      | 1          | PERDIDA         | GATO    | 2026-09-05 | Gato siamés con collar     | gato01.jpg  | -38.010000 | -57.550000 | 201         | Publicación creada y fotografía asociada exitosamente        |

  Esquema del escenario: Rechazar creación de publicación con datos inválidos
    Cuando se crea la publicación de mascota perdida:
      | tipoPublicacion   | especie   | fecha   | caracteristicas   | fotografia   | latitud   | longitud   | usuarioId |
      | <tipoPublicacion> | <especie> | <fecha> | <caracteristicas> | <fotografia> | <latitud> | <longitud> | 1         |
    Entonces la respuesta HTTP debe ser status 400
    Y el mensaje de la respuesta debe ser "<mensaje_error>"

    Ejemplos:
      | tipoPublicacion | especie | fecha      | caracteristicas            | fotografia  | latitud    | longitud   | mensaje_error                                         |
      |                 | PERRO   | 2026-09-01 | Perro caniche color blanco | perro01.jpg | -38.000421 | -57.556102 | El tipo de publicación es obligatorio                 |
      | PERDIDA         |         | 2026-09-01 | Perro caniche color blanco | perro01.jpg | -38.000421 | -57.556102 | La especie es obligatoria                             |
      | PERDIDA         | PERRO   |            | Perro caniche color blanco | perro01.jpg | -38.000421 | -57.556102 | La fecha es obligatoria                               |
      | PERDIDA         | PERRO   | 01-09-2026 | Perro caniche color blanco | perro01.jpg | -38.000421 | -57.556102 | La fecha debe tener el formato YYYY-MM-DD             |
      | PERDIDA         | PERRO   | 2026-09-01 |                            | perro01.jpg | -38.000421 | -57.556102 | Las características son obligatorias                  |
      | PERDIDA         | PERRO   | 2026-09-01 | Perro caniche color blanco |             | -38.000421 | -57.556102 | La fotografía principal es obligatoria                |
      | PERDIDA         | PERRO   | 2026-09-01 | Perro caniche color blanco | perro01.jpg | -100.0     | -57.556102 | La latitud debe estar entre -90 y 90                  |
      | PERDIDA         | PERRO   | 2026-09-01 | Perro caniche color blanco | perro01.jpg | -38.000421 | 200.0      | La longitud debe estar entre -180 y 180               |