# language: es

Característica: Solicitud de coincidencias de mascotas

  Escenario: Solicitar exitosamente coincidencias para una publicación existente
    Dado que existe una publicación con el id 1 en el sistema para buscar coincidencias
    Cuando se solicita la búsqueda de coincidencias para la publicación con id 1
    Entonces la respuesta HTTP de coincidencias debe ser status 200
    Y la lista de coincidencias devuelta debe tener una estructura válida

  Escenario: Solicitar coincidencias para una publicación que no se encuentra registrada
    Cuando se solicita la búsqueda de coincidencias para la publicación con id 99999
    Entonces la respuesta HTTP de coincidencias debe ser status 400
    Y el mensaje de error de coincidencias debe ser "La publicación seleccionada con ID 99999 no existe"