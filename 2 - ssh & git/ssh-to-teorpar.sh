#!/bin/bash
# commands sequence for configuring password-less
# logging in to NSU parallelism's theory server

cd ~
rm -rf ./.ssh
ssh-keygen -t rsa
ssh-copy-id -p 10023 v.chekhovskii@84.237.51.129
ssh v.chekhovskii@84.237.51.129 -p 10023

