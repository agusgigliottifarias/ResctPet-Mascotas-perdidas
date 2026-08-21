# language: es

Característica: Analítica de distribución de importes de pagos
  Como operador de la plataforma
  quiero consultar métricas sobre los importes de pagos
  para analizar consumos, variabilidad y posibles anomalías.

  Antecedentes:
    Dado que el sistema CPL está operativo
    Y existe el restaurante "R-1001"
    Y existe el restaurante "R-2002"

  Escenario: Analizar pagos capturados de un período
    Dado que existen pagos capturados en moneda "ARS" dentro del período de análisis
    Cuando se consulta la distribución de importes de pagos en moneda "ARS"
    Entonces la consulta de métricas responde correctamente
    Y la distribución incluye cantidad de pagos y métricas principales
    Y la distribución incluye buckets de importes
    Y todos los pagos analizados están capturados

  Escenario: Incluir pagos no capturados cuando se solicita
    Dado que existen pagos capturados y no capturados dentro del período de análisis
    Cuando se consulta la distribución incluyendo pagos no capturados
    Entonces la consulta de métricas responde correctamente
    Y el análisis incluye pagos capturados y no capturados

  Escenario: Analizar desglose de importes por destino de split
    Dado que existen pagos capturados con splits para restaurante, repartidor y plataforma
    Cuando se consulta la distribución de importes incluyendo splits
    Entonces la consulta de métricas responde correctamente
    Y la distribución incluye el total por cada destino de split
    Y la suma de porcentajes de los splits es aproximadamente 1

  Escenario: Filtrar desglose por destino de split
    Dado que existen pagos capturados con splits para restaurante, repartidor y plataforma
    Cuando se consulta la distribución de importes del destino de split "RESTAURANTE"
    Entonces la consulta de métricas responde correctamente
    Y la distribución incluye solamente el destino de split "RESTAURANTE"

  Escenario: Detectar pagos atípicos por umbral configurado
    Dado que existen pagos capturados con importes mayores al umbral de análisis
    Cuando se consulta la distribución de importes con detección de outliers
    Entonces la consulta de métricas responde correctamente
    Y la distribución lista los pagos atípicos encontrados
    Y cada outlier informa pago, pedido, restaurante, monto y fecha
    Y la respuesta no expone datos sensibles del consumidor

  Escenario: Filtrar distribución por restaurante
    Dado que existen pagos capturados para el restaurante "R-1001"
    Cuando se consulta la distribución de importes del restaurante "R-1001"
    Entonces la consulta de métricas responde correctamente
    Y la distribución solo considera pagos del restaurante "R-1001"

  Escenario: Filtrar distribución por zona
    Dado que existen pagos capturados para la zona "Puerto Madryn"
    Cuando se consulta la distribución de importes de la zona "Puerto Madryn"
    Entonces la consulta de métricas responde correctamente
    Y la distribución solo considera pagos de esa zona

  Escenario: Filtrar distribución por consumidor
    Dado que existen pagos capturados de distintos consumidores
    Cuando se consulta la distribución de importes del consumidor actual
    Entonces la consulta de métricas responde correctamente
    Y la distribución solo considera pagos del consumidor actual

  Escenario: Agrupar distribución por moneda
    Dado que existen pagos capturados en moneda "ARS"
    Cuando se consulta la distribución de importes para todas las monedas
    Entonces la consulta de métricas responde correctamente
    Y la distribución informa la cantidad de pagos por moneda

  Escenario: Consultar distribución sin pagos
    Dado que no existen pagos capturados dentro del período de análisis
    Cuando se consulta la distribución de importes de pagos en moneda "ARS"
    Entonces la consulta de métricas responde correctamente
    Y las métricas se informan en cero
    Y no se informan buckets ni outliers

  Esquema del escenario: Rechazar consulta con filtros inválidos
    Cuando se consulta la distribución de importes con el filtro inválido "<filtro>"
    Entonces la consulta de métricas es rechazada por "<motivo>"

    Ejemplos:
      | filtro           | motivo                 |
      | rango de fechas  | RANGO_FECHAS_INVALIDO  |
      | tamaño de bucket | FILTRO_INVALIDO        |
      | moneda           | FILTRO_INVALIDO        |

    # ---------------------------------------------------------------------------
  # Tarjeta 25 - Conocer el tiempo promedio entre pedido y entrega
  # Implementación simplificada: cantidad, promedio, mínimo y máximo
  # ---------------------------------------------------------------------------

  Escenario: Consultar tiempo promedio entre pedido y entrega
    Dado que existen pedidos entregados dentro del período consultado
    Cuando se consulta el tiempo promedio entre pedido y entrega desde "2025-01-01T00:00:00Z" hasta "2030-01-01T00:00:00Z"
    Entonces la consulta de tiempo pedido entrega responde correctamente
    Y la métrica informa cantidad de entregados
    Y la métrica informa promedio de tiempo
    Y la métrica informa tiempo mínimo y máximo