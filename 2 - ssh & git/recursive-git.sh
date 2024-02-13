#!/bin/bash
# (этот скрипт предполагает, что ssh ключ уже
# сгенерирован и добавлен в настройках GitHub)

touch "$(date)"
cd ..
git add .
git commit -m "Тестовый коммит от $(date)"
git remote add origin git@github.com:bakafox/NSU_ITCN.git
git push -u origin master
