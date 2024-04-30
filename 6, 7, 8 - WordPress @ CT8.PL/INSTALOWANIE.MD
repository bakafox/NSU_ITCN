# 7. Устанаваливаем WordPress

[CT8.PL](https://www.ct8.pl/) — бесплатный польский хостинг для... практически всего. Он часто используется для создания беслпатных серверов видеоигр, но никто не запрещает поставить и вордпресс:

0. Регистрируемся (нужен **польский** VPN), входим в панель админа.

1. В панели добавляем новый WWW-домен с типом PHP:

    ![alt text](<Dodaj nową stronę-1.png>)

2. Удаляем стандартную заглушку из `public_html`, вместо неё ложим туда вордпресс:

    ```
    cd ~/domains/itcn.ct8.pl/public_html
    rm index.html

    wget https://wordpress.org/latest.tar.gz
    tar -xzf latest.tar.gz -C .
    rm ./latest.tar.gz
    mv wordpress/* .
    ```

    На этом установка WP закончена *(да, всё настолько просто!)*

3. WordPress использует MySQL в качестве БД, поэтому нам нужно создать новую базу данных MySQL в панели:

    ![alt text](<Dodaj bazę-1.png>)

4. Проходим стандартную установку WordPress, используя данные выше. При этом не забываем поменять адрес сервера БД на `ct8.pl`!

    ![alt text](<WordPress › Tworzenie pliku konfiguracyjnego-1.png>)

5. **Tadaa!** На этом установка и настройка WordPress на CT8.PL окончена.

    ![alt text](<Sieć Komputerowa-1.png>)



# 8. Увеличиваем максимальный размер загружаемых файлов

MyDevil (движок CT8.PL) не позволяет менять глобальные конфиги PHP (да и чего угодно другого, что лежит вне `~`) напрямую, но [можно менять некоторые параметры](https://wiki.mydevil.net/PHP) ([включая размер загрузок](https://www.php.net/manual/ru/ini.core.php)) через файлик per-directory конфигурации PHP `~/.user.ini`:

```
# max allowed uploadable file size
upload_max_filesize = 666M

# max allowed data size sent via POST
# (should be HIGHER OR EQUAL than "upload_max_filesize")
post_max_size = 666M

# PHP memory (RAM) per-process limit
# (should be HIGHER than both "upload_max_filesize" and "post_max_size")
memory_limit = 999M
```

В некоторых источниках ещё написано, что ещё нужно чёто в самом Вордпрессе менять, но у меня что на виртуалке, что на хосте значения подтягиваются автомагически.

Ну и собственно вот, всё работает, образ debian (~660 МБ) загружается спокойно, а образ xubuntu (~1800 МБ) выдаёт ошибку превышения максимального размера:

![alt text](<Biblioteka mediów ‹ Sieć Komputerowa — WordPress-1.png>)

*З.Ы: По умолчанию исошники загружать через WordPress нельзя, потому что этот тип файлов запрещён. Но можно поставить [этот плагин](https://pl.wordpress.org/plugins/wp-extra-file-types/) и настроить разрешённые типы по своему вкусу.*



# 6. Блокируем доступ к сайту из РФ

А вот тут начинаются некоторые костыли... Из-за обрезанных привелегий и отсутствия модуля GeoIP мы не можем реализовать блокировку по-нормальному. Единственный подходящий инструмент, который у нас для этого есть — это локальный **(!)** `.htaccess`.

Для этого воспользуемся [rufilter](https://ipv4.fetus.jp/krfilter) (редакция eufilter для блокировки всех IP-адресов из РФ/РБ). В принципе подойдёт любой подобный список, просто он мне первый попался на глаза. Скачиваем версию для Apache, переименовываем в `.htaccess` и кидаем в корень домена (не в `public_html`, иначе перезапишется `.htaccess` самого ВордПресса).

Пробуем зайти с ру-айпишника, и...

![alt text](<CT8.pl - Darmowy hosting WWW - 403 Zabroniony dostęp-1.png>)

Можно заменить страницу ошибки на что-нибудь более интересное, если добавить в тот же файл редирект ошибки типа `ErrorDocument 403 ./blocked.html`, но для задания, тащемта, сойдёт и стандартная заглушка хостинга.



*That's all Folks!*
