# language: es

Característica: Publicación de mascota encontrada

  Escenario: Crear correctamente una publicación de mascota encontrada
    Dado un usuario registrado con id 1
    Cuando se crea la publicación de mascota encontrada:
      | tipoPublicacion | especie | raza   | edad | fecha      | caracteristicas         | fotografia  | latitud    | longitud   | usuarioId |
      | ENCONTRADA      | PERRO   | Caniche | 3    | 2026-09-01 | Perro blanco con collar | perro01.jpg | -38.000421 | -57.556102 | 1         |
    Entonces la respuesta HTTP debe ser status 201
    Y el mensaje de la respuesta debe ser "Publicación creada y fotografía asociada exitosamente"
    Y la respuesta contiene la publicación registrada:
      | tipoPublicacion | especie | raza    | edad | fecha      | caracteristicas         | fotografia  | latitud    | longitud   |
      | ENCONTRADA      | PERRO   | Caniche | 3    | 2026-09-01 | Perro blanco con collar | perro01.jpg | -38.000421 | -57.556102 |

  Escenario: Rechazar una publicación de mascota encontrada con datos obligatorios faltantes
    Cuando se crea la publicación de mascota encontrada:
      | tipoPublicacion | especie | fecha      | caracteristicas         | fotografia  | latitud    | longitud   | usuarioId |
      |                 | PERRO   | 2026-09-01 | Perro blanco con collar | perro01.jpg | -38.000421 | -57.556102 | 1         |
    Entonces la respuesta HTTP debe ser status 400
    Y el mensaje de la respuesta debe ser "El tipo de publicación es obligatorio"

  Escenario: Rechazar una publicación de mascota encontrada sin fotografía
    Cuando se crea la publicación de mascota encontrada:
      | tipoPublicacion | especie | fecha      | caracteristicas        | fotografia | latitud    | longitud   | usuarioId |
      | ENCONTRADA      | GATO    | 2026-09-01 | Gato siamés con collar |            | -38.010000 | -57.550000 | 1         |
    Entonces la respuesta HTTP debe ser status 400
    Y el mensaje de la respuesta debe ser "La fotografía principal es obligatoria"