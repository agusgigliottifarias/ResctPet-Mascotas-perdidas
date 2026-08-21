# Imagen ligera de Node.js 20 LTS para React + Vite 6
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /home/node/cli

# Exponer el puerto del servidor de desarrollo dev de Vite
EXPOSE 4200

# Variable de entorno de terminal
ENV PS1="[frontend:\W]\$ "

# Comando por defecto para iniciar Vite escuchendo en 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]