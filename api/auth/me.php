<?php
require_once __DIR__ . '/../config.php';

$uid = $_SESSION['user_uid'] ?? null;

if (!$uid) {
    echo json_encode(['user' => null]);
    exit();
}

$pdo = getPDOConnection();

if ($pdo) {
    $stmt = $pdo->prepare('SELECT id, email, display_name, photo_url, role FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$uid]);
    $user = $stmt->fetch();

    if ($user) {
        echo json_encode([
            'user' => [
                'uid' => $user['id'],
                'email' => $user['email'],
                'displayName' => $user['display_name'],
                'photoURL' => $user['photo_url'],
                'role' => $user['role'] ?: 'user'
            ]
        ]);
        exit();
    }
}

echo json_encode(['user' => null]);
