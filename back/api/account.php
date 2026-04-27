<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/auth.php';

$userId = requireAuth();

$stmt = $pdo->prepare("
    SELECT id_utilisateur, nom, prenom, email
    FROM utilisateur
    WHERE id_utilisateur = :id_utilisateur
");

$stmt->execute([
    'id_utilisateur' => $userId
]);

$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Utilisateur introuvable'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'user' => [
        'id' => $user['id_utilisateur'],
        'nom' => $user['nom'],
        'prenom' => $user['prenom'],
        'email' => $user['email']
    ]
]);