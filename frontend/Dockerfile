# Laboratorio de Programación y Lenguajes
# FI-UNPSJB-PM
#
# Imagen para el desarrollo del client side (angular.io)
# Destinada para utilizar en el desarrollo del trabajo de laboratorio.
FROM node:alpine

# Agrega la linea de comando bash
RUN apk update && apk add --no-cache bash && apk add --no-cache sudo

# Instala los paquetes de dependencias
RUN npm install -g typescript
RUN npm install -g @angular/cli@19.2.23

# Establece el directorio de trabajo
WORKDIR /home/node

# Expone el puerto donde se ejecuta la aplicación para ser accedida desde afuera
# (Esta imagen también es apta para desearrollar servidores node, se expone el puerto 3000 para ese fin)
EXPOSE 4200
EXPOSE 3000

# Crea la aplicación
ENV NG_CLI_ANALYTICS="false"

# Establece la variable de entorno para definir el prompt de la terminal
ENV PS1="[frontend:\W]\$ "

# Por defecto ejecuta el comando bash
CMD [ "bash" ]