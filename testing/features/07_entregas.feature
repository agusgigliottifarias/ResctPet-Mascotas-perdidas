# language: es

Característica: Gestión de entregas

  Antecedentes:
    Dado que el sistema CPL está operativo

  Escenario: Ver entrega asignada automáticamente
    Dado que existe un pedido listo para reparto
    Entonces la entrega debe quedar:
      | estado   |
      | ASIGNADA |
    Y la entrega debe tener ETA calculado
    Y la respuesta no debe exponer ids internos

  Escenario: Repartidor asignado acepta la entrega
    Dado que existe un pedido listo para reparto
    Cuando el repartidor asignado acepta la entrega del pedido actual
    Entonces la entrega debe quedar:
      | estado   |
      | ACEPTADA |

  Escenario: Rechazar doble aceptación
    Dado que existe un pedido asignado automáticamente
    Cuando el repartidor asignado acepta nuevamente la entrega del pedido actual
    Entonces la respuesta de reparto debe contener error:
      | status_code | status_text                              |
      | 409         | ENTREGA_NO_ESTA_PENDIENTE_DE_ACEPTACION |

  Escenario: Repartidor llega al local
    Dado que existe un pedido asignado automáticamente
    Cuando el repartidor asignado llega al local para retirar el pedido actual
    Entonces la entrega debe quedar:
      | estado   |
      | EN_LOCAL |

  Escenario: Repartidor retira pedido listo
    Dado que existe un pedido en local para el repartidor asignado
    Cuando el repartidor asignado retira el pedido actual
    Entonces la respuesta de reparto debe ser:
      | status_code | status_text     |
      | 200         | PEDIDO_RETIRADO |
    Y la entrega debe quedar:
      | estado      |
      | EN_TRAYECTO |
    Y la entrega debe tener ETA calculado

  Escenario: Repartidor entrega pedido correctamente
    Dado que existe un pedido en trayecto para el repartidor asignado
    Cuando el repartidor asignado entrega el pedido actual
    Entonces la entrega debe quedar:
      | estado    |
      | ENTREGADA |
    Y el pedido debe quedar:
      | estadoPedido |
      | ENTREGADO    |
    Y el historial debe quedar actualizado
    Y la respuesta no debe exponer ids internos

  Escenario: Rechazar entrega desde estado inválido
    Dado que existe un pedido asignado automáticamente
    Cuando el repartidor asignado entrega el pedido actual
    Entonces la respuesta de reparto debe contener error:
      | status_code | status_text                       |
      | 409         | ESTADO_ENTREGA_NO_PERMITE_ENTREGA |

  Escenario: Rechazar operación por repartidor no asignado
    Dado que existe un pedido asignado automáticamente
    Cuando otro repartidor intenta retirar el pedido actual
    Entonces la respuesta de reparto debe contener error:
      | status_code | status_text                     |
      | 409         | EL_REPARTIDOR_NO_ES_EL_ASIGNADO |

  Escenario: Marcar entrega como ENTREGADA concluye el pedido y libera al repartidor
    Dado que existe para tarjeta 13 un pedido en trayecto para el repartidor asignado
    Cuando el repartidor asignado marca como entregado el pedido de la tarjeta 13
    Entonces la respuesta de marcar entrega debe ser:
      | status_code | estadoEntrega | estadoPedido |
      | 200         | ENTREGADA     | ENTREGADO    |
    Y la entrega marcada debe tener fecha real de entrega
    Y el repartidor de la entrega marcada debe quedar disponible
    Y el honorario de la entrega marcada debe quedar liquidable
    Y el historial de la entrega marcada debe quedar actualizado
    Y la respuesta de marcar entrega no debe exponer ids internos

  Escenario: Rechazar marcar entregada desde ASIGNADA
    Dado que existe para tarjeta 13 un pedido asignado automáticamente
    Cuando el repartidor asignado marca como entregado el pedido de la tarjeta 13
    Entonces la respuesta de marcar entrega debe contener error:
      | status_code | status_text                       |
      | 409         | ESTADO_ENTREGA_NO_PERMITE_ENTREGA |

  Escenario: Rechazar marcar entregada desde EN_LOCAL
    Dado que existe para tarjeta 13 un pedido en local para el repartidor asignado
    Cuando el repartidor asignado marca como entregado el pedido de la tarjeta 13
    Entonces la respuesta de marcar entrega debe contener error:
      | status_code | status_text                       |
      | 409         | ESTADO_ENTREGA_NO_PERMITE_ENTREGA |

  Escenario: Rechazar reintento de marcar entrega ya finalizada
    Dado que existe para tarjeta 13 un pedido ya entregado por el repartidor asignado
    Cuando el repartidor asignado marca como entregado el pedido de la tarjeta 13
    Entonces la respuesta de marcar entrega debe contener error:
      | status_code | status_text           |
      | 409         | ENTREGA_YA_FINALIZADA |

  Escenario: Rechazar entrega si el repartidor no es el asignado
    Dado que existe para tarjeta 13 un pedido en trayecto para el repartidor asignado
    Cuando otro repartidor marca como entregado el pedido de la tarjeta 13
    Entonces la respuesta de marcar entrega debe contener error:
      | status_code | status_text                     |
      | 409         | EL_REPARTIDOR_NO_ES_EL_ASIGNADO |

  Escenario: Rechazar entrega si el pedido no existe
    Cuando el repartidor "D-100" marca como entregado un pedido inexistente para tarjeta 13
    Entonces la respuesta de marcar entrega debe contener error:
      | status_code | status_text          |
      | 409         | PEDIDO_NO_ENCONTRADO |

  Escenario: Calcular ETA inicial al asignar una entrega
    Dado que existe un pedido listo para reparto
    Entonces la entrega debe quedar:
      | estado   |
      | ASIGNADA |
    Y la entrega debe tener ETA calculado

  Escenario: Calcular ETA con fallback interno
    Dado que existe un pedido asignado automáticamente
    Y el servicio externo de ETA no está disponible
    Cuando se recalcula el ETA de la entrega actual
    Entonces la respuesta de ETA debe ser:
      | status_code | status_text       |
      | 200         | OK - ETA_FALLBACK |
    Y el ETA de la entrega debe estar calculado con método "FALLBACK_INTERNO"

  Escenario: Evitar recalculo inmediato por rate limit
    Dado que existe un pedido asignado automáticamente
    Cuando se recalcula inmediatamente el ETA de la entrega actual
    Entonces la respuesta de ETA debe ser:
      | status_code | status_text                       |
      | 200         | OK - SIN_RECALCULO_POR_RATE_LIMIT |

  Escenario: Rechazar cálculo de ETA en entrega entregada
    Dado que existe para tarjeta 17 un pedido ya entregado por el repartidor asignado
    Cuando se calcula el ETA de la entrega actual
    Entonces la respuesta de ETA debe contener error:
      | status_code | status_text                |
      | 409         | ETA_NO_APLICA_ESTADO_FINAL |

    # ============================================================
  # Notificaciones ETA integradas a Gestión de entregas
  # ============================================================

  Escenario: Notificar ETA inicial al asignar una entrega
    Y existe un pedido aprobado con entrega asignada para notificaciones ETA
    Dado que la entrega todavía no fue notificada
    Cuando se informa el primer tiempo estimado de llegada
    Entonces se emite una notificación ETA
    Y el mensaje indica que el repartidor fue asignado
    Y la notificación incluye el tiempo restante de llegada

  Escenario: No notificar un cambio menor al umbral configurado
    Y existe un pedido aprobado con entrega asignada para notificaciones ETA
    Dado que la entrega ya tenía un ETA informado
    Cuando el ETA cambia menos de 3 minutos
    Entonces no se emite una nueva notificación ETA
    Y la respuesta indica "OK - SIN_NOTIFICACION_POR_UMBRAL"

  Escenario: Notificar un cambio relevante del ETA
    Y existe un pedido aprobado con entrega asignada para notificaciones ETA
    Dado que la entrega ya tenía un ETA informado
    Cuando el ETA cambia 3 minutos o más
    Entonces se emite una notificación ETA
    Y la notificación incluye el nuevo tiempo estimado de llegada