# language: es

Característica: Gestión de estados y eventos de tickets

  Antecedentes:
    Dado que el sistema CPL está operativo

  Escenario: Cambiar ticket a preparación correctamente
    Dado que existe un ticket tomado para el restaurante "R-1001"
    Cuando el restaurante cambia el ticket actual a estado "EN_PREPARACION"
    Entonces la respuesta de tickets debe ser:
      | status_code | status_text            |
      | 200         | PEDIDO_EN_PREPARACION  |
    Y el ticket actual debe quedar:
      | estadoTicket   | 
      | EN_PREPARACION | 
    Y la respuesta de ticket no debe exponer ids internos

  Escenario: Cambiar ticket a listo correctamente
    Dado que existe un ticket en preparación para el restaurante "R-1001"
    Cuando el restaurante cambia el ticket actual a estado "LISTO"
    Entonces la respuesta de tickets debe ser:
      | status_code | status_text   |
      | 200         | PEDIDO_LISTO  |
    Y el ticket actual debe quedar:
      | estadoTicket | 
      | LISTO        | 
    Y la respuesta de ticket no debe exponer ids internos

  Escenario: Rechazar transición inválida de ticket
    Dado que existe un ticket tomado para el restaurante "R-1001"
    Cuando el restaurante cambia el ticket actual a estado "LISTO"
    Entonces la respuesta de tickets debe ser:
      | status_code | status_text                                |
      | 409         | CONFLICTO - INICIO_PREPARACION_INEXISTENTE |

  Escenario: Rechazar transición repetida a preparación
    Dado que existe un ticket en preparación para el restaurante "R-1001"
    Cuando el restaurante cambia nuevamente el ticket actual a estado "EN_PREPARACION"
    Entonces la respuesta de tickets debe ser:
      | status_code | status_text              |
      | 200         | PEDIDO_EN_PREPARACION    |
    Y la respuesta de tickets contiene idempotente true

  Escenario: Anular ticket correctamente
    Dado que existe un ticket tomado para el restaurante "R-1001"
    Cuando el restaurante anula el ticket actual por motivo "SIN_STOCK"
    Entonces la respuesta de tickets debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el ticket actual debe quedar:
      | estadoTicket | motivo     | idempotente |
      | ANULADO      | SIN_STOCK  | false       |

  Escenario: Ignorar evento desconocido de ticket
    Dado que existe un ticket tomado para el restaurante "R-1001"
    Cuando se procesa un evento de ticket desconocido "EventoInventado"
    Entonces la respuesta de tickets debe ser:
      | status_code | status_text                             |
      | 409         | CONFLICTO - EVENTO_DESCONOCIDO_IGNORADO |