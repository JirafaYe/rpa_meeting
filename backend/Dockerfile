FROM openjdk:8-jdk-alpine

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

# Set JVM memory options
ENV JAVA_OPTS="-Xms128m -Xmx256m"

ENTRYPOINT ["java","-jar","app.jar"]