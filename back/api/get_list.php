<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/auth.php';

$userId = requireAuth();

$stmt = $pdo->prepare("
    SELECT 
        liste_courses.id_ligne,
        liste_courses.quantite_souhaitee,
        liste_courses.statut,
        liste_courses.date_ajout,
        produit.id_produit,
        produit.nom,
        produit.categorie,
        produit.quantite_stock,
        produit.seuil_minimum
    FROM liste_courses
    INNER JOIN produit 
        ON liste_courses.id_produit = produit.id_produit
    WHERE produit.id_utilisateur = :id_utilisateur
    AND liste_courses.statut = 'a_acheter'
    ORDER BY liste_courses.date_ajout DESC
");

$stmt->execute([
    'id_utilisateur' => $userId
]);

echo json_encode([
    'success' => true,
    'shopping_list' => $stmt->fetchAll()
]);