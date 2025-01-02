# Use the PHP image with Apache
FROM php:apache

# Install necessary PHP extensions (e.g., mysqli for MySQL/MariaDB support)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache mod_rewrite for URL rewriting
RUN a2enmod rewrite

# Set the working directory to /var/www/html
WORKDIR /var/www/html

# Copy the project files into the container's web root
COPY . /var/www/html/

# Expose port 80 for web access
EXPOSE 80
