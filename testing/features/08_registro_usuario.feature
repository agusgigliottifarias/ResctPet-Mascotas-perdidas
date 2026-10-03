# language: es

Característica: Registro de nuevos usuarios en la plataforma

  Escenario: Registrar un usuario de forma exitosa
    Dado que se cuenta con un nuevo usuario con nombre "Juan", apellido "Pérez", correo "juan.perez@example.com" y contraseña "password123"
    Cuando se envía la solicitud de registro al endpoint "/api/usuarios/registro"
    Entonces la respuesta HTTP del registro debe ser status 201
    Y el cuerpo de la respuesta debe contener el correo "juan.perez@example.com"

  Escenario: Intentar registrar un usuario con correo electrónico duplicado
    Dado que ya existe un usuario registrado con el correo "registrado@example.com"
    Y se cuenta con un nuevo usuario con nombre "Ana", apellido "Gómez", correo "registrado@example.com" y contraseña "password123"
    Cuando se envía la solicitud de registro al endpoint "/api/usuarios/registro"
    Entonces la respuesta HTTP del registro debe ser status 400
    Y el mensaje de error del registro debe indicar que el correo electrónico ya se encuentra registrado