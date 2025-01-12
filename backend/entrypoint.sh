#!/bin/sh

handle_error() {
  echo "ERROR: $1"
  exit 1
}

echo "Running Database Migrations"
cd api
python manage.py makemigrations || handle_error "Falha ao criar migrações"
python manage.py migrate || handle_error "Falha ao transferir migrações para a DB"

echo "Starting the application"
python manage.py runserver 0.0.0.0:8000
printf "\033[36mAll set! your application is running at http://localhost:8000\033[0m\n"

exec "$@"