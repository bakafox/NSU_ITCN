# https://linuxconfig.org/ubuntu-20-04-wordpress-with-nginx-installation
# https://www.tecmint.com/install-wordpress-with-nginx-in-ubuntu-20-04/
# https://www.youtube.com/watch?v=PsMhopODLTY
# commands sequence for running WordPress @ NGINX,
# on VMWare, made for and tested on Xubuntu 22.04

echo -e "\n=== 1. Installing and configuring NGINX..."
sudo systemctl stop apache2 && sudo apt remove apache2
sudo apt update
sudo apt install nginx -y && sudo nginx -t &&
read -p "
Now, to make localhost available on your host machine:

1. Go to VM settings and select 'Network Adapter'
2. Under Network connection, select 'Bridged'
and tick 'Replicate phyical network...', then Save
3. On host machine, go to your firewall and
ENABLE port forwarding on incoming IPv4 port 80
4. Now, when connecting to localhost:80,
you should see the NGINX placeholder screen.
If this is not happening, try typing 'ip addr'
in guest machine and then connect to the
IP addresses from the list, using port 80 too.

Press Enter once you're ready to continue. "

echo -e "\n=== 3. Installing and configuring DB..."
sudo apt install php-fpm php-mysql &&
sudo apt install mariadb-client mariadb-server &&
echo "IN THE FOLLOWING PROMPTS, ANSWER: (empty), n, n, y, y, y, y"
sudo mysql_secure_installation

sudo mariadb -e "
DROP DATABASE itcnwp_data;
CREATE DATABASE itcnwp_data;
DROP USER itcnwp_admin@localhost;
CREATE USER itcnwp_admin@localhost IDENTIFIED BY 'pass12321';
GRANT ALL PRIVILEGES ON itcnwp_data.* to itcnwp_admin@localhost;
FLUSH PRIVILEGES;
EXIT"

echo -e "\n=== 4. Downloading & Configuring WordPress..."
wget -O /tmp/wordpress.tar.gz https://wordpress.org/latest.tar.gz &&
sudo rm -r /var/www/wordpress
sudo tar -xzvf /tmp/wordpress.tar.gz -C /var/www &&
sudo chown -R www-data.www-data /var/www/wordpress &&
sudo rm /tmp/wordpress.tar.gz
sudo rm -r /var/www/html
read -e -p "
Enter your VM IP address (you can find
it using 'ip addr' in guest machine): " user_ip

sudo cp wordpress.conf /etc/nginx/sites-available &&
sudo sed -i "s/IP_ADDRESS_GOES_HERE/$user_ip/g" /etc/nginx/sites-available/wordpress.conf &&
sudo rm /etc/nginx/sites-enabled/wordpress.conf
sudo ln /etc/nginx/sites-available/wordpress.conf /etc/nginx/sites-enabled/
sudo service nginx restart

read -p "
Installation completed!

Now you only need to finish setting up Wordpress.
Go to '$user_ip' (or 'localhost' on guest machine)
in your web browser, use 'itcnwp_data' for database
name, 'itcnwp_admin' for database admin login
and 'pass12321' for database password.

Press Enter to terminate the script. "
