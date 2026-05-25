# Laravel Commerce API

> API REST développée avec Laravel · MySQL · JWT

## Installation

```bash
git clone https://github.com/kha-dija06/NOM_DU_REPO.git
cd laravel-commerce
composer install
cp .env.example .env
php artisan key:generate
```

## Base de données

```bash
# Configurer .env avec vos infos MySQL
php artisan migrate
php artisan db:seed
```

## Démarrer

```bash
php artisan serve
```

## Authentification
JWT — inclure le token dans le header :
```
Authorization: Bearer <token>
```
