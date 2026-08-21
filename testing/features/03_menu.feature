# language: es

Característica: Consulta de menús de restaurantes

  Esquema del escenario: Consultar menú principal de restaurante
    Cuando se consulta el menú principal del restaurante "<codigoRestaurante>"

    Entonces la respuesta de menú debe ser:
      | status_code | status_text |
      | 200         | OK          |

    Y la respuesta contiene el menú:
      | codigoRestaurante   | nombreRestaurante   | codigoMenu   | nombreMenu   | activoMenu   |
      | <codigoRestaurante> | <nombreRestaurante> | <codigoMenu> | <nombreMenu> | <activoMenu> |

    Y el menú contiene solo ítems disponibles
    Y el menú no expone ids internos

    Ejemplos:
      | codigoRestaurante | nombreRestaurante       | codigoMenu | nombreMenu         | activoMenu |
      | R-1001            | Pizzería Nápoles Centro | M-2001     | Carta Principal    | true       |
      | R-1002            | Sushi Río Costero       | M-2003     | Carta Principal    | true       |
      | R-1037            | Vegano Verde            | M-2055     | Menú Vegano Diario | true       |

  Esquema del escenario: Consultar menú específico de restaurante
    Cuando se consulta el menú "<codigoMenu>" del restaurante "<codigoRestaurante>"

    Entonces la respuesta de menú debe ser:
      | status_code | status_text |
      | 200         | OK          |

    Y la respuesta contiene el menú:
      | codigoRestaurante   | nombreRestaurante   | codigoMenu   | nombreMenu   | activoMenu   |
      | <codigoRestaurante> | <nombreRestaurante> | <codigoMenu> | <nombreMenu> | <activoMenu> |

    Y el menú contiene solo ítems disponibles
    Y el menú no expone ids internos

    Ejemplos:
      | codigoRestaurante | codigoMenu | nombreRestaurante       | nombreMenu         | activoMenu |
      | R-1001            | M-2001     | Pizzería Nápoles Centro | Carta Principal    | true       |
      | R-1002            | M-2003     | Sushi Río Costero       | Carta Principal    | true       |
      | R-1037            | M-2055     | Vegano Verde            | Menú Vegano Diario | true       |

  Esquema del escenario: Listar menús de restaurante
    Cuando se listan menús del restaurante "<codigoRestaurante>" con activo "<activo>" página "<page>" tamaño "<size>"

    Entonces la respuesta de menú debe ser:
      | status_code | status_text |
      | 200         | OK          |

    Y la página de menús debe ser:
      | page   | size   |
      | <page> | <size> |

    Y existen menús en la respuesta
    Y la lista de menús debe tener activo "<activo>"
    Y la lista de menús no expone ids internos

    Ejemplos:
      | codigoRestaurante | activo | page | size |
      | R-1001            |        | 0    | 10   |
      | R-1002            |        | 0    | 10   |
      | R-1037            |        | 0    | 10   |
      | R-1001            | true   | 0    | 10   |
      | R-1002            | true   | 0    | 10   |
      | R-1037            | true   | 0    | 10   |

  Esquema del escenario: Rechazar consulta de menú inexistente
    Cuando se consulta el menú "<codigoMenu>" del restaurante "<codigoRestaurante>"

    Entonces la respuesta de menú debe ser:
      | status_code | status_text   |
      | 409         | <status_text> |

    Ejemplos:
      | codigoRestaurante | codigoMenu | status_text                |
      | R-1001            | M-9999     | ERROR - MENU_NO_ENCONTRADO |

  Esquema del escenario: Rechazar listado de menús de restaurante inexistente
    Cuando se listan menús del restaurante "<codigoRestaurante>" con activo "<activo>" página "<page>" tamaño "<size>"

    Entonces la respuesta de menú debe ser:
      | status_code | status_text   |
      | 409         | <status_text> |

    Ejemplos:
      | codigoRestaurante | activo | page | size | status_text                       |
      | R-9999            |        | 0    | 10   | ERROR - RESTAURANTE_NO_ENCONTRADO |