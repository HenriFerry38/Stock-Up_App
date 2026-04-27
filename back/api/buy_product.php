<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/auth.php';

$userId = requireAuth();

$data = json_decode(file_get_contents('php://input'), true);

$idLigne = (int) ($data['id_ligne'] ?? 0);

if ($idLigne <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Identifiant de ligne invalide'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            liste_courses.id_ligne,
            liste_courses.quantite_souhaitee,
            liste_courses.id_produit,
            produit.quantite_stock
        FROM liste_courses
        INNER JOIN produit 
            ON liste_courses.id_produit = produit.id_produit
        WHERE liste_courses.id_ligne = :id_ligne
        AND produit.id_utilisateur = :id_utilisateur
        AND liste_courses.statut = 'a_acheter'
    ");

    $stmt->execute([
        'id_ligne' => $idLigne,
        'id_utilisateur' => $userId
    ]);

    $item = $stmt->fetch();

    if (!$item) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Élément introuvable dans la liste de courses'
        ]);
        exit;
    }

    $newQuantity = (int) $item['quantite_stock'] + (int) $item['quantite_souhaitee'];

    $updateProduct = $pdo->prepare("
        UPDATE produit
        SET quantite_stock = :quantite_stock
        WHERE id_produit = :id_produit
        AND id_utilisateur = :id_utilisateur
    ");

    $updateProduct->execute([
        'quantite_stock' => $newQuantity,
        'id_produit' => $item['id_produit'],
        'id_utilisateur' => $userId
    ]);

    $updateLine = $pdo->prepare("
        UPDATE liste_courses
        SET statut = 'achete'
        WHERE id_ligne = :id_ligne
    ");

    $updateLine->execute([
        'id_ligne' => $idLigne
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Produit marqué comme acheté',
        'new_quantity' => $newQuantity
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la validation de l’achat'
    ]);
}