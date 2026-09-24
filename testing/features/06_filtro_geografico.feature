# language: es

Característica: Filtrar publicaciones de mascotas por cercanía geográfica

  Escenario: Filtrar publicaciones exitosamente dentro de un radio geográfico determinado
    Dado existen publicaciones con ubicación geográfica registradas en el sistema
    Cuando se solicita filtrar las publicaciones con latitud "-38.000421", longitud "-57.556102" y un radio de "10" kilómetros
    Entonces la respuesta HTTP del filtro por cercanía debe ser status 200
    Y la lista de publicaciones devueltas debe contener elementos dentro del radio especificado

  Escenario: Filtrar por cercanía en una zona sin publicaciones cercanas
    Cuando se solicita filtrar las publicaciones con latitud "0.000000", longitud "0.000000" y un radio de "5" kilómetros
    Entonces la respuesta HTTP del filtro por cercanía debe ser status 200
    Y la lista de publicaciones por cercanía debe estar vacía