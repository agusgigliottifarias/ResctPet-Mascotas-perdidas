# language: es

Característica: Restaurante / Cocina - Registro de tiempos de preparación

  Antecedentes:
    Dado que el sistema CPL está operativo

  Escenario: Registrar inicio de preparación correctamente
    Dado que existe un pedido aprobado "O-7001" del restaurante "R-1001"
    Y existe un ticket "T-7001" asociado al pedido "O-7001" en estado "TOMADO"

    Cuando se cambia el estado del ticket "T-7001":
      | nuevoEstado    |
      | EN_PREPARACION |

    Entonces la respuesta de tiempos de preparación debe ser:
      | status_code | status_text           |
      | 200         | PEDIDO_EN_PREPARACION |

    Y el ticket de tiempos debe quedar en estado "EN_PREPARACION"
    Y el ticket debe tener inicioPreparacion

  Escenario: Registrar ticket listo y calcular duración
    Dado que existe un pedido aprobado "O-7002" del restaurante "R-1001"
    Y existe un ticket "T-7002" asociado al pedido "O-7002" en estado "EN_PREPARACION"
    Y el ticket "T-7002" tiene inicioPreparacion cargado

    Cuando se cambia el estado del ticket "T-7002":
      | nuevoEstado |
      | LISTO       |

    Entonces la respuesta de tiempos de preparación debe ser:
      | status_code | status_text    |
      | 200         | PEDIDO_LISTO   |

    Y el ticket de tiempos debe quedar en estado "LISTO"
    Y el ticket debe tener finPreparacion
    Y el ticket debe tener duracionPreparacionSegundos

  Escenario: Marcar EN_PREPARACION dos veces es idempotente
    Dado que existe un pedido aprobado "O-7003" del restaurante "R-1001"
    Y existe un ticket "T-7003" asociado al pedido "O-7003" en estado "EN_PREPARACION"
    Y el ticket "T-7003" tiene inicioPreparacion cargado

    Cuando se cambia el estado del ticket "T-7003":
      | nuevoEstado    |
      | EN_PREPARACION |

    Entonces la respuesta de tiempos de preparación debe ser:
      | status_code | status_text            |
      | 200         | PEDIDO_EN_PREPARACION  |

    Y la respuesta del ticket debe contener idempotente true

  Escenario: Marcar LISTO dos veces es idempotente
    Dado que existe un pedido aprobado "O-7004" del restaurante "R-1001"
    Y existe un ticket "T-7004" asociado al pedido "O-7004" en estado "LISTO"
    Y el ticket "T-7004" tiene finPreparacion cargado

    Cuando se cambia el estado del ticket "T-7004":
      | nuevoEstado |
      | LISTO       |

    Entonces la respuesta de tiempos de preparación debe ser:
      | status_code | status_text  |
      | 200         | PEDIDO_LISTO |

    Y la respuesta del ticket debe contener idempotente true

  Escenario: Rechazar ticket listo sin inicio de preparación
    Dado que existe un pedido aprobado "O-7005" del restaurante "R-1001"
    Y existe un ticket "T-7005" asociado al pedido "O-7005" en estado "TOMADO"

    Cuando se cambia el estado del ticket "T-7005":
      | nuevoEstado |
      | LISTO       |

    Entonces la respuesta de tiempos de preparación debe ser:
      | status_code | status_text                                |
      | 409         | CONFLICTO - INICIO_PREPARACION_INEXISTENTE |

  Escenario: Rechazar transición de ticket anulado
    Dado que existe un pedido aprobado "O-7006" del restaurante "R-1001"
    Y existe un ticket "T-7006" asociado al pedido "O-7006" en estado "ANULADO"

    Cuando se cambia el estado del ticket "T-7006":
      | nuevoEstado    |
      | EN_PREPARACION |

    Entonces la respuesta de tiempos de preparación debe ser:
      | status_code | status_text                                           |
      | 409         | CONFLICTO - ESTADO_PEDIDO_NO_PERMITE_OPERACION_COCINA |

  Escenario: Consultar tiempos de preparación por rango
    Dado que existen tickets listos con duración registrada para el restaurante "R-1001"

    Cuando se consultan tiempos de preparación:
      | restaurante | desde                | hasta                | page | size |
      | R-1001      | 2026-02-01T00:00:00Z | 2026-02-10T00:00:00Z | 0    | 20   |

    Entonces la respuesta de tiempos de preparación debe ser:
      | status_code | status_text |
      | 200         | OK          |

    Y la respuesta debe contener una lista de tiempos de preparación

  Escenario: Rechazar consulta con rango inválido
    Cuando se consultan tiempos de preparación:
      | restaurante | desde                | hasta                | page | size |
      | R-1001      | 2026-02-10T00:00:00Z | 2026-02-01T00:00:00Z | 0    | 20   |

    Entonces la respuesta de tiempos de preparación debe ser:
      | status_code | status_text                       |
      | 409         | CONFLICTO - RANGO_FECHAS_INVALIDO |