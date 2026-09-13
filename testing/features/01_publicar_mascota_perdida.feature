# language: es

Característica: Publicación de mascota perdida

  Escenario: Crear correctamente una publicación de mascota perdida
    Dado un usuario registrado con id 1
    Cuando se crea la publicación de mascota perdida:
      | tipoPublicacion | especie | raza     | edad | fecha      | caracteristicas            | fotografia  | latitud    | longitud   | usuarioId |
      | PERDIDA         | PERRO   | Caniche  | 3    | 2026-09-01 | Perro blanco con collar    | perro01.jpg | -38.000421 | -57.556102 | 1         |
    Entonces la respuesta HTTP debe ser status 201
    Y el mensaje de la respuesta debe ser "Publicación creada y fotografía asociada exitosamente"
    Y la respuesta contiene la publicación registrada:
      | tipoPublicacion | especie | raza    | edad | fecha      | caracteristicas         | fotografia  | latitud    | longitud   |
      | PERDIDA         | PERRO   | Caniche | 3    | 2026-09-01 | Perro blanco con collar | perro01.jpg | -38.000421 | -57.556102 |

  Escenario: Rechazar una publicación de mascota perdida con datos obligatorios faltantes
    Cuando se crea la publicación de mascota perdida:
      | tipoPublicacion | especie | fecha      | caracteristicas            | fotografia  | latitud    | longitud   | usuarioId |
      |                 | PERRO   | 2026-09-01 | Perro blanco con collar    | perro01.jpg | -38.000421 | -57.556102 | 1         |
    Entonces la respuesta HTTP debe ser status 400
    Y el mensaje de la respuesta debe ser "El tipo de publicación es obligatorio"

  Escenario: Rechazar una publicación con fecha inválida
    Cuando se crea la publicación de mascota perdida:
      | tipoPublicacion | especie | fecha       | caracteristicas         | fotografia  | latitud    | longitud   | usuarioId |
      | PERDIDA         | PERRO   | 01-09-2026  | Perro blanco con collar | perro01.jpg | -38.000421 | -57.556102 | 1         |
    Entonces la respuesta HTTP debe ser status 400
    Y el mensaje de la respuesta debe ser "La fecha debe tener el formato YYYY-MM-DD"

  Escenario: Rechazar una publicación con coordenadas inválidas
    Cuando se crea la publicación de mascota perdida:
      | tipoPublicacion | especie | fecha      | caracteristicas         | fotografia  | latitud | longitud   | usuarioId |
      | PERDIDA         | PERRO   | 2026-09-01 | Perro blanco con collar | perro01.jpg | -100.0  | -57.556102 | 1         |
    Entonces la respuesta HTTP debe ser status 400
    Y el mensaje de la respuesta debe ser "La latitud debe estar entre -90 y 90"

  Escenario: Rechazar una publicación sin fotografía
    Cuando se crea la publicación de mascota perdida:
      | tipoPublicacion | especie | fecha      | caracteristicas         | fotografia | latitud    | longitud   | usuarioId |
      | PERDIDA         | GATO   | 2026-09-01 | Gato siamés con collar  |            | -38.010000 | -57.550000 | 1         |
    Entonces la respuesta HTTP debe ser status 400
    Y el mensaje de la respuesta debe ser "La fotografía principal es obligatoria"