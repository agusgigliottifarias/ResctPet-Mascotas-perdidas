# 

# 

**[1\. Resumen ejecutivo	4](#1.-resumen-ejecutivo)**

[1.1 El problema	4](#1.1-el-problema)

[1.2 La solución propuesta	4](#1.2-la-solución-propuesta)

[1.3 Beneficios esperados	4](#1.3-beneficios-esperados)

[**2\. Contexto y problema	5**](#2.-contexto-y-problema)

[2.1 Origen del proyecto	5](#2.1-origen-del-proyecto)

[2.2 Situación actual	5](#2.2-situación-actual)

[2.3 Oportunidad	6](#2.3-oportunidad)

[**3\. Propósito y objetivos	6**](#3.-propósito-y-objetivos)

[3.1 Propósito	6](#3.1-propósito)

[3.2 Objetivos de la Fase 1	6](#3.2-objetivos-de-la-fase-1)

[3.3 Objetivos medibles	7](#3.3-objetivos-medibles)

[**4\. Público objetivo y actores	7**](#4.-público-objetivo-y-actores)

[4.1 Actores del sistema	8](#4.1-actores-del-sistema)

[4.2 Personas	8](#4.2-personas)

[**5\. Alcance	9**](#5.-alcance)

[5.1 Incluido en fase 1	9](#5.1-incluido-en-fase-1)

[5.2 Fuera de alcance	10](#5.2-fuera-de-alcance)

[5.3 Supuestos y límites del alcance	10](#5.3-supuestos-y-límites-del-alcance)

[**6\. Descripción funcional	11**](#6.-descripción-funcional)

[6.1 Gestión de usuarios	11](#6.1-gestión-de-usuarios)

[6.2 Gestión de mascotas	11](#6.2-gestión-de-mascotas)

[6.3 Mascotas perdidas y encontradas	12](#6.3-mascotas-perdidas-y-encontradas)

[6.4 Notificaciones	12](#6.4-notificaciones)

[6.5 Mapa y lugares de ayuda	13](#6.5-mapa-y-lugares-de-ayuda)

[6.6 Administración	13](#6.6-administración)

[7.1 Seguridad	14](#7.1-seguridad)

[7.2 Rendimiento	14](#7.2-rendimiento)

[7.3 Usabilidad y accesibilidad	14](#7.3-usabilidad-y-accesibilidad)

[7.4 Disponibilidad y confiabilidad	15](#7.4-disponibilidad-y-confiabilidad)

[**8\. Arquitectura preliminar	15**](#8.-arquitectura-preliminar)

[8.1 Frontend	15](#8.1-frontend)

[8.2 Backend	16](#8.2-backend)

[8.3 Base de datos	16](#8.3-base-de-datos)

[8.4 Procesamiento de imágenes	16](#8.4-procesamiento-de-imágenes)

[8.6 Pruebas	17](#8.6-pruebas)

[8.7 Comunicación entre componentes	17](#8.7-comunicación-entre-componentes)

[**9\. Supuestos y restricciones	17**](#9.-supuestos-y-restricciones)

[**10\. Riesgos	18**](#10.-riesgos)

[**11\. Criterios de éxito	19**](#11.-criterios-de-éxito)

[**12\. Visión a largo plazo	19**](#12.-visión-a-largo-plazo)

[**Anexo: Glosario	20**](#anexo:-glosario)

# **1\. Resumen ejecutivo**

## **1.1 El problema**

Actualmente, la información relacionada con mascotas perdidas y encontradas se encuentra distribuida entre diferentes medios, como grupos de redes sociales, sitios web municipales y otras plataformas utilizadas por la comunidad.

En Puerto Madryn, por ejemplo, la Municipalidad cuenta con una sección web de Fauna Urbana donde se publican imágenes de mascotas alojadas en Zoonosis. También se utiliza la plataforma My Pets y diferentes grupos de vecinos y organizaciones para informar sobre animales perdidos o encontrados.

El principal problema es que esta información se encuentra dispersa y no existe un único espacio que permita organizarla y consultarla de manera sencilla. En redes sociales, especialmente en publicaciones con gran cantidad de actividad, la información puede quedar rápidamente desplazada por nuevas publicaciones, dificultando encontrar casos publicados anteriormente y realizar un seguimiento.

Esta situación dificulta que una persona pueda encontrar de manera rápida y ordenada información sobre una mascota perdida o encontrada.

## **1.2 La solución propuesta**

RescPet propone una plataforma web orientada a facilitar la recuperación de mascotas perdidas mediante la búsqueda de posibles coincidencias entre publicaciones de mascotas perdidas y encontradas. 

Para ello, el sistema combina la información registrada en las publicaciones con la cercanía geográfica y la similitud visual de las fotografías, permitiendo identificar y presentar al usuario posibles coincidencias entre casos compatibles. 

De esta manera, RescPet busca reducir el tiempo y el esfuerzo que requiere revisar manualmente publicaciones dispersas, ofreciendo una herramienta de asistencia para encontrar posibles coincidencias de manera más rápida y organizada. 

Las coincidencias generadas por el sistema son orientativas y no representan una identificación definitiva de la mascota. La decisión final queda en manos de la persona usuaria, quien podrá revisar la publicación y utilizar los mecanismos de contacto disponibles. 

## **1.3 Beneficios esperados**

La plataforma busca facilitar la gestión y consulta de información relacionada con mascotas, evitando que los datos sobre mascotas perdidas y encontradas se encuentren dispersos en diferentes medios.

Entre los principales beneficios esperados se encuentran:

* Centralizar en un único espacio las publicaciones de mascotas perdidas y encontradas.  
* Reducir el tiempo de búsqueda manual mediante un ranking asistido por radio de proximidad y similitud visual.   
* Facilitar la comunicación entre personas que perdieron o encontraron una mascota.  
* Mejorar el seguimiento de los casos activos. 

# **2\. Contexto y problema**

## **2.1 Origen del proyecto**

El proyecto surge a partir de observar cómo actualmente se gestiona la información relacionada con mascotas perdidas y encontradas en la ciudad. Existen diferentes medios que permiten publicar y consultar estos casos, como la sección de Fauna Urbana de la Municipalidad, plataformas específicas para mascotas y grupos de redes sociales.

Sin embargo, la información se encuentra distribuida entre distintos canales. En particular, las publicaciones realizadas en redes sociales pueden quedar rápidamente desplazadas por nuevo contenido, dificultando encontrar información publicada anteriormente y realizar un seguimiento de los casos.

A partir de esta situación surge la propuesta de desarrollar una plataforma que permita centralizar y organizar la información relacionada con las mascotas perdidas y encontradas, incorporando en un mismo espacio sus características, fotografías, ubicación y mecanismos de búsqueda de posibles coincidencias. 

## **2.2 Situación actual**

Actualmente, una persona que pierde o encuentra una mascota debe recurrir a diferentes medios para difundir o buscar información. Puede utilizar redes sociales, grupos de vecinos, o sitios institucionales.

Si bien estos medios permiten compartir información, no existe un espacio único donde se encuentre organizada. Una publicación puede quedar desplazada por nuevas publicaciones, haciendo que sea difícil encontrarla nuevamente con el paso del tiempo.

Además, la información de una mascota puede estar distribuida entre diferentes lugares. Las fotografías, sus características, los datos de contacto y la información relacionada con su pérdida o encuentro pueden encontrarse en publicaciones separadas.

Esta situación dificulta encontrar publicaciones anteriores, hacer un seguimiento de cada caso y saber si una mascota encontrada podría ser la misma que otra persona está buscando.

Por este motivo, actualmente la búsqueda y difusión de información sobre mascotas perdidas y encontradas depende en gran medida de revisar distintos canales y de que la publicación llegue a las personas adecuadas.

## **2.3 Oportunidad**

La situación actual presenta una oportunidad para centralizar en un único espacio la información relacionada con las mascotas y, especialmente, con los casos de pérdida y encuentro.

La plataforma propuesta permitirá centralizar las publicaciones de mascotas perdidas y encontradas, incorporando información como fotografías, características y ubicación. A su vez, permitirá realizar búsquedas manuales y solicitar búsquedas de posibles coincidencias utilizando criterios de especie, cercanía geográfica y similitud visual.

De esta manera, la propuesta busca reducir el tiempo y el esfuerzo que requiere revisar manualmente publicaciones dispersas, ofreciendo una herramienta que asista a las personas en la identificación de posibles coincidencias entre casos de mascotas perdidas y encontradas.

# **3\. Propósito y objetivos**

## **3.1 Propósito**

El propósito de la plataforma es centralizar y organizar la información relacionada con las mascotas, brindando a sus dueños un espacio donde puedan registrar y gestionar sus mascotas, facilitar la búsqueda y difusión de mascotas perdidas y encontradas.

La plataforma busca simplificar este proceso, reuniendo en un mismo lugar información que actualmente se encuentra distribuida entre redes sociales, plataformas y otros medios.

## **3.2 Objetivos de la Fase 1**

La primera fase estará orientada a desarrollar y validar el flujo principal de RescPet: la publicación y búsqueda de mascotas perdidas y encontradas mediante criterios de cercanía geográfica y similitud visual.

Los objetivos principales son:

● Permitir el registro e inicio de sesión de usuarios.

● Permitir publicar mascotas perdidas y encontradas, incorporando especie, fecha, características descriptivas, una fotografía principal y ubicación.

● Permitir consultar y buscar publicaciones de mascotas perdidas y encontradas.

● Implementar una búsqueda de candidatos basada en la especie y en un radio de cercanía geográfica.

● Incorporar un mecanismo de comparación visual entre fotografías de mascotas mediante una biblioteca o modelo preexistente.

● Presentar un listado ordenado de posibles coincidencias, mostrando información relevante como la distancia aproximada y el nivel o puntaje de similitud utilizado para ordenar los resultados.

● Permitir que la persona usuaria revise las posibles coincidencias y contacte al responsable de la publicación.

● Mantener la decisión final en manos de la persona usuaria, sin que el sistema confirme automáticamente la identidad de una mascota.

## **3.3 Objetivos medibles**

Al finalizar la Fase 1 se espera cumplir con los siguientes objetivos:

* Lograr que las publicaciones utilizadas para la búsqueda de coincidencias cuenten con los datos mínimos requeridos: especie, fecha, fotografía principal y ubicación.   
* Recuperar correctamente los candidatos que se encuentren dentro del radio de búsqueda establecido, excluyendo los casos que pertenezcan a otra especie o se encuentren fuera del radio definido.  
* Presentar los resultados de posibles coincidencias en un ranking limitado, priorizando los candidatos con mayor similitud visual y menor distancia geográfica.  
* Evaluar el mecanismo de comparación visual mediante un conjunto de fotografías de prueba que incluya imágenes de una misma mascota tomadas desde diferentes posiciones o ángulos y fotografías de mascotas diferentes.  
* Registrar y analizar los casos de falsos positivos y falsos negativos detectados durante las pruebas del mecanismo de comparación visual.  
* Permitir que el usuario pueda revisar una posible coincidencia y acceder a la información necesaria para contactar al responsable de la publicación.  
* Verificar mediante pruebas que una publicación correspondiente a una especie diferente o ubicada fuera del radio establecido no sea presentada como candidata.

# **4\. Público objetivo y actores**

La plataforma está dirigida principalmente a personas que tienen una o más mascotas, así como a personas que hayan perdido o encontrado una mascota. También contará con un usuario administrador encargado de gestionar información general de la plataforma. 

##  **4.1 Actores del sistema**

Usuario registrado

Es la persona que utiliza la plataforma para gestionar sus mascotas y acceder a las funcionalidades relacionadas con mascotas perdidas y encontradas. Puede:

* Registrar, modificar y consultar sus mascotas.  
* Cargar y consultar la fotografía principal de sus mascotas.  
* Publicar una mascota como perdida o encontrada.  
* Buscar y filtrar publicaciones.  
* Solicitar la búsqueda de posibles coincidencias.  
* Consultar los resultados de posibles coincidencias.  
* Consultar y responder publicaciones.  
* Contactar al responsable de una publicación.  
* Recibir notificaciones relacionadas con el flujo de posibles coincidencias.  
* Cambiar manualmente el estado de una publicación.

Administrador

Es la persona encargada de administrar la información general de la plataforma. Puede:

* Administrar y supervisar publicaciones de mascotas según las reglas definidas para la plataforma.

## **4.2 Personas**

**María, dueña de mascotas**

María tiene dos mascotas y quiere mantener en un solo lugar su información y fotografías Utiliza la plataforma para registrar sus mascotas.

**Lucas, dueño de una mascota perdida**

Lucas perdió a su perro y necesita difundir rápidamente información sobre él. Utiliza la plataforma para publicar el caso con fotografías, características y ubicación. También puede realizar búsquedas para encontrar posibles coincidencias con mascotas encontradas y recibir respuestas de otros usuarios.

**Sofía, persona que encuentra una mascota**

Sofía encuentra una mascota que parece estar perdida. Luego de registrarse en la plataforma, publica la información y fotografías del animal para facilitar que su dueño pueda encontrarla. También puede consultar las publicaciones existentes para comprobar si alguien está buscando una mascota con características similares.

#    **5\. Alcance**

## **5.1 Incluido en fase 1**

El alcance incluye las siguientes funcionalidades:

**Gestión de usuarios**

* Registro de usuarios.  
* Inicio de sesión y control de acceso.

Publicación de mascotas perdidas y encontradas

* Registro de una mascota perdida o encontrada.  
* Especie de la mascota.  
* Fecha del caso.  
* Características descriptivas.  
* Carga de una fotografía principal.  
* Registro de una ubicación asociada al caso.

Búsqueda de mascotas

* Búsqueda manual de publicaciones.  
* Filtrado de candidatos por especie.  
* Filtrado de candidatos mediante un radio de cercanía geográfica (5km).  
* Consulta de publicaciones compatibles con una mascota perdida o encontrada.

Búsqueda de posibles coincidencias

* Solicitud de posibles coincidencias por parte del usuario.  
* Comparación de la fotografía principal de una publicación con las fotografías de publicaciones candidatas mediante técnicas de similitud visual.  
* Generación de un listado ordenado de posibles coincidencias.  
* Presentación de la distancia geográfica aproximada y de información que permita comprender el motivo de la sugerencia.  
* Las coincidencias serán orientativas y deberán ser revisadas por la persona usuaria.

Consulta y contacto

* Visualización del detalle de una publicación.  
* Posibilidad de responder o contactar al responsable de una publicación mediante los mecanismos disponibles en la plataforma.  
* Cambio manual del estado de una publicación.

##  **5.2 Fuera de alcance**

Las siguientes funcionalidades no forman parte de la primera fase del proyecto y podrán considerarse como posibles ampliaciones futuras:

* Libreta sanitaria digital y gestión de vacunas.  
* Recordatorios de vacunación y otras notificaciones sanitarias.  
* Directorio administrable de veterinarias y asociaciones.  
* Mapa o directorio de puntos de ayuda.  
* Generación e impresión de publicaciones en formato PDF.  
* Integración con redes sociales y publicación automática en plataformas externas.  
* Notificaciones automáticas que no estén directamente relacionadas con el flujo de posibles coincidencias.  
* Comparación de múltiples fotografías por publicación.  
* Entrenamiento de un modelo propio de reconocimiento visual.  
* Detección de mascotas en tiempo real.

## **5.3 Supuestos y límites del alcance**

Para el desarrollo de la primera fase se consideran los siguientes supuestos y límites:

* Las publicaciones de mascotas perdidas y encontradas deberán contar como mínimo con especie, fecha, una fotografía principal, características descriptivas y una ubicación asociada.  
* La búsqueda de posibles coincidencias será solicitada por el usuario y se realizará inicialmente utilizando la especie y la cercanía geográfica.  
* El sistema utilizará un radio de búsqueda de 5km para recuperar publicaciones candidatas. El valor definitivo del radio será establecido durante el desarrollo y las pruebas del sistema.  
* Una vez obtenidos los candidatos compatibles, el sistema comparará la fotografía principal de la publicación con las fotografías de los casos candidatos mediante una técnica de similitud visual basada en una biblioteca o modelo preexistente.  
* El sistema presentará un conjunto limitado y ordenado de posibles coincidencias. La similitud visual y la distancia geográfica serán utilizadas como elementos de apoyo para ordenar y explicar los resultados.  
* Las coincidencias generadas por el sistema serán únicamente sugerencias orientativas y no garantizarán que las mascotas correspondan al mismo animal. La confirmación quedará siempre a cargo de la persona usuaria.  
* Inicialmente, el reconocimiento visual estará limitado a perros y gatos y a una fotografía principal por publicación.  
* El sistema no entrenará un modelo propio de reconocimiento visual durante esta fase.  
* Una ubicación exacta podrá utilizarse internamente para realizar las búsquedas de cercanía, pero no deberá exponerse públicamente sin consentimiento.  
* Si no existen candidatos dentro del radio establecido, la fotografía no posee características suficientes para realizar la comparación o el servicio de análisis no se encuentra disponible, el sistema deberá permitir continuar utilizando la búsqueda y consulta manual de publicaciones.

#  **6\. Descripción funcional**

## **6.1 Gestión de usuarios**

La plataforma permitirá que las personas se registren para utilizar sus funcionalidades. Cada usuario contará con una cuenta que le permitirá acceder a la información de sus mascotas y a las publicaciones que haya realizado.

Para registrarse, el usuario deberá proporcionar los datos necesarios para crear su cuenta y establecer sus credenciales de acceso. Una vez registrado, podrá iniciar sesión y acceder a las funcionalidades disponibles para usuarios.

El usuario podrá consultar y modificar sus datos personales y será responsable de mantener actualizada la información asociada a su cuenta.

Todas las funciones que impliquen registrar mascotas, publicar mascotas perdidas o encontradas, responder publicaciones o recibir información personalizada requerirán que el usuario haya iniciado sesión.

## **6.2 Gestión de mascotas**

La plataforma permitirá que cada usuario registre una o más mascotas asociadas a su cuenta. Para cada mascota se podrá almacenar información básica como nombre, especie, fecha de nacimiento y características que permitan identificarla.

Cada mascota podrá tener una fotografía principal asociada para utilizarla en las publicaciones de mascotas perdidas o encontradas y en el mecanismo de búsqueda de posibles coincidencias.

El usuario podrá consultar y modificar la información de sus mascotas y mantener actualizados sus datos de identificación.

La libreta sanitaria digital y el registro de información relacionada con vacunas, controles y otros registros sanitarios quedan previstos como una ampliación posterior y no forman parte de la primera fase del proyecto.

##   **6.3 Mascotas perdidas y encontradas**

Los usuarios podrán publicar avisos de mascotas perdidas o encontradas, indicando como mínimo la especie, fecha, características descriptivas, una fotografía principal y una ubicación asociada al caso.

El sistema permitirá realizar búsquedas manuales de publicaciones y solicitar la búsqueda de posibles coincidencias.

Cuando se solicite una búsqueda de coincidencias, el sistema realizará inicialmente un filtrado de las publicaciones según la especie y la cercanía geográfica, utilizando un radio de búsqueda definido.

Sobre los candidatos obtenidos se realizará una comparación de la fotografía principal mediante técnicas de similitud visual, utilizando una biblioteca o modelo preexistente. El objetivo será identificar características similares entre las fotografías, incluso cuando hayan sido tomadas desde diferentes posiciones o ángulos.

Los resultados se presentarán en forma de un ranking de posibles coincidencias, considerando la similitud visual y la distancia geográfica. Para cada resultado se mostrará información relevante, como la distancia aproximada y el orden o puntaje de similitud utilizado para generar la sugerencia.

Las coincidencias serán únicamente orientativas y no representarán una confirmación de identidad. La persona usuaria deberá revisar la información de la publicación y decidir si existe una posible correspondencia. En caso de considerarlo necesario, podrá contactar al responsable de la publicación mediante los mecanismos disponibles en la plataforma.

El sistema no modificará automáticamente el estado de una publicación como consecuencia de una coincidencia. El cambio de estado será realizado manualmente por la persona usuaria.

## **6.4 Notificaciones**

La plataforma contará con un sistema de notificaciones asociado al flujo de búsqueda de posibles coincidencias entre mascotas perdidas y encontradas.

Cuando el usuario solicite una búsqueda de posibles coincidencias, el sistema podrá informar mediante una notificación cuando se encuentren resultados que cumplan con los criterios definidos de especie, proximidad geográfica y similitud visual.

Las búsquedas de posibles coincidencias no se realizarán de manera automática. El usuario deberá solicitar la búsqueda cuando lo considere necesario.

Las notificaciones estarán asociadas a la cuenta del usuario y permitirán consultar el motivo por el cual fueron generadas.

Las notificaciones relacionadas con eventos sanitarios, como vacunas, controles u otros eventos de la libreta sanitaria, quedan fuera del alcance del MVP y podrán incorporarse en una etapa posterior.

## **6.5 Mapa y lugares de ayuda**

La plataforma podrá contar con un mapa destinado a facilitar la consulta de lugares relacionados con el cuidado y la búsqueda de mascotas.

Entre los lugares que podrán incorporarse se incluyen:

* Veterinarias.  
* Asociaciones relacionadas con animales.  
* Puntos de encuentro.

Cada lugar contará con información básica que permita al usuario identificarlo y conocer su ubicación.

Los lugares mostrados en el mapa podrán ser administrados por el administrador de la plataforma, quien podrá agregar, modificar o eliminar la información correspondiente.

Esta funcionalidad queda fuera del alcance del MVP y podrá incorporarse en una etapa posterior del proyecto.

## **6.6 Administración**

La plataforma contará con un usuario administrador encargado de supervisar determinados contenidos del sistema y aplicar las reglas de moderación definidas para la plataforma.

El administrador podrá:

* Consultar y supervisar las publicaciones de mascotas perdidas y encontradas.  
* Gestionar aquellas publicaciones que requieran intervención administrativa, de acuerdo con las reglas definidas para la plataforma.  
* Atender contenidos que incumplan las reglas establecidas.  
* Aplicar las acciones correspondientes sobre contenidos.

La administración de veterinarias, asociaciones y puntos de encuentro queda fuera del alcance del MVP y podrá incorporarse en una etapa posterior.

La gestión administrativa permitirá mantener un entorno seguro y adecuado para la publicación y consulta de casos de mascotas perdidas y encontradas.

**7\. Requerimientos no funcionales**

## **7.1 Seguridad**

La plataforma deberá proteger la información de los usuarios y de sus mascotas mediante mecanismos de autenticación y control de acceso.

* Las funcionalidades que requieren una cuenta deberán estar disponibles únicamente para usuarios registrados e identificados.  
* Cada usuario podrá modificar y consultar únicamente la información que le corresponda, de acuerdo con los permisos definidos por el sistema.  
* Las funciones de administración estarán disponibles únicamente para el usuario con rol de administrador.  
* Las credenciales de acceso deberán almacenarse de forma segura y no podrán guardarse como texto visible.  
* La información personal de los usuarios no deberá mostrarse públicamente sin que corresponda a una funcionalidad del sistema.

## **7.2 Rendimiento**

La plataforma deberá ofrecer tiempos de respuesta adecuados para que los usuarios puedan utilizar sus funcionalidades de manera fluida.

* Las operaciones habituales, como iniciar sesión, consultar mascotas y cargar publicaciones, deberán responder en un tiempo máximo de 3 segundos bajo condiciones normales de uso.  
* Las búsquedas y filtros de mascotas perdidas y encontradas deberán mostrar los resultados en un tiempo máximo de 3 segundos bajo condiciones normales de uso.  
* La carga y consulta de fotografías deberá realizarse de manera que no afecte significativamente el uso del resto de las funcionalidades.

## **7.3 Usabilidad y accesibilidad**

La plataforma deberá presentar una interfaz clara y sencilla, de manera que las personas puedan utilizar sus funcionalidades sin necesidad de contar con conocimientos informáticos.

* La navegación deberá ser clara y mantener una estructura consistente en las diferentes secciones.  
* Las opciones principales, como registrar una mascota, publicar una mascota perdida o encontrada y realizar una búsqueda, deberán ser fáciles de localizar.  
* Los formularios deberán indicar claramente qué información debe ingresar el usuario.  
* Los mensajes de error deberán explicar de manera sencilla qué problema ocurrió y, cuando sea posible, cómo solucionarlo.  
* La información importante, como el estado de una publicación, deberá mostrarse de forma clara.  
* La plataforma deberá poder utilizarse desde computadoras mediante una interfaz adaptable al tamaño de pantalla.

## **7.4 Disponibilidad y confiabilidad**

La plataforma deberá mantener un funcionamiento estable y evitar la pérdida de información ingresada por los usuarios.

* Las operaciones realizadas correctamente deberán guardar la información de forma persistente.  
* Ante un error durante una operación, el sistema deberá informar al usuario que la acción no pudo completarse y evitar guardar información incompleta.  
* La información registrada sobre usuarios, mascotas y publicaciones deberá conservarse mientras se encuentre activa en el sistema.  
* El sistema deberá validar los datos ingresados antes de almacenarlos para reducir errores y evitar información incompleta o inválida.  
* Cuando una funcionalidad no se encuentre disponible temporalmente, el sistema deberá informar al usuario de manera clara en lugar de quedar sin respuesta.

# **8\. Arquitectura preliminar** 

La plataforma se desarrollará como una aplicación web, accesible desde computadoras. La solución estará compuesta por un frontend, un backend, una base de datos, servicios para el procesamiento de imágenes y un servicio de mapas.

### **8.1 Frontend**

La interfaz de usuario será desarrollada utilizando:

* **React 19**, como framework principal para el desarrollo de la aplicación web.  
* **Vite 6**, como herramienta de construcción y servidor de desarrollo.  
* **JavaScript y TypeScript**, como lenguaje principal de desarrollo.  
* **Tailwind CSS 4**, para la construcción y adaptación de los componentes visuales.  
* **CSS3**, para los estilos personalizados de la aplicación.  
* **Lucide React**, para los íconos de la interfaz.  
* **Motion**, para las animaciones y transiciones de la interfaz.  
* **Axios**, para el manejo de operaciones asíncronas y comunicación con los servicios del sistema.  
* **Leaflet y React Leaflet 5**, para la visualización de información geográfica asociada a los casos de mascotas perdidas y encontradas.   
* **React Router 7**, para la gestión de rutas y navegación de la aplicación.

El frontend se comunicará con el backend mediante una API REST.

### **8.2 Backend**

El servidor de la aplicación será desarrollado utilizando:

* **Java 17**, como lenguaje de programación.  
* **Spring Boot 3.3.9**, como framework principal.  
* **Spring Web MVC**, para la implementación de la API REST.  
* **Spring Data JPA**, para la persistencia de los datos.  
* **Hibernate 6.5**, como implementación de JPA.  
* **Spring Security**, para la autenticación y autorización de usuarios.  
* **JSON Web Tokens (JWT)** mediante **JJWT 0.11.5**, para la gestión de los tokens de autenticación.  
* **Lombok**, para reducir código repetitivo en las clases del backend.  
* **Apache Maven**, para la gestión de dependencias y construcción del proyecto.

El backend será responsable de procesar las solicitudes provenientes del frontend, aplicar las reglas de negocio, gestionar usuarios, mascotas, publicaciones, notificaciones relacionadas con posibles coincidencias y permisos de acceso, además de comunicarse con la base de datos.

### **8.3 Base de datos**

La información de la plataforma será almacenada utilizando:

* **PostgreSQL 16.4**, como sistema gestor de base de datos.  
* **PostGIS 3.4**, para el manejo de información geográfica y coordenadas asociadas a los lugares registrados en la plataforma.

La base de datos almacenará información de usuarios, mascotas, fotografías, publicaciones y notificaciones relacionadas con posibles coincidencias, además de la información geográfica necesaria para realizar las búsquedas de proximidad. 

### **8.4 Procesamiento de imágenes**

La plataforma incorporará un componente destinado a la comparación de fotografías de mascotas mediante **Embeddings visuales** y **Similitud Coseno** (*Content-Based Image Retrieval*).

Esta funcionalidad permitirá:

* **Extraer representaciones vectoriales:** Obtener un vector denso de características visuales (color, textura de pelaje y forma) a partir de la foto principal mediante un modelo preentrenado ligero (como MobileNet o ResNet).  
* **Comparar candidatos bajo demanda:** Calcular la similitud matemática (similitud coseno) entre la imagen del caso y los avisos previamente filtrados por especie y cercanía geográfica.  
* **Generar un ranking orientativo:** Ordenar y presentar las mejores coincidencias sugeridas (Top-N) con un puntaje de similitud referencial.

La implementación se realizará reutilizando bibliotecas de código abierto y modelos preexistentes, sin entrenar clasificadores propios durante la primera fase.

**8.5 Infraestructura y despliegue**

Para facilitar la ejecución y configuración de los diferentes componentes del sistema se utilizarán:

* **Docker**, para la creación y ejecución de contenedores.  
* **Docker Compose**, para la gestión conjunta de los servicios.  
* **Node.js 20**, utilizado para el entorno de desarrollo y ejecución del frontend.  
* Imágenes de contenedor basadas en **PostGIS**, **Maven con Java 17** y **Node.js**.

### **8.6 Pruebas**

Para verificar el correcto funcionamiento de la aplicación se utilizarán herramientas de testing y BDD, entre ellas:

* **Cucumber.js**, para la definición y ejecución de escenarios de comportamiento.  
* **Axios / Supertest**, para las pruebas de los servicios de la API REST.  
* **Chai**, para las aserciones de las pruebas.

### **8.7 Comunicación entre componentes**

La comunicación entre el frontend y el backend se realizará mediante una **API REST**. El backend procesará las solicitudes, aplicará las reglas de negocio y accederá a la información almacenada en PostgreSQL.

El componente de procesamiento de imágenes permitirá analizar las fotografías asociadas a las mascotas para obtener posibles coincidencias. Por otra parte, **Leaflet** permitirá visualizar la información geográfica registrada en la plataforma.

# **9\. Supuestos y restricciones** 

Para el desarrollo de la primera fase se consideran los siguientes supuestos y restricciones:

● La primera fase estará enfocada en perros y gatos.

● Las publicaciones de mascotas perdidas y encontradas deberán contar con especie, fecha, una fotografía principal, características descriptivas y una ubicación asociada.

● La búsqueda de posibles coincidencias utilizará la especie y un radio de cercanía geográfica definido por el sistema.

● La ubicación exacta podrá utilizarse internamente para realizar las búsquedas geográficas, pero se mostrará públicamente una ubicación aproximada para proteger la privacidad de las personas usuarias.

● El reconocimiento visual se realizará mediante una biblioteca o modelo preexistente de comparación de imágenes. No se entrenará un modelo propio durante la primera fase.

● La comparación visual se limitará inicialmente a una fotografía principal por publicación.

● Las posibles coincidencias serán sugerencias orientativas. El sistema no garantizará que dos publicaciones correspondan a la misma mascota ni modificará automáticamente el estado de un caso.

● El sistema deberá contemplar situaciones en las que una fotografía no posea características suficientes para realizar una comparación, no existan candidatos dentro del radio establecido o el servicio de análisis visual no se encuentre disponible.

● El funcionamiento del mecanismo de coincidencias será evaluado mediante un conjunto de fotografías de prueba que incluya casos de la misma mascota tomadas desde diferentes posiciones o ángulos y casos correspondientes a mascotas diferentes.

● Las funcionalidades que no formen parte del MVP podrán ser consideradas en futuras ampliaciones una vez validado el flujo principal de búsqueda de posibles coincidencias.

# **10\. Riesgos**

Durante el desarrollo de la primera fase se identifican los siguientes riesgos:

* **Alcance excesivo:** incorporar nuevas funcionalidades durante el desarrollo podría dificultar el cumplimiento del plazo de tres meses. Para reducir este riesgo, se mantendrá el alcance definido para la primera fase y las funcionalidades adicionales se considerarán para futuras etapas.  
* **Complejidad en el procesamiento de fotografías:** la comparación visual puede verse afectada por la calidad, iluminación, ángulo o características visibles de las fotografías. Para reducir este riesgo, la primera fase utilizará una única fotografía principal por publicación y una biblioteca o modelo preexistente de comparación visual.   
* **Información incorrecta o incompleta:** los usuarios podrían ingresar datos incorrectos sobre sus mascotas o publicaciones, afectando la utilidad de las búsquedas. Para reducir este riesgo, se realizarán validaciones sobre los datos ingresados y se solicitará la información necesaria para cada publicación.  
* **Resultados incorrectos en la comparación visual:** el mecanismo de similitud de imágenes puede generar falsos positivos o falsos negativos, especialmente cuando las fotografías presentan diferentes ángulos, iluminación, calidad o características visibles de la mascota.   
* **Problemas técnicos durante el desarrollo:** pueden surgir dificultades relacionadas con la implementación, integración o pruebas de las diferentes funcionalidades. Para reducir este riesgo, se priorizarán las funcionalidades principales de la primera fase y se realizarán pruebas durante el desarrollo.  
* **Ausencia de candidatos:** puede no existir ninguna publicación compatible dentro del radio establecido. Informar claramente al usuario que no se encontraron posibles coincidencias y permitir continuar con la búsqueda manual. 

# **11\. Criterios de éxito**

Se considerará que la primera fase del proyecto fue exitosa si se cumplen los siguientes criterios:

* Los usuarios pueden registrarse e iniciar sesión correctamente.  
* Los usuarios pueden registrar y gestionar sus mascotas y su información básica.  
* Los usuarios pueden publicar mascotas perdidas y encontradas incorporando especie, fecha, características, una fotografía principal y ubicación.  
* Los usuarios pueden consultar y buscar publicaciones mediante filtros básicos.  
* El sistema permite solicitar una búsqueda de posibles coincidencias entre publicaciones.  
* La búsqueda de candidatos filtra correctamente por especie y radio de proximidad geográfica.  
* El sistema puede comparar fotografías mediante una biblioteca o modelo preexistente y generar un ranking de posibles coincidencias.  
* Los resultados muestran información que permite comprender la sugerencia, incluyendo distancia aproximada y orden o puntaje de similitud.  
* El sistema no confirma automáticamente la identidad de una mascota ni modifica automáticamente el estado de una publicación.  
* El usuario puede revisar una posible coincidencia y contactar al responsable de la publicación.  
* Se verifica mediante pruebas que los casos pertenecientes a otra especie o ubicados fuera del radio establecido no sean presentados como candidatos.  
* El mecanismo de comparación visual es evaluado utilizando fotografías de la misma mascota desde diferentes ángulos y fotografías de mascotas diferentes.  
* Se registran y analizan los falsos positivos y falsos negativos detectados durante las pruebas.  
* Las funcionalidades principales del MVP se encuentran implementadas y probadas antes de la entrega.

# **12\. Visión a largo plazo**

A futuro, la plataforma podrá ampliarse para incorporar nuevas funcionalidades que permitan mejorar la gestión y búsqueda de mascotas.

Entre las posibles ampliaciones se consideran:

* Ampliar el sistema para incluir otras especies de animales además de perros y gatos.  
* Incorporar nuevos servicios y organizaciones relacionadas con el cuidado y protección de animales.  
* Integrar beneficios y servicios para los usuarios mediante acuerdos con comercios y organizaciones relacionadas con mascotas.  
* Ampliar las herramientas de búsqueda y comunicación entre usuarios.  
* Incorporar la ubicación de una mascota perdida en el mapa para facilitar la identificación de la zona donde fue reportada.   
* Incorporar una libreta sanitaria digital.   
* Incorporar recordatorios sanitarios.   
* Incorporar un mapa/directorio de veterinarias, asociaciones y puntos de ayuda.   
* Permitir múltiples fotografías por publicación. 

Estas funcionalidades dependerán de las necesidades detectadas luego de la implementación de la primera fase y de los recursos disponibles para futuras etapas.

# **Anexo: Glosario**

**Fauna Urbana:** Área o sección municipal relacionada con la atención y gestión de animales en la ciudad.

**Zoonosis:** Área o servicio encargado de la atención y alojamiento de animales bajo responsabilidad municipal.

**Libreta sanitaria digital:** Registro digital donde se almacena información relacionada con la salud de una mascota, como vacunas, controles y otros registros sanitarios.

**Publicación:** Registro de información visible en la plataforma relacionado con una mascota perdida o encontrada.

**Posible coincidencia:** Resultado obtenido cuando el usuario solicita una búsqueda y el sistema encuentra publicaciones cuyos datos coinciden con los criterios seleccionados, como especie y ubicación. No significa que se haya confirmado que se trata de la misma mascota.

**Paginación:** Forma de organizar los resultados de una búsqueda en varias páginas para facilitar su consulta.

**Sistema de análisis de imágenes:** Funcionalidad de la plataforma que permite comparar fotografías de mascotas mediante la extracción de embeddings visuales y cálculo de similitud coseno para ordenar posibles coincidencias orientativas.

**Similitud visual:** medida utilizada para comparar características entre fotografías de mascotas y ordenar posibles coincidencias. No representa una probabilidad ni garantiza que las imágenes correspondan al mismo animal. 

**MVP (Producto Mínimo Viable):** Versión inicial de la plataforma que contiene únicamente las funcionalidades esenciales necesarias para validar la propuesta principal del proyecto. 