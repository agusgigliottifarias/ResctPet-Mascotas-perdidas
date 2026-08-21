# language: es

Característica: Tracking de pedidos - Ver ruta y tiempo de arribo actualizado

  Antecedentes:
    Dado que el sistema CPL está operativo

  # ============================================================
  # 18_ver_ruta_y_tiempo_de_arribo_actualizado
  # ============================================================

  Escenario: Consultar tracking devuelve estado, ETA y ruta
    Dado que existe un pedido en trayecto con tracking para el consumidor "tracking.ok@cpl.test"
    Cuando el consumidor "tracking.ok@cpl.test" consulta el tracking del pedido actual
    Entonces la respuesta de tracking debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el tracking debe contener:
      | estadoEntrega | tieneEta | tieneRuta | tieneOrigen | tieneDestino |
      | EN_TRAYECTO   | true     | true      | true        | true         |
    Y el tracking debe contener distancia y duración estimada
    Y la respuesta de tracking no debe exponer datos sensibles del repartidor

  Escenario: Tracking con entrega asignada pendiente de aceptación
    Dado que existe un pedido asignado con tracking para el consumidor "tracking.sinrepartidor@cpl.test"
    Cuando el consumidor "tracking.sinrepartidor@cpl.test" consulta el tracking del pedido actual
    Entonces la respuesta de tracking debe ser:
      | status_code | status_text             |
      | 200         | OK - RUTA_NO_DISPONIBLE |
    Y el tracking debe contener:
      | estadoEntrega | tieneEta | tieneOrigen | tieneDestino |
      | ASIGNADA      | true     | true        | true         |

  Escenario: Rechazar tracking para pedido inexistente
    Cuando el consumidor "tracking.inexistente@cpl.test" consulta el tracking del pedido inexistente "O-99999999"
    Entonces la respuesta de tracking debe contener error:
      | status_code | status_text          |
      | 409         | PEDIDO_NO_ENCONTRADO |