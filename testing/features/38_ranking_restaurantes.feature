# language: es

Característica: Ranking de restaurantes por períodos de acumulación
  Como consumidor
  quiero consultar un ranking de restaurantes
  para elegir restaurantes populares según el período que me interesa

  Antecedentes:
    Dado que el sistema CPL está operativo

  Escenario: Consultar ranking de restaurantes de hoy por pedidos entregados
    Cuando se consulta el ranking de restaurantes con periodo "HOY", metrica "PEDIDOS_ENTREGADOS", orden "DESC", zona "", pagina 0 y tamaño 20
    Entonces la respuesta del ranking de restaurantes debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el ranking de restaurantes contiene la metrica "PEDIDOS_ENTREGADOS"
    Y el ranking de restaurantes contiene el periodo "HOY"

  Escenario: Consultar ranking filtrado por zona
    Cuando se consulta el ranking de restaurantes con periodo "HOY", metrica "PEDIDOS_ENTREGADOS", orden "DESC", zona "Puerto Madryn", pagina 0 y tamaño 20
    Entonces la respuesta del ranking de restaurantes debe ser:
      | status_code | status_text |
      | 200         | OK          |
    Y el ranking de restaurantes contiene la zona "Puerto Madryn"

  Esquema del escenario: Rechazar periodo no soportado
    Cuando se consulta el ranking de restaurantes con periodo "<periodo>", metrica "PEDIDOS_ENTREGADOS", orden "DESC", zona "", pagina 0 y tamaño 20
    Entonces la respuesta del ranking de restaurantes debe ser:
      | status_code | status_text                         |
      | 409         | CONFLICTO - PERIODO_NO_SOPORTADO    |

    Ejemplos:
      | periodo     |
      | ULTIMOS_3   |
      | ANIO_ACTUAL |

  Esquema del escenario: Rechazar metrica no soportada
    Cuando se consulta el ranking de restaurantes con periodo "HOY", metrica "<metrica>", orden "DESC", zona "", pagina 0 y tamaño 20
    Entonces la respuesta del ranking de restaurantes debe ser:
      | status_code | status_text                        |
      | 409         | CONFLICTO - METRICA_NO_SOPORTADA   |
 
    Ejemplos:
      | metrica        |
      | MARGEN_BRUTO   |
      | VISITAS_LANDING|

  Esquema del escenario: Rechazar paginacion invalida
    Cuando se consulta el ranking de restaurantes con periodo "HOY", metrica "PEDIDOS_ENTREGADOS", orden "DESC", zona "", pagina <pagina> y tamaño <tamano>
    Entonces la respuesta del ranking de restaurantes debe ser:
      | status_code | status_text                       |
      | 409         | CONFLICTO - PAGINACION_INVALIDA   |

    Ejemplos:
      | pagina | tamano |
      | 0      | 51     |
      | -1     | 20     |

  Escenario: Rechazar zona inexistente
    Cuando se consulta el ranking de restaurantes con periodo "HOY", metrica "PEDIDOS_ENTREGADOS", orden "DESC", zona "NO_EXISTE", pagina 0 y tamaño 20
    Entonces la respuesta del ranking de restaurantes debe ser:
      | status_code | status_text                    |
      | 409         | CONFLICTO - ZONA_INEXISTENTE   |