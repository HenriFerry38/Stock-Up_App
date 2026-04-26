<?php

header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../helpers/auth.php';

$userId = requireAuth();

$stmt = $pdo->prepare("
    SELECT *
    FROM produit
    WHERE id_utilisateur = :id_utilisateur
    ORDER BY date_creation DESC
");

$stmt->execute([
    'id_utilisateur' => $userId
]);

echo json_encode([
    'success' => true,
    'products' => $stmt->fetchAll()
]);