@echo off
echo Building Docker Image...
docker build -t bg-remover .

echo.
echo Running Container on http://localhost:8080...
docker run -p 8080:8080 bg-remover
