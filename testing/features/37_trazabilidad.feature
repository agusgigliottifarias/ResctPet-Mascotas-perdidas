# language: es

Característica: Trazabilidad completa del pedido

  Como sistema
  quiero registrar y consultar eventos de trazabilidad de un pedido
  para reconstruir su historial y auditar los cambios importantes.

  Antecedentes:
    Dado que el sistema CPL está operativo

  Escenario: Registrar evento de trazabilidad de un pedido
    Cuando se registra el evento de trazabilidad:
      | eventId   | eventType    | idPedido | timestamp             | actorTipo  | payload                         |
      | EV-37001  | PedidoCreado | O-9001   | 2026-02-09T20:00:00Z  | CONSUMIDOR | { "total": 5500, "moneda": "ARS" } |
    Entonces la respuesta de trazabilidad debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y la respuesta contiene el evento de trazabilidad:
      | idPedido | eventId  | idempotente |
      | O-9001   | EV-37001 | false       |

  Escenario: Consultar timeline de trazabilidad de un pedido
    Dado que se registró el evento de trazabilidad:
      | eventId   | eventType       | idPedido | timestamp             | actorTipo | payload              |
      | EV-37002  | TicketListo     | O-9001   | 2026-02-09T20:15:00Z  | COCINA    | { "idTicket": "T-9001" } |
    Cuando se consulta la trazabilidad del pedido "O-9001"
    Entonces la respuesta de trazabilidad debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el timeline contiene el evento:
      | eventId  | eventType   | idPedido |
      | EV-37002 | TicketListo | O-9001   |

  Escenario: Reprocesar el mismo eventId no duplica el evento
    Dado que se registró el evento de trazabilidad:
      | eventId   | eventType             | idPedido | timestamp             | actorTipo | payload                  |
      | EV-37003  | TicketEnPreparacion   | O-9001   | 2026-02-09T20:05:00Z  | COCINA    | { "idTicket": "T-9001" } |
    Cuando se registra nuevamente el evento de trazabilidad:
      | eventId   | eventType             | idPedido | timestamp             | actorTipo | payload                  |
      | EV-37003  | TicketEnPreparacion   | O-9001   | 2026-02-09T20:05:00Z  | COCINA    | { "idTicket": "T-9001" } |
    Entonces la respuesta de trazabilidad debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y la respuesta contiene el evento de trazabilidad:
      | idPedido | eventId  | idempotente |
      | O-9001   | EV-37003 | true        |