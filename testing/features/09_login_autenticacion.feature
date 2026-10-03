# language: es

Característica: Inicio de sesión y autenticación de usuarios

  Escenario: Iniciar sesión correctamente
    Dado que existe un usuario registrado para iniciar sesión
    Cuando se envían las credenciales correctas al endpoint "/api/usuarios/login"
    Entonces la respuesta HTTP del login debe ser status 200
    Y el mensaje de respuesta debe ser "Autenticación exitosa"
    Y la respuesta debe contener un token de autenticación

  Escenario: Intentar iniciar sesión con contraseña incorrecta
    Dado que existe un usuario registrado para iniciar sesión
    Cuando se envía una contraseña incorrecta al endpoint "/api/usuarios/login"
    Entonces la respuesta HTTP del login debe ser status 401
    Y el mensaje de error del login debe ser "Credenciales inválidas"

  Escenario: Intentar iniciar sesión con un correo inexistente
    Dado que existe un usuario registrado para iniciar sesión
    Cuando se envía un correo inexistente al endpoint "/api/usuarios/login"
    Entonces la respuesta HTTP del login debe ser status 401
    Y el mensaje de error del login debe ser "Credenciales inválidas"

  Escenario: Intentar iniciar sesión sin correo electrónico
    Dado que existe un usuario registrado para iniciar sesión
    Cuando se envía una solicitud de login sin correo electrónico
    Entonces la respuesta HTTP del login debe ser status 401
    Y el mensaje de error del login debe ser "El correo electrónico es obligatorio"

  Escenario: Intentar iniciar sesión sin contraseña
    Dado que existe un usuario registrado para iniciar sesión
    Cuando se envía una solicitud de login sin contraseña
    Entonces la respuesta HTTP del login debe ser status 401
    Y el mensaje de error del login debe ser "La contraseña es obligatoria"