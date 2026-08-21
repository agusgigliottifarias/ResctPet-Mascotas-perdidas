# language: es

Característica: Explorar restaurantes disponibles en CPL

  Esquema del escenario: Consultar restaurantes disponibles
    Cuando se consultan restaurantes:
      | page   | size   | nombre   | tipoCocina   | ciudad   | aceptaPedidos   | lat   | lon   | radioKm   |
      | <page> | <size> | <nombre> | <tipoCocina> | <ciudad> | <aceptaPedidos> | <lat> | <lon> | <radioKm> |

    Entonces la respuesta de restaurantes debe ser:
      | status_code | status_text |
      | 200         | OK          |

    Y la página de restaurantes debe ser:
      | page   | size   |
      | <page> | <size> |

    Y existen restaurantes en la respuesta

    Y los restaurantes listados deben cumplir:
      | nombre   | tipoCocina   | ciudad   | aceptaPedidos   |
      | <nombre> | <tipoCocina> | <ciudad> | <aceptaPedidos> |

    Y los restaurantes listados no deben exponer ids internos

    Ejemplos:
      | page | size | nombre   | tipoCocina   | ciudad        | aceptaPedidos | lat     | lon     | radioKm |
      | 0    | 10   |          |              |               | true          |         |         |         |
      | 0    | 20   | Pizzería | PIZZA        | Puerto Madryn | true          |         |         |         |
      | 0    | 20   | Sushi    | SUSHI        | Puerto Madryn | true          |         |         |         |
      | 0    | 20   |          | PARRILLA     | Trelew        | true          |         |         |         |
      | 0    | 20   | Vegano   | VEGANO       | Rawson        | true          |         |         |         |
      | 0    | 20   |          | HAMBURGUESAS | Puerto Madryn | true          |         |         |         |
      | 0    | 20   |          |              | Puerto Madryn | true          |         |         |         |
      | 0    | 20   |          |              | Puerto Madryn | true          | -42.772 | -65.036 | 5       |

  Escenario: No listar restaurantes que no aceptan pedidos
    Cuando se consultan restaurantes:
      | page | size | nombre | tipoCocina | ciudad        | aceptaPedidos | lat | lon | radioKm |
      | 0    | 20   | Rápido | FAST_FOOD  | Puerto Madryn | true          |     |     |         |

    Entonces la respuesta de restaurantes debe ser:
      | status_code | status_text |
      | 200         | OK          |

    Y la página de restaurantes debe ser:
      | page | size |
      | 0    | 20   |

    Y no existen restaurantes en la respuesta