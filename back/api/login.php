<?php

header('Content-Type: application/json');
session_start();

require_once '../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email et mot de passe obligatoires'
    ]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM utilisateur WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['mot_de_passe'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Identifiants incorrects'
    ]);
    exit;
}

session_regenerate_id(true);

$_SESSION['user_id'] = $user['id_utilisateur'];
$_SESSION['user_prenom'] = $user['prenom'];

echo json_encode([
    'success' => true,
    'message' => 'Connexion réussie',
    'user' => [
        'id' => $user['id_utilisateur'],
        'prenom' => $user['prenom'],
        'email' => $user['email']
    ]
]);