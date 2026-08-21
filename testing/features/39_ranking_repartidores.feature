# language: es

Característica: Ranking de repartidores

  Como plataforma
  quiero consultar un ranking de repartidores
  para evaluar desempeño según entregas completadas.

  Antecedentes:
    Dado que el sistema CPL está operativo

  Escenario: Consultar ranking de repartidores por entregas completadas
    Cuando se consulta el ranking de repartidores con periodo "ULTIMOS_7_DIAS", metrica "ENTREGAS_COMPLETADAS", orden "DESC", page 0 y size 20
    Entonces la respuesta del ranking debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el ranking contiene repartidores

  Escenario: Consultar ranking de repartidores para hoy
    Cuando se consulta el ranking de repartidores con periodo "HOY", metrica "ENTREGAS_COMPLETADAS", orden "DESC", page 0 y size 20
    Entonces la respuesta del ranking debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el ranking contiene repartidores

  Escenario: Consultar ranking de repartidores para los últimos 30 días
    Cuando se consulta el ranking de repartidores con periodo "ULTIMOS_30_DIAS", metrica "ENTREGAS_COMPLETADAS", orden "DESC", page 0 y size 20
    Entonces la respuesta del ranking debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el ranking contiene repartidores

  Esquema del escenario: Rechazar período no soportado
    Cuando se consulta el ranking de repartidores con periodo "<periodo>", metrica "ENTREGAS_COMPLETADAS", orden "DESC", page 0 y size 20
    Entonces la respuesta del ranking debe ser:
      | status_code | status_text                       |
      | 409         | CONFLICTO - PERIODO_NO_SOPORTADO |

    Ejemplos:
      | periodo     |
      | ANIO_ACTUAL |
      | ULTIMAS_3H  |

  Esquema del escenario: Rechazar métrica no soportada
    Cuando se consulta el ranking de repartidores con periodo "HOY", metrica "<metrica>", orden "DESC", page 0 y size 20
    Entonces la respuesta del ranking debe ser:
      | status_code | status_text                      |
      | 409         | CONFLICTO - METRICA_NO_SOPORTADA |

    Ejemplos:
      | metrica          |
      | KM_RECORRIDOS    |
      | RECLAMOS_TOTALES |

  Esquema del escenario: Rechazar paginación inválida
    Cuando se consulta el ranking de repartidores con periodo "HOY", metrica "ENTREGAS_COMPLETADAS", orden "DESC", page <page> y size <size>
    Entonces la respuesta del ranking debe ser:
      | status_code | status_text                    |
      | 409         | CONFLICTO - PAGINACION_INVALIDA |

    Ejemplos:
      | page | size |
      | -1   | 20   |
      | 0    | 51   |