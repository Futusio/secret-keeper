# Secret Keeper
Secret keeper - это программный комплекс управления паролями на предпрятии.  
Программный комплекс разворачивается в локальной сети предприятия. Администратор создает профили сотрудников и управляет парольными политиками. 


## Инструкция по установке:
1. Скопируйте исходный код проекта в выбранную вами директорию, выполнив в терминале следующую команду: 
```
git clone https://github.com/Futusio/secret-keeper.git
```
2. Установить переменные окружения в файл docker-compose.yml
3. Соберите образ, выполнив в терминале команда:
```
sudo docker-compose build
```
6.
7.  запустить sudo docker-compose up -d 
8. sudo docker-compose exec web python manage.py migrate --noinput
9. sudo docker-compose exec web python manage.py createsuperuser
10. sudo docker-compose exec db psql --username=admin --dbname=database

1. asd
