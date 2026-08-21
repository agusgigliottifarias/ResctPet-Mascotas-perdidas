# language: es

Característica: Gestión de pedidos

  Antecedentes:
    Dado que el sistema CPL está operativo

  # -----------------------------------------
  # Crear pedido
  # -----------------------------------------

  Escenario: Recuperar menú con ítems disponibles para armar pedido
    Cuando se consulta el menú "M-2001" del restaurante "R-1001" para crear pedido
    Entonces la respuesta de menú para pedido debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y la respuesta de menú para pedido debe pertenecer al restaurante "R-1001"
    Y la respuesta de menú para pedido debe contener el ítem disponible "I-3001"

  Esquema del escenario: Crear pedido
    Dado que existe un consumidor activo para pedido con nombre "<nombre>", email "<email>" y password "<password>"
    Cuando se crea un pedido para el consumidor "<email>" en el restaurante "<restaurante>" con método de pago "<metodoPago>" y líneas:
      """
      <lineas>
      """
    Entonces la respuesta de pedido debe ser:
      | status_code   | status_text   |
      | <status_code> | <status_text> |
    Y si el pedido fue creado debe contener:
      | restaurante   | estadoPedido   | totalEsperado   | moneda   |
      | <restaurante> | <estadoPedido> | <totalEsperado> | <moneda> |

    Ejemplos:
      | nombre                | email                              | password | restaurante | metodoPago | lineas                                                                      | status_code | status_text                                | estadoPedido       | totalEsperado | moneda |
      | Ana Pedido 01         | pedido.ana.01@cpl.test             | Ana#2025 | R-1001      | EFECTIVO   | [{"codigoItem":"I-3001","cantidad":1,"adicionales":[]}]                     | 200         | CREADO                                     | CREACION_PENDIENTE | 12000         | ARS    |
      | Ana Pedido 02         | pedido.ana.02@cpl.test             | Ana#2025 | R-1001      | EFECTIVO   | [{"codigoItem":"I-3002","cantidad":2,"adicionales":[]}]                     | 200         | CREADO                                     | CREACION_PENDIENTE | 8600          | ARS    |
      | Ana Pedido 03         | pedido.ana.03@cpl.test             | Ana#2025 | R-1001      | EFECTIVO   | [{"codigoItem":"I-3001","cantidad":1,"adicionales":["A-0001"]}]             | 200         | CREADO                                     | CREACION_PENDIENTE | 12500         | ARS    |
      | Ana Pedido 04         | pedido.ana.04@cpl.test             | Ana#2025 | R-1001      | EFECTIVO   | [{"codigoItem":"I-3001","cantidad":1,"adicionales":["A-0002"]}]             | 200         | CREADO                                     | CREACION_PENDIENTE | 12800         | ARS    |
      | Ana Pedido 05         | pedido.ana.05@cpl.test             | Ana#2025 | R-1001      | EFECTIVO   | [{"codigoItem":"I-3001","cantidad":1},{"codigoItem":"I-3002","cantidad":1}] | 200         | CREADO                                     | CREACION_PENDIENTE | 16300         | ARS    |
      | Pedido Sin Items      | pedido.sin.items@cpl.test          | Ana#2025 | R-1001      | EFECTIVO   | []                                                                         | 409         | CONFLICTO - PEDIDO_SIN_ITEMS              |              |               |        |
      | Cantidad Cero         | pedido.cantidad.cero@cpl.test      | Ana#2025 | R-1001      | EFECTIVO   | [{"codigoItem":"I-3001","cantidad":0}]                                     | 409         | CONFLICTO - CANTIDAD_INVALIDA             |              |               |        |
      | Cantidad Negativa     | pedido.cantidad.negativa@cpl.test  | Ana#2025 | R-1001      | EFECTIVO   | [{"codigoItem":"I-3001","cantidad":-1}]                                    | 409         | CONFLICTO - CANTIDAD_INVALIDA             |              |               |        |
      | Item Inexistente      | pedido.item.inexistente@cpl.test   | Ana#2025 | R-1001      | EFECTIVO   | [{"codigoItem":"I-9999","cantidad":1}]                                     | 409         | CONFLICTO - ITEM_NO_ENCONTRADO_EN_MENU    |              |               |        |
      | Item Otro Restaurante | pedido.item.otro@cpl.test          | Ana#2025 | R-1002      | EFECTIVO   | [{"codigoItem":"I-3001","cantidad":1}]                                     | 409         | CONFLICTO - ITEM_NO_ENCONTRADO_EN_MENU    |              |               |        |
      | Restaurante Cerrado   | pedido.resto.cerrado@cpl.test      | Ana#2025 | R-1003      | EFECTIVO   | [{"codigoItem":"I-3004","cantidad":1}]                                     | 409         | CONFLICTO - RESTAURANTE_NO_ACEPTA_PEDIDOS |              |               |        |

  # -----------------------------------------
  # Cancelar pedido
  # -----------------------------------------

  Esquema del escenario: Cancelar pedido permitido
    Dado que existe un pedido del consumidor "<email>" en estado "<estadoPedido>"
    Cuando el consumidor "<email>" cancela el pedido con motivo "<motivo>"
    Entonces la respuesta de cancelación debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y la cancelación debe dejar el pedido:
      | estadoPedido | motivo   |
      | CANCELADO    | <motivo> |
    Y la respuesta de cancelación no debe exponer ids internos

    Ejemplos:
      | email                     | estadoPedido       | motivo                |
      | cancela.creacion@cpl.test | CREACION_PENDIENTE | Me equivoqué al pedir |
      | cancela.aprobado@cpl.test | APROBADO           | No voy a estar en casa |

  Esquema del escenario: Rechazar cancelación si el pedido ya avanzó en cocina
    Dado que existe un pedido del consumidor "<email>" con ticket en estado "<estadoTicket>"
    Cuando el consumidor "<email>" cancela el pedido con motivo "Ya no lo quiero"
    Entonces la respuesta de cancelación debe ser:
      | status_code | status_text                          |
      | 409         | CONFLICTO - PEDIDO_YA_EN_PREPARACION |

    Ejemplos:
      | email                        | estadoTicket   |
      | cancela.preparacion@cpl.test | EN_PREPARACION |
      | cancela.listo@cpl.test       | LISTO          |

  Escenario: Rechazar cancelación de pedido inexistente
    Dado que existe el consumidor de cancelación "cancelacion.inexistente@cpl.test"
    Cuando el consumidor "cancelacion.inexistente@cpl.test" intenta cancelar un pedido inexistente
    Entonces la respuesta de cancelación debe ser:
      | status_code | status_text                      |
      | 409         | CONFLICTO - PEDIDO_NO_ENCONTRADO |

  Escenario: Rechazar cancelación si el pedido pertenece a otro consumidor
    Dado que existe un pedido del consumidor "cancelacion.duenio@cpl.test" en estado "CREACION_PENDIENTE"
    Cuando el consumidor "cancelacion.otro@cpl.test" intenta cancelar el pedido actual
    Entonces la respuesta de cancelación debe ser:
      | status_code | status_text                                   |
      | 409         | CONFLICTO - PEDIDO_NO_PERTENECE_AL_CONSUMIDOR |

  Escenario: Rechazar cancelación repetida
    Dado que existe un pedido del consumidor "cancelacion.repetida@cpl.test" en estado "CREACION_PENDIENTE"
    Y el consumidor "cancelacion.repetida@cpl.test" canceló el pedido actual
    Cuando el consumidor "cancelacion.repetida@cpl.test" cancela el pedido con motivo "Reintento"
    Entonces la respuesta de cancelación debe ser:
      | status_code | status_text                     |
      | 409         | CONFLICTO - PEDIDO_YA_CANCELADO |

  # -----------------------------------------
  # Ver pedido
  # -----------------------------------------

  Escenario: Ver pedido recién creado
    Dado que existe un pedido visible creado para el consumidor "pedido.visible.creado@cpl.test"
    Cuando el consumidor "pedido.visible.creado@cpl.test" consulta el pedido visible actual
    Entonces la respuesta de ver pedido debe ser:
      | status_code | status_text                                   |
      | 200         | OK - SIN_ESTIMACION - SIN_REPARTIDOR_ASIGNADO |
    Y la respuesta de ver pedido debe contener:
      | estadoPedido       | codigoRestaurante | moneda | ticketEstado | entregaEstado | repartidor | tiempoEstimado |
      | CREACION_PENDIENTE | R-1001            | ARS    |              |               | no         | no             |
    Y la respuesta de ver pedido no debe exponer ids internos

  Escenario: Ver pedido aprobado
    Dado que existe un pedido visible creado para el consumidor "pedido.visible.aprobado@cpl.test"
    Y el consumidor "pedido.visible.aprobado@cpl.test" paga el pedido visible actual
    Cuando el consumidor "pedido.visible.aprobado@cpl.test" consulta el pedido visible actual
    Entonces la respuesta de ver pedido debe ser:
      | status_code | status_text                  |
      | 200         | OK - SIN_REPARTIDOR_ASIGNADO |
    Y la respuesta de ver pedido debe contener:
      | estadoPedido | codigoRestaurante | moneda | ticketEstado | entregaEstado | repartidor | tiempoEstimado |
      | APROBADO     | R-1001            | ARS    | ACEPTADO     |               | no         | no             |
    Y la respuesta de ver pedido no debe exponer ids internos

  Escenario: Ver pedido listo para entrega
    Dado que existe un pedido visible creado para el consumidor "pedido.visible.listo@cpl.test"
    Y el consumidor "pedido.visible.listo@cpl.test" paga el pedido visible actual
    Y el restaurante acepta el pedido visible actual
    Y el restaurante marca el pedido visible actual como listo
    Cuando el consumidor "pedido.visible.listo@cpl.test" consulta el pedido visible actual
    Entonces la respuesta de ver pedido debe ser:
      | status_code | status_text                  |
      | 200         | OK - SIN_REPARTIDOR_ASIGNADO |
    Y la respuesta de ver pedido debe contener:
      | estadoPedido | codigoRestaurante | moneda | ticketEstado | entregaEstado | repartidor | tiempoEstimado |
      | APROBADO     | R-1001            | ARS    | LISTO        | ASIGNADA      | no         | si             |
    Y la respuesta de ver pedido no debe exponer ids internos

  Escenario: Ver pedido con repartidor asignado
    Dado que existe un pedido visible creado para el consumidor "pedido.visible.repartidor@cpl.test"
    Y el consumidor "pedido.visible.repartidor@cpl.test" paga el pedido visible actual
    Y el restaurante acepta el pedido visible actual
    Y el restaurante marca el pedido visible actual como listo
    Cuando el consumidor "pedido.visible.repartidor@cpl.test" consulta el pedido visible actual
    Entonces la respuesta de ver pedido debe ser:
      | status_code | status_text                  |
      | 200         | OK - SIN_REPARTIDOR_ASIGNADO |
    Y la respuesta de ver pedido debe contener:
      | estadoPedido | codigoRestaurante | moneda | ticketEstado | entregaEstado | repartidor | tiempoEstimado |
      | APROBADO     | R-1001            | ARS    | LISTO        | ASIGNADA      | no         | si             |
    Y la respuesta de ver pedido no debe exponer ids internos

  Escenario: Rechazar consulta de pedido inexistente
    Dado que existe el consumidor visible "pedido.visible.inexistente@cpl.test"
    Cuando el consumidor "pedido.visible.inexistente@cpl.test" consulta el pedido visible inexistente "P-999999"
    Entonces la respuesta de ver pedido debe ser:
      | status_code | status_text                                   |
      | 409         | CONFLICTO - PEDIDO_NO_PERTENECE_AL_CONSUMIDOR |

  # -----------------------------------------
  # Ver historial
  # -----------------------------------------

  Escenario: Ver historial paginado del consumidor
    Dado que existe para tarjeta 14 un consumidor con pedidos en historial
    Cuando el consumidor de la tarjeta 14 consulta su historial de pedidos
    Entonces la respuesta de historial debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el historial debe contener metadatos de paginación
    Y el historial debe contener el pedido de la tarjeta 14
    Y la respuesta de historial no debe exponer ids internos

  Escenario: Ver historial vacío de consumidor sin pedidos
    Dado que existe para tarjeta 14 un consumidor sin pedidos
    Cuando el consumidor de la tarjeta 14 consulta su historial de pedidos
    Entonces la respuesta de historial debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el historial debe estar vacío

  Escenario: Filtrar historial por estado
    Dado que existe para tarjeta 14 un pedido recibido en historial
    Cuando el consumidor de la tarjeta 14 consulta su historial filtrando por estado "RECIBIDO"
    Entonces la respuesta de historial debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y todos los pedidos del historial deben tener estado "RECIBIDO"

  Escenario: Rechazar filtro de estado inválido
    Dado que existe para tarjeta 14 un consumidor con pedidos en historial
    Cuando el consumidor de la tarjeta 14 consulta su historial filtrando por estado "NO_EXISTE"
    Entonces la respuesta de historial debe contener error:
      | status_code | status_text            |
      | 409         | FILTRO_ESTADO_INVALIDO |

  Escenario: Rechazar rango de fechas inválido
    Dado que existe para tarjeta 14 un consumidor con pedidos en historial
    Cuando el consumidor de la tarjeta 14 consulta su historial con rango inválido
    Entonces la respuesta de historial debe contener error:
      | status_code | status_text           |
      | 409         | RANGO_FECHAS_INVALIDO |