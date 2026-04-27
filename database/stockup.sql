CREATE DATABASE IF NOT EXISTS stockup
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE stockup;

CREATE TABLE utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produit (
    id_produit INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    quantite_stock INT NOT NULL DEFAULT 0,
    seuil_minimum INT NOT NULL DEFAULT 0,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INT NOT NULL,
    CONSTRAINT fk_produit_utilisateur
        FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateur(id_utilisateur)
        ON DELETE CASCADE
);

CREATE TABLE liste_courses (
    id_ligne INT AUTO_INCREMENT PRIMARY KEY,
    quantite_souhaitee INT NOT NULL DEFAULT 1,
    statut VARCHAR(50) NOT NULL DEFAULT 'a_acheter',
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_produit INT NOT NULL,
    CONSTRAINT fk_ligne_produit
        FOREIGN KEY (id_produit)
        REFERENCES produit(id_produit)
        ON DELETE CASCADE
);