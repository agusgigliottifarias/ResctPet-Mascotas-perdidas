# language: es

Característica: Filtrar publicaciones de mascotas por especie

  Escenario: Filtrar publicaciones de forma exitosa según la especie
    Dado que existen publicaciones de diferentes especies registradas en el sistema
    Cuando se realiza una consulta filtrando por la especie "PERRO"
    Entonces la respuesta HTTP del filtro por especie debe ser status 200
    Y todas las publicaciones obtenidas deben corresponder a la especie "PERRO"