#!/bin/bash
# последовательность команд, необходимая для настройки
# входа на сервер теории параллелизма без пароля

cd ~
rm -rf ./.ssh
ssh-keygen -t rsa
ssh-copy-id -p 10023 v.chekhovskii@84.237.51.129
ssh v.chekhovakii@84.237.51.129 -p 10023

