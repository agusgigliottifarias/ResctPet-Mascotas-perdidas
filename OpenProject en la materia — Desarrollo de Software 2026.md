# DESARROLLO DE SOFTWARE 2026 / GUÍA DE OPENPROJECT

OpenProject en la materia
Desarrollo de Software 2026
Guía de uso para estudiantes Edición del 8 de septiembre de 2026

Planificar el trabajo, registrar lo realizado y mostrar un producto que funcione son partes de la misma entrega.
Esta guía explica cómo usamos OpenProject en la cátedra y qué evidencia se revisa en el seguimiento semanal.

> **REGLA DE LA MATERIA** | Lo que no está registrado en OpenProject no se considera trabajo realizado para el seguimiento. Mantengan visible lo que hacen, los resultados y los problemas que necesitan resolver.

---

## Las seis pautas que tienen que recordar

1. **Estimen con Puntos de Historia:** en esta materia, 1 punto = 1 hora de esfuerzo de una persona.
2. **Estimen cada esfuerzo una sola vez:** en la historia o en sus tareas. Un padre solo puede sumar esfuerzo propio adicional si está expresamente justificado.
3. **Cada integrante registra sus horas reales en Tiempo invertido**, con actividad y comentario. Se recomienda hacerlo todos los días.
4. **Registren también reuniones, pruebas, documentación, investigación e infraestructura.** Todo el trabajo del proyecto cuenta.
5. **Inicien y finalicen los sprints;** mantengan responsables, estados y bloqueos actualizados. Una tarea cerrada tiene que estar terminada y validada.
6. **Publiquen «Entregable Sprint N»** al menos tres días antes de la demo, con una lista funcional de lo que van a mostrar.

---

## Cómo leer esta guía

Los recuadros «Regla de la materia» indican pautas docentes. Las «Recomendaciones» ayudan a organizarse y se distinguen de los requisitos. Los ejemplos son ficticios: no describen ni evalúan a ningún equipo.

### Recorrido
* 02. Planificación y responsables
* 03. Estimación sin duplicaciones
* 04. Carga diaria de horas
* 05. Trabajo conjunto, Gestión e Infraestructura
* 06. Qué revisa el informe semanal
* 07. Cómo interpretar los indicadores
* 08. Noticia y presentación de la demo
* 09. Revisión rápida y referencias

*(Version 1-08/09/2026 | 1)*

---

## 02. Planificar un sprint realizable

El backlog reúne el trabajo posible del producto. El sprint contiene el trabajo priorizado que el equipo se propone realizar en un período concreto. No hace falta estimar ni asignar responsables a todo el backlog: la exigencia se concentra en lo priorizado para los sprints.

### Antes de iniciar
1. Acuerden un objetivo que puedan explicar en una frase: qué podrá hacer el usuario al finalizar el sprint.
2. Seleccionen las historias y descompongan el trabajo cuando ayude a ejecutarlo. Una épica agrupa alcance; una historia describe valor para el usuario; una tarea concreta el trabajo necesario.
3. Revisen el Sprint y sus fechas en Backlogs. Utilicen el sprint de la cursada; no creen una Versión para reemplazarlo.
4. Carguen la estimación en un único nivel por esfuerzo. Verifiquen que historias y tareas queden vinculadas al sprint correspondiente; no den por hecho que todas las relaciones se completaron automáticamente.
5. Acuerden responsables, dependencias, criterios de aceptación y cómo van a probar y mostrar el resultado.

### Iniciar, mantener y finalizar el sprint
Al comenzar el período de trabajo, inicien el sprint en OpenProject: no lo dejen en planificación mientras ya están trabajando. Durante el sprint, actualicen el estado de cada tarea según el avance real, editándolo manualmente o arrastrando la tarjeta en el tablero que se genera al iniciar el sprint. Comprueben que el movimiento haya guardado el estado esperado.

Al cerrar el período, revisen lo terminado y lo pendiente, registren las decisiones sobre el trabajo que continúa y finalicen el sprint en la herramienta. Finalizar un sprint no significa que todas sus tareas estén terminadas: no cierren trabajo pendiente para que el tablero parezca completo.

### Responsables desde la planificación
> **Recomendación:** acuerden quién coordinará cada tarea priorizada antes de comenzar. Esto permite detectar sobrecargas, trabajo sin cobertura y dependencias que pueden frenar al equipo. El responsable facilita el seguimiento; puede recibir ayuda y cambiar durante el sprint.

También se acepta que tomen y asignen tareas cuando se libera capacidad. Puede funcionar si el equipo conoce las prioridades, revisa la carga y mantiene pocas tareas abiertas a la vez. El riesgo aparece cuando «todavía no la tomó nadie» oculta que una tarea necesaria no tiene tiempo ni personas disponibles. Si eligen esta modalidad, dejen registrado el acuerdo y revisen el reparto a diario.

> **REGLA DE LA MATERIA** | La asignación progresiva es una alternativa aceptada. La recomendación de asignar en planificación no la convierte en un incumplimiento automático.

### Capacidad para planificar
En el seguimiento se usa como referencia docente una dedicación de 2 horas por día hábil e integrante. Por ejemplo, 4 integrantes × 10 días hábiles × 2 horas = 80 horas-persona. Revisen el calendario real y contemplen reuniones, pruebas e infraestructura dentro de la capacidad disponible.

Esta referencia orienta la planificación. No autoriza a cargar horas que no trabajaron ni reemplaza la evaluación de los resultados.

*(Version 1-08/09/2026 | 2)*

---

## 03. Estimar sin contar dos veces

OpenProject permite distintos métodos de trabajo. En la cátedra usamos el campo Puntos de Historia para estimar, con la convención 1 punto = 1 hora-persona, para homogeneizar las estimaciones entre equipos. Es una convención de la materia, no una equivalencia universal de los puntos de historia.

| Dato | Qué significa en la materia |
| :--- | :--- |
| **Puntos de Historia** | Esfuerzo planificado; es la base de estimación que revisamos. |
| **Tiempo invertido** | Horas reales registradas por quienes hicieron el trabajo. |
| **Trabajo restante o pendiente** | Estimación actual de lo que falta, cuando se utiliza ese campo. No equivale necesariamente a puntos menos horas. |

### Dos formas válidas de cargar los puntos
*Ejemplo: una historia requiere una tarea de interfaz de 3 horas y una de pruebas de 2 horas.*

| Alternativa | Historia padre | Interfaz | Pruebas | Total |
| :--- | :--- | :--- | :--- | :--- |
| **Estimar en la historia** | 5 puntos | Sin puntos | Sin puntos | 5 puntos |
| **Estimar en las tareas** | Sin puntos | 3 puntos | 2 puntos | 5 puntos |
| **Duplicación que deben evitar** | 5 puntos | 3 puntos | 2 puntos | 10 puntos |

Si estiman en los hijos, dejen al padre sin estimación propia del mismo trabajo. Si estiman en la historia, no hace falta repetir puntos en sus tareas. Esta pauta vale también para tareas que tienen otras tareas hijas y para cualquier nivel superior de la jerarquía. Una relación de dependencia entre tareas no es lo mismo que una relación padre-hijo.

### Excepción: esfuerzo propio del padre
El padre puede tener puntos adicionales si realiza un trabajo diferente del de sus hijos y lo dejan expresamente justificado. Por ejemplo: interfaz 3 + pruebas 2 + revisión adicional en el padre 1 = 6 puntos. La descripción debe aclarar qué cubre ese punto y por qué no está incluido en las tareas.

> **RECOMENDACIÓN** | Para que sea más fácil de entender y revisar, suele convenir crear una tarea hija para ese trabajo adicional.

No cambien los puntos solo para hacerlos coincidir con las horas consumidas. Si aparece trabajo nuevo o cambia la estimación, registren el motivo y el cambio de alcance. Completar el campo Trabajo no sustituye la carga de Puntos de Historia para la materia.

*(Version 1-08/09/2026 | 3)*

---

## 04. Registrar las horas de cada día

### Carga de tiempo, paso a paso
1. Abran la tarea del proyecto en la que trabajaron. Dejen un comentario de avance que explique qué hicieron o qué problema encontraron.
2. Busquen **Tiempo invertido** y el relojito para registrar tiempo. En la documentación en inglés aparece como *Spent time / Log time*.
3. Indiquen la fecha en que realizaron el trabajo y las horas reales dedicadas. Si cargan otro día, conserven la fecha real del trabajo.
4. Seleccionen la actividad que mejor lo describe entre las disponibles. Siempre agreguen un comentario breve en la imputación.
5. Guarden y comprueben tarea, fecha, persona, cantidad de horas, actividad y comentario. Actualicen el estado si corresponde.

### Tiempos de una tarea
Una misma tarea puede tener imputaciones de tiempo en diferentes días, realizadas por diferentes usuarios. En la visualización de tiempo total, a la que se puede acceder al hacer clic en el total de horas, se detalla el total de imputaciones de tiempo.

### Un comentario que permite entender el trabajo
* **Ejemplo:** «Probé el alta con campos vacíos, corregí la validación del correo y volví a ejecutar las pruebas».
* **Para una reunión:** «Planificación del sprint: acordamos alcance y resolvimos la dependencia del despliegue».
* **Eviten comentarios como** «trabajé» o «varios».

> **REGLA DE LA MATERIA** | Registren toda actividad realizada para el proyecto, incluso si no produjo código o no pudo completarse. Elijan actividad y escriban un comentario, aunque el formulario no los marque como obligatorios.

**Recomendación:** imputen diariamente al finalizar la jornada. Si no saben dónde cargar, usen la historia o alguna otra tarea del mismo proyecto y aclaren qué hicieron. Es preferible registrar con esa aclaración que omitir el trabajo; después corrijan la ubicación sin duplicar las horas.

*(Version 1-08/09/2026 | 4 y 5)*

---

## 05. El tiempo es de cada persona

La unidad es la hora-persona, también llamada hora/hombre. Cada integrante registra el tiempo que dedicó al proyecto desde su propia cuenta. No carguen en una sola persona el total del equipo.

| Situación | Registro individual | Total del equipo |
| :--- | :--- | :--- |
| **Dos personas programan juntas durante 1 hora** | Cada una carga 1 hora | 2 horas |
| **Tres personas prueban juntas durante 1 hora** | Cada una carga 1 hora | 3 horas |
| **Reunión de cuatro personas durante 1 hora** | Cada una carga 1 hora | 4 horas |

Todos pueden imputar en cualquier tarea de su proyecto, independientemente de quién la tenga asignada. La asignación no determina a quién pertenecen las horas. Si un permiso impide la carga, avisen al docente para resolverlo.

No dupliquen una misma hora propia en dos tareas simultáneas. Si una jornada tuvo varias actividades, distribuyan el tiempo según lo que efectivamente dedicaron a cada una.

### Reuniones e infraestructura también cuentan
Usamos tipos de tarea configurados para la materia: **GESTIÓN** e **INFRAESTRUCTURA**. No son una clasificación universal que OpenProject aplique automáticamente.

| Tipo de tarea | Ejemplos de trabajo |
| :--- | :--- |
| **Gestión** | Daily, planificación, seguimiento, acuerdos, review y retrospectiva. |
| **Infraestructura** | Preparar ambientes, configurar integración y despliegue, realizar deploys y resolver problemas del entorno. |

Pueden tener una tarea de cada tipo por sprint, una tarea general para todo el proyecto o varias tareas específicas sin sprint. El tipo de la tarea y la actividad de la imputación son campos diferentes: completen ambos de forma coherente. Escribir «reunión» en el título no cambia el tipo de la tarea.

### Cómo entran en las horas del sprint
Toda hora del equipo imputada en tareas de estos tipos con fecha de trabajo entre el inicio y el fin del sprint se considera dentro de ese sprint, aunque la tarea no esté asignada a él. En un informe parcial se cuenta hasta la fecha de corte. Cada entrada se suma una sola vez y estas tareas no se consideran backlog por estar sin sprint.

* **Ejemplo:** sprint del 1 al 14. Una reunión de Gestión sin sprint, realizada el día 8 por cuatro personas durante una hora, aporta 4 horas al sprint. Una imputación del día 15 queda fuera de ese período. La inclusión de horas no agrega automáticamente puntos ni historias terminadas a la velocidad del sprint.

*(Version 1-08/09/2026 | 6)*

---

## 06. Qué revisa el informe semanal

El informe es una devolución de seguimiento basada en un corte de OpenProject. Revisa proceso y producto: no alcanza con tener código si no hay trazabilidad, ni con cargar muchas horas si no se logra un incremento validado. La evaluación es continua y también contempla la demo, la calidad técnica y la defensa individual.

### Evidencia que se consulta
Se revisan el backlog, los sprints y sus fechas, historias y tareas, jerarquías, puntos, responsables, estados, registros de tiempo, actividades, comentarios, noticias e historiales de cambios. La información ausente se señala como falta de evidencia; no se inventan horas, resultados ni explicaciones.

| Dimensión | Qué se observa |
| :--- | :--- |
| **Planificación** | Objetivo y alcance del sprint, cobertura de estimaciones sin duplicación, capacidad, responsables y dependencias. No se exige completar todo el backlog. |
| **Trazabilidad** | Horas reales por integrante y actividad, comentarios útiles, fechas correctas y correspondencia entre el estado y lo realizado. |
| **Incremento y calidad** | Historias terminadas, pruebas, integración, validación y resultados que se pueden mostrar. Cerrar tareas aisladas no completa necesariamente la historia. |
| **Colaboración** | Contribución individual, trabajo conjunto, reparto del esfuerzo y registro de gestión e infraestructura. Las horas no son por sí solas una medida de calidad. |
| **Comunicación** | Noticia de entregable en plazo, claridad funcional de lo anunciado, demo, bloqueos y decisiones visibles. |

### Cómo se construye la devolución
1. Se informa la fecha de corte y el sprint analizado; se separan la semana, el acumulado del sprint y el acumulado del proyecto.
2. Se muestran indicadores y sus límites: estimaciones, consumo, cierres, velocidad y gráfico disponible.
3. Se detallan horas por persona y actividad, las incluidas por Gestión/Infraestructura y otras horas fuera del sprint. También se revisa que el sprint esté iniciado o finalizado según el momento de la cursada.
4. Se revisa la noticia de demo y se proponen próximos pasos concretos para el equipo.

El criterio puede estar evidenciado, parcialmente evidenciado, sin evidencia o no ser calculable con los datos disponibles. Se separan hechos («faltan comentarios en estas imputaciones»), interpretaciones («eso dificulta reconocer el aporte») y recomendaciones («completen qué hicieron»).

> **REGLA DE LA MATERIA** | El informe semanal no produce una nota final automática ni aplica ponderaciones numéricas inventadas. Los indicadores orientan la devolución y el juicio docente.

*(Version 1-08/09/2026 | 7)*

---

## 07. Cómo leer los números y el gráfico

### Estimación, consumo y saldo
La base estimada es la suma de puntos del alcance considerado, contados una sola vez según la jerarquía. Si hay superposición sin justificación, el informe debe advertirla; una base provisional no representa un compromiso confirmado.

| Indicador | Lectura correcta |
| :--- | :--- |
| **Horas del sprint** | Horas en sus paquetes dentro de las fechas + horas adicionales de Gestión/Infraestructura incluidas por fecha, sin duplicar entradas. |
| **Porcentaje de avance del sprint** | (Horas contabilizadas / puntos estimados) × 100, usando 1 punto = 1 hora. Solo es calculable si la base es válida y mayor que cero. |
| **Horas restantes del sprint** | Puntos estimados - horas contabilizadas. Es saldo de la estimación; no demuestra cuánto trabajo falta. |
| **Historias cerradas** | Cantidad terminada frente al total considerado. Deben estar completas y validadas. |
| **Velocidad o velocity** | Puntos de historias terminadas durante el sprint. Si se estimó en las tareas, la historia completa aporta la suma de sus puntos sin duplicarlos. |

*Ejemplo:* 40 puntos estimados y 24 horas registradas dan 60% de consumo y un saldo de 16 horas. No significa que esté terminado el 60% del producto. Pueden existir errores, retrabajo o historias aún sin validar.

### El burndown del seguimiento
El gráfico utilizado en los informes disponibles resta las horas acumuladas a la base estimada vigente. La línea ideal distribuye esa base entre los días hábiles considerados. Muestra consumo del presupuesto; no mide por sí sola funcionalidad pendiente ni reconstruye el compromiso inicial si no existe un registro histórico suficiente.

Un saldo cero o negativo indica que se consumió o superó la estimación, aunque queden tareas. Si no hay puntos, el burndown no es calculable: se puede mostrar una curva de horas acumuladas. El burndown nativo de OpenProject puede usar otra lógica; revisen siempre qué mide el gráfico presentado.

### Límites que deben quedar visibles
* La velocidad durante el sprint es parcial. El cierre de algunas tareas no permite contar como terminada toda su historia. Si faltan estimaciones o no hay historias vinculadas al sprint, se informa la limitación en vez de inventar puntos o una velocidad completa.
* Las horas de Gestión e Infraestructura se incluyen por fecha, pero sus puntos solo integran la base si forman parte del alcance estimado. Si el presupuesto no cubre esas actividades, debe aclararse para interpretar la comparación. El informe separa horas de paquetes del sprint, aporte adicional de estos tipos, otras horas fuera y total del proyecto.

*(Version 1-08/09/2026 | 8)*

---

## 08. Preparar la noticia y la demo

> **REGLA DE LA MATERIA** | Al menos tres días antes de la demo, publiquen en Noticias «Entregable Sprint N», reemplazando N por el número: por ejemplo, «Entregable Sprint 1».

La noticia debe permitir al docente saber qué esperar sin recorrer el sprint. Escriban una lista resumida y funcional de lo que mostrarán, sin IDs, enlaces ni referencias a tareas o historias de usuario. Anuncien comportamientos del producto: qué podrá hacer una persona y qué resultado verá.

### Plantilla de contenido
* **Título:** Entregable Sprint 1
* **Resumen:** Presentaremos el circuito de reserva de turnos y su consulta.
* **Descripción:**
  * Una persona podrá consultar los horarios disponibles y reservar un turno.
  * Podrá ver la confirmación y consultar sus próximas reservas.
  * La persona administradora podrá visualizar las reservas del día.

*(Ejemplo ficticio: adapten la lista a lo que realmente van a mostrar. Si cambia el alcance anunciado, actualicen la noticia y expliquen el cambio).*

### Publicación
Entren en Noticias del proyecto, elijan la opción para agregar una noticia, completen título, resumen y descripción, y publiquen. Revisen que se vea en el proyecto correcto. Como recomendación operativa, reserven tres días completos de anticipación; no esperen al día de la demo.

### Durante la demo
Preséntense como equipo y expliquen qué construyen, para quién y qué problema resuelven, especialmente en la primera demo. Recorran el producto funcionando como si el público fueran usuarios, inversores o personas que los contrataron. Expliquen el valor de cada resultado con lenguaje accesible; eviten convertir la presentación en una lectura de tareas o código. Reconozcan los límites y lo que falta validar.

*(Version 1-08/09/2026 | 9)*

---

## 09. Una rutina que hace visible el trabajo

### Al terminar cada jornada
* Cada integrante registró sus horas reales, incluidas reuniones y tareas sin código.
* Cada imputación tiene fecha de trabajo, actividad y comentario comprensible.
* El estado refleja lo ocurrido y los bloqueos explican qué falta, quién puede ayudar y cuál es el próximo paso.
* Actualizaron los estados manualmente o moviendo las tarjetas del tablero, según el avance real.
* No hay duplicaciones de tiempo propio; la tarea asignada a otra persona no impidió registrar el aporte.

### Antes del corte semanal
* El sprint está iniciado si ya comenzó el trabajo; al cerrar el período, revisaron pendientes y lo finalizaron en OpenProject.
* Revisen puntos y jerarquías del trabajo priorizado para el sprint.
* Verifiquen el acuerdo de responsables y la carga del equipo.
* Revisen que Gestión e Infraestructura tengan el tipo correcto, incluso sin sprint. El tipo del padre no clasifica automáticamente a los hijos.
* Revisen comentarios, fechas, actividades y horas fuera del sprint. Si hay un error, corríjanlo preservando la trazabilidad.
* Lean la última devolución y registren cómo resolvieron las observaciones.

### Antes de cerrar y mostrar una historia
* Comprueben que el código esté integrado, que se hayan ejecutado las pruebas pertinentes y que se cumplan los criterios de aceptación. Incluyan validaciones, control de acceso cuando aplique, documentación necesaria y despliegue o evidencia de un ambiente accesible.
* Si existen estos estados en su proyecto, usen *Developed* para lo implementado que aún requiere revisión y *Closed* para lo finalizado y validado. Antes de cambiar el estado, dejen un comentario de avance o decisión. Ensayen la demo con datos de prueba y accesos listos.
* El uso de IA requiere revisión humana: cada integrante debe comprender y poder explicar las decisiones y el sistema. Protejan credenciales, datos personales y documentación académica; usen información ficticia en demostraciones y capturas compartidas.

### Referencias y alcance de esta edición
Las reglas provienen del marco de trabajo 2026 y de las pautas docente. El método de seguimiento se contrastó con los informes locales de las semanas 1 y 2 y la bitácora de la cátedra. Esta guía incorpora las precisiones nuevas para futuros seguimientos; no modifica los cortes de informes anteriores.

*(Version 1-08/09/2026 | 10)*