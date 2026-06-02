# 📦 Stock'Up

Stock'Up est une application web permettant aux utilisateurs de gérer leur stock alimentaire et de générer automatiquement une liste de courses en fonction des produits disponibles et des seuils définis.

Ce projet a été réalisé dans le cadre de ma formation de Développeur Web et Web Mobile afin de mettre en pratique les compétences acquises en développement front-end, back-end, bases de données et déploiement.

---

# 🚀 Fonctionnalités

## Gestion des utilisateurs

* Création de compte
* Connexion sécurisée
* Déconnexion
* Gestion des sessions utilisateur

## Gestion du stock

* Ajouter un produit
* Modifier un produit
* Supprimer un produit
* Consulter la liste des produits
* Gestion des quantités disponibles

## Liste de courses intelligente

* Génération automatique d'une liste de courses
* Détection des produits sous le seuil minimal défini
* Marquage des produits achetés
* Mise à jour automatique du stock après achat

## Interface utilisateur

* Interface responsive
* Compatible ordinateur, tablette et mobile
* Navigation simple et intuitive

---

# 🛠️ Technologies utilisées

## Front-end

* HTML5
* CSS3
* JavaScript Vanilla

## Back-end

* PHP 8

## Base de données

* MySQL

## Outils de développement

* Docker
* Docker Compose
* Git
* GitHub
* Visual Studio Code
* Postman

---

# 📂 Architecture du projet

```
StockUp/
│
├── api/
│   ├── register.php
│   ├── login.php
│   ├── logout.php
│   ├── add_product.php
│   ├── get_products.php
│   ├── get_list.php
│   ├── update_product.php
│   ├── delete_product.php
│   └── mark_as_bought.php
│
├── assets/
│
├── css/
│
├── js/
│
├── config/
│   ├── config.local.php
│   └── config.prod.php
│
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

# 🗄️ Base de données

L'application repose sur une base de données MySQL.

## Table users

| Champ      | Type     |
| ---------- | -------- |
| id         | INT      |
| username   | VARCHAR  |
| email      | VARCHAR  |
| password   | VARCHAR  |
| created_at | DATETIME |

## Table products

| Champ              | Type     |
| ------------------ | -------- |
| id                 | INT      |
| user_id            | INT      |
| name               | VARCHAR  |
| quantity           | INT      |
| threshold_quantity | INT      |
| created_at         | DATETIME |

---

# 🔐 Sécurité

Plusieurs mécanismes de sécurité ont été mis en place :

* Utilisation de PDO
* Requêtes préparées
* Protection contre les injections SQL
* Hashage des mots de passe avec `password_hash()`
* Vérification des mots de passe avec `password_verify()`
* Gestion des sessions utilisateur
* Séparation des configurations de développement et de production
* Restriction des accès aux fichiers sensibles

Exemple :

```php
$stmt = $pdo->prepare("
    SELECT * FROM users
    WHERE email = :email
");

$stmt->execute([
    'email' => $email
]);
```

---

# ⚙️ Installation du projet

## 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/stockup.git
```

```bash
cd stockup
```

---

## 2. Configurer les variables d'environnement

Créer ou modifier les fichiers :

```php
config.local.php
```

et

```php
config.prod.php
```

en renseignant :

```php
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

---

## 3. Lancer Docker

```bash
docker compose up -d
```

Vérifier les conteneurs :

```bash
docker ps
```

---

## 4. Importer la base de données

Créer la base de données :

```sql
CREATE DATABASE stockup;
```

Importer le script SQL :

```bash
mysql -u root -p stockup < stockup.sql
```

---

## 5. Accéder à l'application

Front-end :

```text
http://localhost
```

API :

```text
http://localhost/api
```

---

# 🔄 Fonctionnement général

## Création d'un compte

L'utilisateur crée un compte depuis le formulaire d'inscription.

## Connexion

L'utilisateur se connecte à l'aide de son adresse email et de son mot de passe.

## Gestion du stock

Il peut :

* Ajouter un produit
* Modifier une quantité
* Supprimer un produit

## Génération de la liste de courses

Lorsque la quantité d'un produit devient inférieure à son seuil minimal :

```text
Quantité actuelle < Quantité minimale
```

Le produit apparaît automatiquement dans la liste de courses.

## Validation des achats

Lorsque l'utilisateur achète un produit :

* Il le marque comme acheté
* Le stock est mis à jour
* La liste de courses est recalculée

---

# 📱 Responsive Design

L'interface a été conçue selon une approche responsive.

Points de rupture principaux :

```css
@media (max-width: 992px)
```

```css
@media (max-width: 768px)
```

```css
@media (max-width: 576px)
```

---

# 🧪 Tests réalisés

## Tests API

* Inscription utilisateur
* Connexion utilisateur
* Ajout produit
* Modification produit
* Suppression produit
* Génération liste de courses

Tests réalisés avec :

* Postman

## Tests fonctionnels

* Vérification des formulaires
* Gestion des erreurs
* Navigation utilisateur
* Responsive Design

---

# 🌐 Déploiement

## Environnement de développement

* Docker
* MySQL local
* PHP local

## Environnement de production

* Hébergement AlwaysData
* Base de données MySQL distante
* Configuration spécifique de sécurité
* Restrictions CORS

---

# 🎯 Compétences mobilisées

## Front-end

* Développement d'interfaces utilisateur
* Manipulation du DOM
* Responsive Design
* Gestion des événements JavaScript

## Back-end

* Développement d'API REST
* Gestion des sessions
* Validation des données
* Architecture PHP

## Base de données

* Modélisation relationnelle
* Requêtes SQL
* PDO
* Sécurisation des accès aux données

## Déploiement

* Docker
* Hébergement web
* Configuration serveur
* Gestion des environnements

---

# 📚 Perspectives d'amélioration

* Gestion des catégories de produits
* Ajout d'une date de péremption
* Notifications automatiques
* Statistiques de consommation
* Gestion multi-utilisateurs au sein d'un même foyer
* Application mobile

---

# 👨‍💻 Auteur

Henri Ferry

Projet réalisé dans le cadre de la préparation du titre professionnel Développeur Web et Web Mobile.

---

# 📄 Licence

Projet réalisé à des fins pédagogiques.
