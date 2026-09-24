# language: es

Característica: Filtrado de publicaciones de mascotas

  Escenario: Filtrar publicaciones exitosamente por especie
    Dado existen publicaciones registradas con diferentes especies en el sistema
    Cuando se solicita filtrar las publicaciones por especie "PERRO"
    Entonces la respuesta HTTP del filtro debe ser status 200
    Y todas las publicaciones devueltas deben pertenecer a la especie "PERRO"

  Escenario: Filtrar publicaciones por tipo de publicación (PERDIDA / ENCONTRADA)
    Dado existen publicaciones de tipo perdida y encontrada en el sistema
    Cuando se solicita filtrar las publicaciones por tipo "ENCONTRADA"
    Entonces la respuesta HTTP del filtro debe ser status 200
    Y todas las publicaciones devueltas deben ser de tipo "ENCONTRADA"