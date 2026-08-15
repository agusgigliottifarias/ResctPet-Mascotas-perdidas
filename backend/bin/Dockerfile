# FROM eclipse-temurin:17-jdk-alpine
FROM maven:3-eclipse-temurin-17-alpine
# RUN apk update && apk upgrade
# RUN apk add inotify-tools
# RUN apk add dos2unix

ENV HOME=/app
RUN mkdir -p $HOME

WORKDIR $HOME

ENV PS1="[backend:\W]\$ "