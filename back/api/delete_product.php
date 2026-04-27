<?php

require_once __DIR__ . '/../helpers/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/auth.php';

$userId = requireAuth();

$data = json_decode(file_get_contents('php://input'), true);

$idProduit = (int) ($data['id_produit'] ?? 0);

if ($idProduit <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Identifiant produit invalide'
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

$stmt = $pdo->prepare("
    DELETE FROM produit
    WHERE id_produit = :id_produit
    AND id_utilisateur = :id_utilisateur
");

$stmt->execute([
    'id_produit' => $idProduit,
    'id_utilisateur' => $userId
]);

echo json_encode([
    'success' => true,
    'message' => 'Produit supprimé avec succès'
]);