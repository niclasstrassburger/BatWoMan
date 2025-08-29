# Usa una imagen base de Python
FROM python:3.10

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo requirements.txt al directorio de trabajo
COPY requirements.txt .

# Instala las dependencias
RUN pip install -r requirements.txt

# Copia el resto de los archivos al directorio de trabajo
COPY . .

# Exponer el puerto 8001
EXPOSE 8001

# Comando para iniciar el servidor de desarrollo de Django en el puerto 8001
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
CMD ["gunicorn", "DjangoAPI.wsgi:application", "--workers", "3", "--bind", "0.0.0.0:8000","--access-logfile", "logs/access.log", "--error-logfile", "-"]