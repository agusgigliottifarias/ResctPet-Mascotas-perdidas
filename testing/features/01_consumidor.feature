# language: es

Característica: Registro y acceso de consumidores

  Esquema del escenario: Registrar consumidor correctamente
    Cuando se registra el consumidor:
      | nombre   | email   | password   |
      | <nombre> | <email> | <password> |

    Entonces la respuesta debe ser:
      | status_code | status_text |
      | 200         | CREADO      |

    Y la respuesta contiene el consumidor:
      | nombre   | email   |
      | <nombre> | <email> |

    Ejemplos:
      | nombre         | email                        | password |
      | Ana Torres     | ana.torres.1301@cpl.test     | Ana#2025 |
      | Luis Martinez  | luis.martinez.1301@cpl.test  | Lm2025ok |

  Esquema del escenario: Rechazar registro inválido
    Cuando se registra el consumidor:
      | nombre   | email   | password   |
      | <nombre> | <email> | <password> |

    Entonces la respuesta debe ser:
      | status_code | status_text   |
      | 409         | <status_text> |

    Ejemplos:
      | nombre      | email                | password | status_text                   |
      |             | user.01@cpl.test     | Pass#25  | CONFLICTO - CAMPOS_REQUERIDOS |
      | Juan Perez  | juanmail.com         | Pass#25  | CONFLICTO - EMAIL_INVÁLIDO    |
      | Sofia Ruiz  | sofia.ruiz@cpl.test  | 1234     | CONFLICTO - PASSWORD_INSEGURA |
      | Pedro Diaz  |                      | Pass#25  | CONFLICTO - CAMPOS_REQUERIDOS |
      | Pedro Diaz  | pedro.diaz@cpl.test  |          | CONFLICTO - CAMPOS_REQUERIDOS |

  Escenario: Rechazar registro con email duplicado
    Dado el consumidor registrado:
      | nombre     | email                  | password |
      | Ana Torres | duplicado.01@cpl.test  | Ana#2025 |

    Cuando se registra el consumidor:
      | nombre       | email                  | password |
      | Ana Repetida | duplicado.01@cpl.test  | Ana#2025 |

    Entonces la respuesta debe ser:
      | status_code | status_text                 |
      | 409         | CONFLICTO - EMAIL_DUPLICADO |

  Esquema del escenario: Iniciar sesión correctamente
    Dado el consumidor registrado:
      | nombre   | email   | password   |
      | <nombre> | <email> | <password> |

    Cuando el consumidor inicia sesión:
      | email   | password   |
      | <email> | <password> |

    Entonces la respuesta debe ser:
      | status_code | status_text |
      | 200         | OK          |

    Y la respuesta contiene el consumidor:
      | nombre   | email   |
      | <nombre> | <email> |

    Ejemplos:
      | nombre     | email                 | password |
      | Ana Torres | login.ana.01@cpl.test | Ana#2025 |

  Esquema del escenario: Rechazar inicio de sesión
    Dado el consumidor registrado:
      | nombre   | email              | password              |
      | <nombre> | <email_registrado> | <password_registrado> |

    Cuando el consumidor inicia sesión:
      | email   | password   |
      | <email> | <password> |

    Entonces la respuesta debe ser:
      | status_code | status_text   |
      | 409         | <status_text> |

    Ejemplos:
      | nombre     | email_registrado       | password_registrado | email                  | password    | status_text                        |
      | Ana Torres | ana.login.01@cpl.test  | Ana#2025            | ana.login.01@cpl.test  | Incorrecta1 | CONFLICTO - CREDENCIALES_INVÁLIDAS |
      | Ana Torres | ana.login.02@cpl.test  | Ana#2025            | inexistente@cpl.test   | Algo#2025   | CONFLICTO - USUARIO_NO_ENCONTRADO  |
      | Ana Torres | ana.login.03@cpl.test  | Ana#2025            |                        | Ana#2025    | CONFLICTO - CAMPOS_REQUERIDOS      |
      | Ana Torres | ana.login.04@cpl.test  | Ana#2025            | ana.loginmail.com      | Ana#2025    | CONFLICTO - EMAIL_INVÁLIDO         |