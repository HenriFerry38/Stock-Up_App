<?php

header('Content-Type: application/json');
require_once '../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$nom = trim($data['nom'] ?? '');
$prenom = trim($data['prenom'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$nom || !$prenom || !$email || !$password) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Tous les champs sont obligatoires'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email invalide'
    ]);
    exit;
}

$check = $pdo->prepare("SELECT id_utilisateur FROM utilisateur WHERE email = :email");
$check->execute(['email' => $email]);

if ($check->fetch()) {
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'message' => 'Cet email est déjà utilisé'
    ]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("
    INSERT INTO utilisateur (nom, prenom, email, mot_de_passe)
    VALUES (:nom, :prenom, :email, :mot_de_passe)
");

$stmt->execute([
    'nom' => $nom,
    'prenom' => $prenom,
    'email' => $email,
    'mot_de_passe' => $hashedPassword
]);

echo json_encode([
    'success' => true,
    'message' => 'Compte créé avec succès'
]);