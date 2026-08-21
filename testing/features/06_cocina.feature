# language: es

Característica: Gestión de cocina

  Antecedentes:
    Dado que el sistema CPL está operativo

  # ============================================================
  # 10_aceptar_pedido_entrante
  # ============================================================

  Esquema del escenario: Aceptar pedido entrante
    Dado que existe un pedido entrante creado para el consumidor "<email>"
    Y si corresponde el consumidor "<email>" paga el pedido entrante actual según "<requierePago>"
    Y si corresponde el restaurante acepta previamente el pedido entrante actual según "<aceptadoPreviamente>"
    Cuando el restaurante intenta aceptar el pedido entrante actual usando "<restaurante>" y tiempo "<tiempo>"
    Entonces la respuesta de aceptar pedido entrante debe ser:
      | status_code   | status_text   |
      | <status_code> | <status_text> |
    Y si la aceptación fue exitosa debe dejar:
      | estadoPedido   | codigoRestaurante   | estadoTicket   |
      | <estadoPedido> | <codigoRestaurante> | <estadoTicket> |
    Y si la aceptación fue exitosa debe tener tiempo comprometido
    Y si la aceptación fue exitosa no debe exponer ids internos

    Ejemplos:
      | email                       | requierePago | aceptadoPreviamente | restaurante | tiempo  | status_code | status_text                                      | estadoPedido | codigoRestaurante | estadoTicket |
      | aceptar.ok@cpl.test         | si           | no                  | R-1001      | valido  | 200         | OK                                               | APROBADO     | R-1001            | TOMADO       |
      | aceptar.otroresto@cpl.test  | si           | no                  | R-1002      | valido  | 409         | CONFLICTO - PEDIDO_NO_PERTENECE_AL_RESTAURANTE  |              |                   |              |
      | aceptar.noaprobado@cpl.test | no           | no                  | R-1001      | valido  | 409         | CONFLICTO - ESTADO_PEDIDO_NO_PERMITE_ACEPTACION |              |                   |              |
      | aceptar.tiempo@cpl.test     | si           | no                  | R-1001      | vencido | 409         | CONFLICTO - TIEMPO_COMPROMISO_INVALIDO          |              |                   |              |
      | aceptar.repetido@cpl.test   | si           | si                  | R-1001      | valido  | 409         | CONFLICTO - ESTADO_TICKET_NO_PERMITE_ACEPTACION |              |                   |              |

  Escenario: Rechazar aceptación si el pedido no existe
    Cuando el restaurante intenta aceptar el pedido entrante inexistente "O-99999999"
    Entonces la respuesta de aceptar pedido entrante debe ser:
      | status_code | status_text                      |
      | 409         | CONFLICTO - PEDIDO_NO_ENCONTRADO |

  # ============================================================
  # 11_administrar_ticket_cocina
  # ============================================================

  Escenario: Marcar listo un ticket en preparación
    Dado que existe un ticket en preparación para cocina del restaurante "R-1001"
    Cuando el restaurante "R-1001" marca listo el ticket
    Entonces la respuesta de ticket debe ser:
      | status_code | status_text  |
      | 200         | TICKET_LISTO |
    Y el ticket debe quedar en estado "LISTO"
    Y la respuesta del ticket debe contener listoPara
    Y la respuesta del ticket no debe exponer ids internos

  Escenario: Rechazar iniciar preparación de un ticket que ya está en preparación
    Dado que existe un ticket en preparación para cocina del restaurante "R-1001"
    Cuando el restaurante "R-1001" inicia la preparación del ticket
    Entonces la respuesta de ticket debe ser:
      | status_code | status_text           |
      | 200         | TICKET_EN_PREPARACION |
    Y la respuesta contiene idempotente true

  Escenario: Rechazar marcar listo un ticket que ya está listo
    Dado que existe un ticket listo para cocina del restaurante "R-1001"
    Cuando el restaurante "R-1001" marca listo el ticket
    Entonces la respuesta de ticket debe ser:
      | status_code | status_text  |
      | 200         | TICKET_LISTO |
    Y la respuesta contiene idempotente true

  Escenario: Rechazar operar un ticket desde restaurante inexistente
    Dado que existe un ticket en preparación para cocina del restaurante "R-1001"
    Cuando el restaurante "R-9999" inicia la preparación del ticket
    Entonces la respuesta de ticket debe ser:
      | status_code | status_text                           |
      | 409         | CONFLICTO - RESTAURANTE_NO_ENCONTRADO |

  Escenario: Rechazar operar un ticket inexistente
    Cuando el restaurante "R-1001" inicia la preparación del ticket "T-INEXISTENTE"
    Entonces la respuesta de ticket debe ser:
      | status_code | status_text                      |
      | 409         | CONFLICTO - TICKET_NO_ENCONTRADO |