<?php

require_once __DIR__ . '/../helpers/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/auth.php';

$userId = requireAuth();

try {
    /* récupère les produits de l'utilisateur dont le stock est inférieur ou égal au seuil minimum.*/
    $stmt = $pdo->prepare("
        SELECT id_produit, quantite_stock, seuil_minimum
        FROM produit
        WHERE id_utilisateur = :id_utilisateur
        AND quantite_stock <= seuil_minimum
    ");

    $stmt->execute([
        'id_utilisateur' => $userId
    ]);

    $products = $stmt->fetchAll();

    /* vide la liste actuelle des produit en double */
    $deleteStmt = $pdo->prepare("
        DELETE liste_courses
        FROM liste_courses
        INNER JOIN produit ON liste_courses.id_produit = produit.id_produit
        WHERE produit.id_utilisateur = :id_utilisateur
        AND liste_courses.statut = 'a_acheter'
    ");

    $deleteStmt->execute([
        'id_utilisateur' => $userId
    ]);

    /* ajoute une ligne dans la liste pour chaque produit en stock bas*/
    $insertStmt = $pdo->prepare("
        INSERT INTO liste_courses 
        (id_produit, quantite_souhaitee, statut)
        VALUES
        (:id_produit, :quantite_souhaitee, 'a_acheter')
    ");

    foreach ($products as $product) {
        $quantiteSouhaitee = max(
            1,
            (int)$product['seuil_minimum'] - (int)$product['quantite_stock'] + 1
        );

        $insertStmt->execute([
            'id_produit' => $product['id_produit'],
            'quantite_souhaitee' => $quantiteSouhaitee
        ]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Liste de courses générée avec succès',
        'items_created' => count($products)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la génération de la liste de courses'
    ]);
}