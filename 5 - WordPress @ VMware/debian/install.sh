#!/bin/bash
# developed for and created on Linux 6.1 Debian 12 (Bookworm) VM
# RUN AS ROOT ONLY!

echo "=== 1. Installing and configuring NGINX server..."
add-apt-repository ppa:nginx/stable
apt update
apt install nginx -y
export PATH=$PATH:/usr/sbin/nginx
sudo apachectl stop
sudo fuser -k 80/tcp
systemctl start nginx
systemctl enable nginx

echo "=== 2. Downloading and configuring PHP and MariaDB..."
apt install php php-curl php-fpm php-bcmath php-gd php-soap php-zip php-curl php-mbstring php-mysqlnd php-gd php-xml php-intl php-zip -y
apt install mariadb-server mariadb-client -y
echo "IN THE FOLLOWING DIALOG, TYPE THIS FOR EACH QUESTION RESPECTIVELY: "
echo "(empty), N, N, Y, Y, Y, Y"
mysql_secure_installation

echo "=== 3. Creating database for Wordpress..."
cd /var/www/html
mysql -u root -p -e "CREATE DATABASE itcn_wordpress_db; GRANT ALL PRIVILEGES ON itcn_wordpress_db.* TO 'itcn_admin'@'localhost' IDENTIFIED BY 'password12345'; FLUSH PRIVILEGES;"

echo "=== 4. Downloading and configuring Wordpress..."
wget https://wordpress.org/latest.tar.gz
tar -xzvf latest.tar.gz -C /var/www/html && rm latest.tar.gz
cd /var/www/html/wordpress
mv wp-config-sample.php wp-config.php
sed -ie "s/'DB_NAME', 'database_name_here'/'DB_NAME', 'itcn_wordpress_db'/" wp-config.php
sed -ie "s/'DB_USER', 'username_here'/'DB_USER', 'itcn_admin'/" wp-config.php
sed -ie "s/'DB_PASSWORD', 'password_here'/'DB_PASSWORD', 'password12345'/" wp-config.php
chown -R www-data:www-data /var/www/html/wordpress/

echo "=== Wordpress is up and running!"
echo "Now, for the server to be visible in host machine, do this:"
echo "1. In VM device settings, set Network Adapter type to Bridged;"
echo "   check 'Replicate physical network' to have Internet in VM too."
echo "2. In host machine, go to your firewall settings and ALLOW"
echo "   all TCPv4 connections on port 80."
echo "3. To check everything is working, try connecting to '0.0.0.0:80'."
