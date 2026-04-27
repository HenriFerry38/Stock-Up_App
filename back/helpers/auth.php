<?php

session_start();

function requireAuth()
{
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Utilisateur non connecté'
        ]);
        exit;
    }

    return $_SESSION['user_id'];
}