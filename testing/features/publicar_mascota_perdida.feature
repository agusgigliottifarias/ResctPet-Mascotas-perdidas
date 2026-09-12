# language: es

Característica: Publicar mascota perdida
   Escenario: Crear publicación de mascota perdida correctamente
      Dado que un usuario prepara los siguientes datos de mascota perdida:
         """
         {
            "tipoPublicacion": "PERDIDA",
            "especie": "PERRO",
            "raza": "Mestizo",
            "edad": "Adulto",
            "fecha": "2026-09-10",
            "caracteristicas": "Mancha negra en el ojo derecho, collar azul.",
            "fotografia": "base64_foto_perro",
            "latitud": -42.7692,
            "longitud": -65.0385,
            "usuarioId": 1
         }
         """
      Cuando solicitamos publicar la mascota perdida
      Entonces esperamos recibir estado 201
      Y el mensaje de respuesta "Publicación creada y fotografía asociada exitosamente"
      Y la publicación generada tiene especie "PERRO" y fecha "2026-09-10"

   Esquema del escenario: Validaciones obligatorias al publicar mascota perdida
      Dado que existe una intención de publicar una mascota perdida
      Cuando solicito publicar con especie "<especie>", fecha "<fecha>", foto "<foto>", latitud "<latitud>", longitud "<longitud>" y usuario "<usuario_id>"
      Entonces esperamos recibir estado <estado>
      Y el mensaje de respuesta "<mensaje>"

      Ejemplos:
      | especie | fecha      | foto     | latitud | longitud | usuario_id | estado | mensaje                                   |
      |         | 2026-09-10 | foto.jpg | -42.76  | -65.03   | 1          | 400    | La especie es obligatoria                 |
      | PERRO   |            | foto.jpg | -42.76  | -65.03   | 1          | 400    | La fecha es obligatoria                   |
      | PERRO   | 10-09-2026 | foto.jpg | -42.76  | -65.03   | 1          | 400    | La fecha debe tener el formato YYYY-MM-DD |
      | PERRO   | 2026-09-10 |          | -42.76  | -65.03   | 1          | 400    | La fotografía principal es obligatoria    |
      | PERRO   | 2026-09-10 | foto.jpg |         | -65.03   | 1          | 400    | La latitud es obligatoria                 |
      | PERRO   | 2026-09-10 | foto.jpg | -100.0  | -65.03   | 1          | 400    | La latitud debe estar entre -90 y 90      |