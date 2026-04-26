<?php

header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../helpers/auth.php';

$userId = requireAuth();

$data = json_decode(file_get_contents('php://input'), true);

$nom = trim($data['nom'] ?? '');
$categorie = trim($data['categorie'] ?? '');
$quantite = (int) ($data['quantite_stock'] ?? 0);
$seuil = (int) ($data['seuil_minimum'] ?? 0);

if (!$nom || !$categorie || $quantite < 0 || $seuil < 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Données invalides'
    ]);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO produit 
    (nom, categorie, quantite_stock, seuil_minimum, id_utilisateur)
    VALUES 
    (:nom, :categorie, :quantite_stock, :seuil_minimum, :id_utilisateur)
");

$stmt->execute([
    'nom' => $nom,
    'categorie' => $categorie,
    'quantite_stock' => $quantite,
    'seuil_minimum' => $seuil,
    'id_utilisateur' => $userId
]);

echo json_encode([
    'success' => true,
    'message' => 'Produit ajouté avec succès'
]);