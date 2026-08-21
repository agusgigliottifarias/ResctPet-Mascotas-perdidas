# language: es

Característica: Repartidores - Ver saldo actualizado

  Antecedentes:
    Dado que el sistema CPL está operativo

  Escenario: Ver saldo actualizado del repartidor
    Cuando se consulta el saldo del repartidor "D-102"
    Entonces la respuesta de saldo debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el saldo del repartidor debe contener:
      | idRepartidor | moneda | saldoLiquidable |
      | D-102        | ARS    | 0               |

  Escenario: Rechazar consulta si el repartidor no existe
    Cuando se consulta el saldo del repartidor "D-999"
    Entonces la respuesta de saldo debe ser:
      | status_code | status_text                           |
      | 409         | CONFLICTO - REPARTIDOR_NO_ENCONTRADO  |

  Esquema del escenario: Rechazar paginación inválida
    Cuando se consulta el saldo del repartidor "D-102" con paginación size "<size>"
    Entonces la respuesta de saldo debe ser:
      | status_code | status_text                      |
      | 409         | CONFLICTO - PAGINACION_INVALIDA  |

    Ejemplos:
      | size |
      | 0    |
      | -1   |
      | 9999 |

  Escenario: Rechazar rango de fechas inválido
    Cuando se consulta el saldo del repartidor "D-102" desde "2026-02-10T00:00:00Z" hasta "2026-02-01T00:00:00Z"
    Entonces la respuesta de saldo debe ser:
      | status_code | status_text                         |
      | 409         | CONFLICTO - RANGO_FECHAS_INVALIDO   |