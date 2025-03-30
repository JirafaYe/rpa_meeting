FROM openjdk:8-jdk-alpine

# 安装字体库和配置工具
RUN apk update && \
    apk add --no-cache ttf-dejavu fontconfig && \
    fc-cache -f -v  # 强制刷新字体缓存

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

# Set JVM memory options
ENV JAVA_OPTS="-Xms128m -Xmx256m"

ENTRYPOINT ["java","-jar","app.jar"]