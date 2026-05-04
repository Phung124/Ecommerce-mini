# --- Stage 1: Build ứng dụng bằng Maven ---
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
# Copy file cấu hình Maven và toàn bộ mã nguồn vào
COPY pom.xml .
COPY src ./src
# Chạy lệnh build ra file .jar (bỏ qua test để build nhanh hơn)
RUN mvn clean package -DskipTests

# --- Stage 2: Chạy ứng dụng ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Lấy file .jar đã được build từ Stage 1 sang
COPY --from=build /app/target/*.jar app.jar

# Mở cổng 8080
EXPOSE 8080

# Lệnh khởi chạy
ENTRYPOINT ["java","-jar","app.jar"]
