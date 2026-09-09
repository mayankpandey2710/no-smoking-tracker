# Stage 1: Build using official Maven image (avoids wrapper and OS mismatch issues)
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run using lightweight JRE
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]