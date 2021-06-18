# Secret Keeper
Привет, это описание проекта

## Инструкция по установке:
1Скопируйте исходный код проекта в выбранную вами директорию, выполнив в терминале следующую команду: 
```
git clone https://github.com/Futusio/secret-keeper.git
```

1. Клонировать репозиторий git clone link
2. Установить переменные окружения в docker-compose.yml
3. sudo docker-compose build
4. запустить sudo docker-compose up -d 
5. sudo docker-compose exec web python manage.py migrate --noinput
6. sudo docker-compose exec web python manage.py createsuperuser
7. sudo docker-compose exec db psql --username=admin --dbname=database

1. asd
