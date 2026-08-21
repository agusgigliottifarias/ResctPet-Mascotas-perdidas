# language: es

Característica: Gestión de pagos

  Antecedentes:
    Dado que el sistema CPL está operativo

  # ============================================================
  # 07_pagar_pedido
  # ============================================================

  Esquema del escenario: Procesar pago de pedido correctamente
    Dado que existe un pedido pagable del consumidor "<email>"
    Cuando el consumidor "<email>" paga el pedido actual con acción "<accion>" y método "<metodo>"
    Entonces la respuesta de pago debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el pago debe quedar:
      | estadoPago   | estadoPedido   | metodo   |
      | <estadoPago> | <estadoPedido> | <metodo> |
    Y si el pago fue capturado debe contener splits consistentes
    Y la respuesta de pago no debe exponer ids internos

    Ejemplos:
      | email                  | accion    | metodo       | estadoPago | estadoPedido       |
      | pago.captura@cpl.test  | CAPTURAR  | TARJETA_VISA | CAPTURADO  | APROBADO           |
      | pago.autoriza@cpl.test | AUTORIZAR | WALLET_CPL   | AUTORIZADO | CREACION_PENDIENTE |

  Esquema del escenario: Rechazar pago inválido
    Dado que existe un pedido pagable del consumidor "<email>"
    Cuando el consumidor "<email>" intenta pagar el pedido actual con:
      | monto   | moneda   | metodo   | accion   |
      | <monto> | <moneda> | <metodo> | CAPTURAR |
    Entonces la respuesta de pago debe ser:
      | status_code | status_text   |
      | 409         | <status_text> |

    Ejemplos:
      | email                     | monto | moneda | metodo              | status_text                            |
      | pago.monto.cero@cpl.test  | 0     | ARS    | TARJETA_VISA        | CONFLICTO - MONTO_INVALIDO            |
      | pago.moneda.error@cpl.test| 12000 | USD    | TARJETA_VISA        | CONFLICTO - MONEDA_NO_COINCIDE        |
      | pago.monto.error@cpl.test | 9999  | ARS    | TARJETA_VISA        | CONFLICTO - MONTO_NO_COINCIDE_CON_TOTAL |
      | pago.metodo.error@cpl.test| 12000 | ARS    | CRIPTO_NO_SOPORTADO | CONFLICTO - METODO_PAGO_NO_SOPORTADO  |

  Escenario: Rechazar pago de pedido inexistente
    Dado que existe el consumidor para pago "pago.inexistente@cpl.test"
    Cuando el consumidor "pago.inexistente@cpl.test" intenta pagar el pedido inexistente "O-99999999"
    Entonces la respuesta de pago debe ser:
      | status_code | status_text                       |
      | 409         | CONFLICTO - PEDIDO_NO_ENCONTRADO |

  Escenario: Rechazar pago si el pedido pertenece a otro consumidor
    Dado que existe un pedido pagable del consumidor "pago.duenio@cpl.test"
    Y que existe el consumidor para pago "pago.otro@cpl.test"
    Cuando el consumidor "pago.otro@cpl.test" paga el pedido actual con acción "CAPTURAR" y método "TARJETA_VISA"
    Entonces la respuesta de pago debe ser:
      | status_code | status_text                                    |
      | 409         | CONFLICTO - PEDIDO_NO_PERTENECE_AL_CONSUMIDOR |

  Escenario: Rechazar pago duplicado
    Dado que existe un pedido pagable del consumidor "pago.duplicado@cpl.test"
    Y el consumidor "pago.duplicado@cpl.test" ya pagó el pedido actual
    Cuando el consumidor "pago.duplicado@cpl.test" paga el pedido actual con acción "CAPTURAR" y método "TARJETA_VISA"
    Entonces la respuesta de pago debe ser:
      | status_code | status_text                           |
      | 409         | CONFLICTO - PAGO_DUPLICADO_POR_PEDIDO |

  Escenario: Consultar pago capturado
    Dado que existe un pago capturado del consumidor "pago.consulta@cpl.test"
    Cuando se consulta el pago actual
    Entonces la respuesta de pago debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el pago debe quedar:
      | estadoPago | estadoPedido | metodo       |
      | CAPTURADO  | APROBADO     | TARJETA_VISA |
    Y si el pago fue capturado debe contener splits consistentes
    Y la respuesta de pago no debe exponer ids internos

  # ============================================================
  # 08_registrar_pago_aprobar_pedido
  # ============================================================

  Esquema del escenario: Capturar pago aprueba pedido y genera historial
    Dado que existe un pedido pendiente de aprobación por pago del consumidor "<email>"
    Cuando el consumidor "<email>" registra el pago del pedido pendiente con acción "<accion>" y método "<metodo>"
    Entonces la respuesta de registrar pago debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el registro de pago debe quedar:
      | estadoPago   | estadoPedido   | metodo   |
      | <estadoPago> | <estadoPedido> | <metodo> |
    Y el pago capturado debe contener splits consistentes
    Y el pedido aprobado debe aparecer en el historial del consumidor "<email>"
    Y la respuesta de registrar pago no debe exponer ids internos

    Ejemplos:
      | email           | accion   | metodo       | estadoPago | estadoPedido |
      | pago08@cpl.test | CAPTURAR | TARJETA_VISA | CAPTURADO  | APROBADO     |

  Esquema del escenario: Rechazar captura por monto o moneda inconsistente
    Dado que existe un pedido pendiente de aprobación por pago del consumidor "<email>"
    Cuando el consumidor "<email>" intenta registrar el pago del pedido pendiente con:
      | monto       | moneda       | accion   | metodo       |
      | <montoPago> | <monedaPago> | CAPTURAR | TARJETA_VISA |
    Entonces la respuesta de registrar pago debe ser:
      | status_code | status_text   |
      | 409         | <status_text> |

    Ejemplos:
      | email                 | montoPago | monedaPago | status_text                            |
      | pago08.monto@cpl.test | 5000      | ARS        | CONFLICTO - MONTO_NO_COINCIDE_CON_TOTAL |
      | pago08.moneda@cpl.test| 5500      | USD        | CONFLICTO - MONEDA_NO_COINCIDE        |

  Esquema del escenario: Rechazar pago por proveedor
    Dado que existe un pedido pendiente de aprobación por pago del consumidor "<email>"
    Cuando el consumidor "<email>" registra el pago del pedido pendiente forzando resultado de proveedor "<resultadoProveedor>"
    Entonces la respuesta de registrar pago debe ser:
      | status_code | status_text   |
      | 409         | <status_text> |
    Y el pedido pendiente debe quedar en estado "RECHAZADO"

    Ejemplos:
      | email                    | resultadoProveedor | status_text                      |
      | pago08.rechazado@cpl.test| RECHAZADO          | CONFLICTO - PAGO_RECHAZADO       |
      | pago08.error@cpl.test    | ERROR              | CONFLICTO - ERROR_PROVEEDOR_PAGO |

  Escenario: Rechazar pago duplicado para un pedido ya capturado
    Dado que existe un pedido pendiente de aprobación por pago del consumidor "pago08.duplicado@cpl.test"
    Y el consumidor "pago08.duplicado@cpl.test" ya registró el pago capturado del pedido pendiente
    Cuando el consumidor "pago08.duplicado@cpl.test" registra nuevamente el pago del pedido pendiente con acción "CAPTURAR" y método "TARJETA_VISA"
    Entonces la respuesta de registrar pago debe ser:
      | status_code | status_text                           |
      | 409         | CONFLICTO - PAGO_DUPLICADO_POR_PEDIDO |

  Escenario: Rechazar aprobación si ya existe ticket para el pedido
    Dado que existe un pedido pendiente de aprobación por pago del consumidor "pago08.ticket@cpl.test"
    Y ya existe un ticket de cocina para el pedido pendiente
    Cuando el consumidor "pago08.ticket@cpl.test" registra el pago del pedido pendiente con acción "CAPTURAR" y método "TARJETA_VISA"
    Entonces la respuesta de registrar pago debe ser:
      | status_code | status_text                             |
      | 409         | CONFLICTO - TICKET_DUPLICADO_POR_PEDIDO |

  Escenario: Si falla la generación del ticket no se consolida la aprobación
    Dado que existe un pedido pendiente de aprobación por pago del consumidor "pago08.rollback@cpl.test"
    Cuando el consumidor "pago08.rollback@cpl.test" registra el pago del pedido pendiente forzando error al generar ticket
    Entonces la respuesta de registrar pago debe ser:
      | status_code | status_text                        |
      | 409         | CONFLICTO - ERROR_GENERANDO_TICKET |
    Y el pedido pendiente debe quedar en estado "CREACION_PENDIENTE"

  # ============================================================
  # 09_rechazar_pedido_pago
  # ============================================================

  Esquema del escenario: Rechazar pedido cuando el proveedor rechaza el pago
    Dado que existe un pedido pagable para rechazo de pago del consumidor "<email>"
    Cuando el consumidor "<email>" intenta pagar el pedido pagable forzando rechazo con:
      | metodo   | codigoMotivo   | detalleMotivo   |
      | <metodo> | <codigoMotivo> | <detalleMotivo> |
    Entonces la respuesta de rechazo de pago debe ser:
      | status_code | status_text                |
      | 409         | CONFLICTO - PAGO_RECHAZADO |
    Y el rechazo de pago debe quedar:
      | estadoPago | estadoPedido | motivoRechazo | sugerencia                         |
      | RECHAZADO  | RECHAZADO    | PAGO_FALLIDO  | Reintentar cambiando medio de pago |
    Y el pedido rechazado por pago debe poder consultarse con motivo "PAGO_FALLIDO"
    Y la respuesta de rechazo de pago no debe exponer ids internos

    Ejemplos:
      | email                      | metodo       | codigoMotivo         | detalleMotivo        |
      | pago09.tarjeta@cpl.test     | TARJETA_VISA | TARJETA_INVALIDA     | Tarjeta inválida     |
      | pago09.fondos@cpl.test      | TARJETA_VISA | FONDOS_INSUFICIENTES | Fondos insuficientes |
      | pago09.mercadopago@cpl.test | MERCADOPAGO  | CUENTA_BLOQUEADA     | Cuenta bloqueada     |

  Esquema del escenario: Rechazar pedido por error técnico del proveedor de pago
    Dado que existe un pedido pagable para rechazo de pago del consumidor "<email>"
    Cuando el consumidor "<email>" intenta pagar el pedido pagable forzando error de proveedor con:
      | metodo   | detalleMotivo   |
      | <metodo> | <detalleMotivo> |
    Entonces la respuesta de rechazo de pago debe ser:
      | status_code | status_text                      |
      | 409         | CONFLICTO - ERROR_PROVEEDOR_PAGO |
    Y el rechazo de pago debe quedar:
      | estadoPago | estadoPedido | motivoRechazo | sugerencia                         |
      | RECHAZADO  | RECHAZADO    | PAGO_FALLIDO  | Reintentar cambiando medio de pago |
    Y el pedido rechazado por pago debe poder consultarse con motivo "PAGO_FALLIDO"

    Ejemplos:
      | email                         | metodo       | detalleMotivo              |
      | pago09.timeout@cpl.test        | TARJETA_VISA | Timeout del gateway         |
      | pago09.errorproveedor@cpl.test | MERCADOPAGO  | Error interno del proveedor |

  Escenario: Si falla el pago no se genera ticket ni entrega
    Dado que existe un pedido pagable para rechazo de pago del consumidor "pago09.sin.ticket@cpl.test"
    Cuando el consumidor "pago09.sin.ticket@cpl.test" intenta pagar el pedido pagable forzando rechazo con:
      | metodo       | codigoMotivo         | detalleMotivo        |
      | TARJETA_VISA | FONDOS_INSUFICIENTES | Fondos insuficientes |
    Entonces la respuesta de rechazo de pago debe ser:
      | status_code | status_text                |
      | 409         | CONFLICTO - PAGO_RECHAZADO |
    Y no debe existir ticket de cocina para el pedido rechazado por pago
    Y no debe existir entrega para el pedido rechazado por pago

  Escenario: El historial del consumidor refleja el pedido rechazado por pago fallido
    Dado que existe un pedido pagable para rechazo de pago del consumidor "pago09.historial@cpl.test"
    Y el consumidor "pago09.historial@cpl.test" ya tuvo un pago rechazado del pedido pagable
    Entonces el pedido rechazado debe aparecer en el historial del consumidor "pago09.historial@cpl.test"

  Escenario: Reintentar pago con otro medio y aprobar el pedido
    Dado que existe un pedido rechazado por pago fallido del consumidor "pago09.reintento@cpl.test"
    Cuando el consumidor "pago09.reintento@cpl.test" reintenta pagar el pedido rechazado con método "MERCADOPAGO"
    Entonces la respuesta de reintento de pago debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el reintento de pago debe quedar:
      | estadoPago | estadoPedido | metodo      |
      | CAPTURADO  | APROBADO     | MERCADOPAGO |
    Y debe existir ticket de cocina para el pedido aprobado por reintento
    Y el pedido aprobado por reintento debe poder consultarse

  Escenario: Rechazar reintento si el pedido fue cancelado por otro motivo
    Dado que existe un pedido cancelado no reintentable del consumidor "pago09.cancelado@cpl.test"
    Cuando el consumidor "pago09.cancelado@cpl.test" reintenta pagar el pedido no reintentable
    Entonces la respuesta de rechazo de pago debe ser:
      | status_code | status_text              |
      | 409         | CONFLICTO - NO_REINTENTABLE |

  Esquema del escenario: Rechazar pago si el pedido está en estado no pagable
    Dado que existe un pedido no pagable del consumidor "<email>" en estado "<estadoPedido>"
    Cuando el consumidor "<email>" intenta pagar el pedido no pagable
    Entonces la respuesta de rechazo de pago debe ser:
      | status_code | status_text   |
      | 409         | <status_text> |

    Ejemplos:
      | email                      | estadoPedido | status_text                           |
      | pago09.aprobado@cpl.test   | APROBADO     | CONFLICTO - PAGO_DUPLICADO_POR_PEDIDO |
      | pago09.cancelado2@cpl.test | CANCELADO    | CONFLICTO - NO_REINTENTABLE           |

  Escenario: Rechazar pago si el pedido no existe
    Cuando el consumidor "pago09.inexistente@cpl.test" intenta pagar un pedido inexistente
    Entonces la respuesta de rechazo de pago debe ser:
      | status_code | status_text                       |
      | 409         | CONFLICTO - PEDIDO_NO_ENCONTRADO |

  Escenario: Rechazar pago si el pedido no pertenece al consumidor
    Dado que existe un pedido pagable para rechazo de pago del consumidor "pago09.duenio@cpl.test"
    Cuando el consumidor "pago09.tercero@cpl.test" intenta pagar el pedido pagable de otro consumidor
    Entonces la respuesta de rechazo de pago debe ser:
      | status_code | status_text                                    |
      | 409         | CONFLICTO - PEDIDO_NO_PERTENECE_AL_CONSUMIDOR  |

# ============================================================
# 20_split_pago
# ============================================================

Escenario: Generar splits al capturar un pago
  Dado que existe un pago capturado del consumidor "split.generacion@cpl.test"
  Cuando se consulta el pago actual
  Entonces la respuesta de pago debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y el pago queda en estado "CAPTURADO"
  Y la respuesta contiene 3 splits
  Y existen splits para los destinos:
    | destino     |
    | RESTAURANTE |
    | REPARTIDOR  |
    | PLATAFORMA  |
  Y la suma de los splits coincide con el monto del pago

Escenario: Reejecutar split de forma idempotente
  Dado que existe un pago capturado del consumidor "split.idempotente@cpl.test"
  Cuando se ejecuta nuevamente el split para ese pago
  Entonces la respuesta de pago debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y la respuesta indica idempotencia

Escenario: Los splits generados quedan liquidables
  Dado que existe un pago capturado del consumidor "split.liquidable@cpl.test"
  Cuando se consulta el pago actual
  Entonces la respuesta de pago debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y la respuesta contiene 3 splits

Escenario: Aplicar configuración override de restaurante
  Dado que existe un pago capturado del consumidor "split.override@cpl.test"
  Cuando se consulta el pago actual
  Entonces la respuesta de pago debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y la respuesta contiene 3 splits

Escenario: Rechazar ejecución de split sobre pedido cancelado
  Dado que existe un pedido cancelado no reintentable del consumidor "split.cancelado@cpl.test"
  Cuando el consumidor "split.cancelado@cpl.test" reintenta pagar el pedido no reintentable
  Entonces la respuesta de rechazo de pago debe ser:
    | status_code | status_text                 |
    | 409         | CONFLICTO - NO_REINTENTABLE |

# ============================================================
# 34_comisiones_plataforma
# ============================================================

Escenario: Aplicar comisión específica por restaurante
  Dado que existe un pago capturado del consumidor "comision.restaurante@cpl.test" para el restaurante "R-1001"
  Cuando se consulta el pago actual
  Entonces la respuesta de pago debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y el split de plataforma debe registrar regla aplicada "COM-R-1001-V1"
  Y la suma de los splits coincide con el monto del pago

Escenario: Aplicar comisión específica por zona
  Dado que existe un pago capturado del consumidor "comision.zona@cpl.test" para el restaurante "R-1002"
  Cuando se consulta el pago actual
  Entonces la respuesta de pago debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y el split de plataforma debe registrar regla aplicada "COM-ZONA_1-V2"
  Y la suma de los splits coincide con el monto del pago

Escenario: Promoción reduce comisión de plataforma
  Dado que existe un pago capturado del consumidor "comision.promo@cpl.test" para el restaurante "R-1001"
  Cuando se consulta el pago actual
  Entonces la respuesta de pago debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y existe auditoría de comisión con motivo "PROMOCION_COMISION_APLICADA"

Escenario: Consultar resumen de comisiones con datos
  Dado que existe un pago capturado del consumidor "comision.resumen@cpl.test" para el restaurante "R-1001"
  Cuando se consulta el resumen de comisiones para moneda "ARS" y restaurante "R-1001"
  Entonces la respuesta de comisiones debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y el resumen de comisiones debe tener cantidad de pagos mayor a 0
  Y el resumen de comisiones debe tener total mayor a 0

Escenario: Consultar resumen de comisiones sin datos
  Cuando se consulta el resumen de comisiones para un período sin datos en moneda "ARS"
  Entonces la respuesta de comisiones debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y el resumen de comisiones debe tener total 0 y cantidad 0

Escenario: Reembolsar pago revierte splits de comisión
  Dado que existe un pago capturado del consumidor "comision.reembolso@cpl.test" para el restaurante "R-1001"
  Cuando se reembolsa el pago actual
  Entonces la respuesta de pago debe ser:
    | status_code | status_text |
    | 200         | OK          |
  Y el pago queda en estado "REEMBOLSO_PENDIENTE"
  Y los splits del pago quedan no liquidables