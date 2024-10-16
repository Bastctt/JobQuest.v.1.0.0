# Utiliser l'image officielle de PHP avec Apache pour Symfony
FROM php:8.2-apache AS backend

# Installer les dépendances requises
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libpq-dev \
    libxml2-dev \
    libzip-dev \
    libonig-dev \
    zip \
    && docker-php-ext-install intl pdo pdo_mysql

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier les fichiers de votre projet Symfony dans le conteneur
WORKDIR /var/www/html
COPY backend .

# Installer les dépendances de Symfony
RUN composer install --no-scripts --no-autoloader --ignore-platform-reqs

# Configurer les permissions et créer le répertoire de cache et logs
RUN chown -R www-data:www-data /var/www/html/var

# Assure-toi que le propriétaire des fichiers est www-data
RUN chown -R www-data:www-data /var/www/html

# Donne les permissions de lecture/exécution nécessaires
RUN chmod -R 755 /var/www/html

# Activer le module Apache Rewrite
RUN a2enmod rewrite

COPY .env /var/www/html/.env

# Exposer le port 80 pour le serveur Apache
EXPOSE 80

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Frontend
FROM node:18 AS frontend

# Installer pnpm
RUN npm install -g pnpm

# Déplacer dans le répertoire frontend
WORKDIR /app

# Copier le frontend
COPY frontend .

# Installer les dépendances et construire le frontend
RUN pnpm install
RUN pnpm run build

# Copie des fichiers générés par Vite dans le dossier public du backend
FROM backend AS final
COPY --from=frontend /app/dist /var/www/html/public

# Démarrer Apache
CMD ["apache2-foreground"]
