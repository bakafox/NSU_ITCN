#!/bin/bash
# this script estimates you already generated
# an SSH key and added it in GitHub settings

touch "$(date)"
cd ..
git add .
git commit -m "Тестовый коммит от $(date)"
git remote add origin git@github.com:bakafox/NSU_ITCN.git
git push -u origin master
