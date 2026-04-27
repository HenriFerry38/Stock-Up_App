<?php

require_once __DIR__ . '/../helpers/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/auth.php';

$userId = requireAuth();

$data = json_decode(file_get_contents('php://input'), true);

$idProduit = (int) ($data['id_produit'] ?? 0);
$nom = trim($data['nom'] ?? '');
$categorie = trim($data['categorie'] ?? '');
$quantite = (int) ($data['quantite_stock'] ?? 0);
$seuil = (int) ($data['seuil_minimum'] ?? 0);

if ($idProduit <= 0 || !$nom || !$categorie || $quantite < 0 || $seuil < 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Données invalides'
    ]);
    exit;
}

$check = $pdo->prepare("
    SELECT id_produit
    FROM produit
    WHERE id_produit = :id_produit
    AND id_utilisateur = :id_utilisateur
");

$check->execute([
    'id_produit' => $idProduit,
    'id_utilisateur' => $userId
]);

if (!$check->fetch()) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Produit introuvable'
    ]);
    exit;
}

$duplicate = $pdo->prepare("
    SELECT id_produit
    FROM produit
    WHERE id_utilisateur = :id_utilisateur
    AND nom = :nom
    AND id_produit != :id_produit
");

$duplicate->execute([
    'id_utilisateur' => $userId,
    'nom' => $nom,
    'id_produit' => $idProduit
]);

if ($duplicate->fetch()) {
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'message' => 'Un autre produit porte déjà ce nom'
    ]);
    exit;
}

$stmt = $pdo->prepare("
    UPDATE produit
    SET nom = :nom,
        categorie = :categorie,
        quantite_stock = :quantite_stock,
        seuil_minimum = :seuil_minimum
    WHERE id_produit = :id_produit
    AND id_utilisateur = :id_utilisateur
");

$stmt->execute([
    'nom' => $nom,
    'categorie' => $categorie,
    'quantite_stock' => $quantite,
    'seuil_minimum' => $seuil,
    'id_produit' => $idProduit,
    'id_utilisateur' => $userId
]);

echo json_encode([
    'success' => true,
    'message' => 'Produit modifié avec succès'
]);