# language: es

Característica: Consulta de publicaciones de mascotas

  Escenario: Consultar todas las publicaciones exitosamente
    Dado existen publicaciones registradas en el sistema
    Cuando se solicita la lista de todas las publicaciones
    Entonces la respuesta HTTP para consulta debe ser status 200
    Y la lista de publicaciones no debe estar vacía

  Escenario: Consultar una publicación existente por su ID
    Dado que existe una publicación con el id 1 en el sistema
    Cuando se solicita la publicación con id 1
    Entonces la respuesta HTTP para consulta debe ser status 200
    Y los detalles de la publicación deben coincidir con el id 1

  Escenario: Intentar consultar una publicación que no existe
    Cuando se solicita la publicación con id 99999
    Entonces la respuesta HTTP para consulta debe ser status 404
    Y el mensaje de error de consulta debe ser "No se encontró la publicación con ID: 99999"