<?php
require_once __DIR__ . '/../config.php';

$uid = $_SESSION['user_uid'] ?? null;
if (!$uid) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$data = getRequestJSON();
$displayName = trim($data['displayName'] ?? '');
$photoURL = $data['photoURL'] ?? null;

if (empty($displayName)) {
    http_response_code(400);
    echo json_encode(['error' => 'Display name is required.']);
    exit();
}

$pdo = getPDOConnection();

if ($pdo) {
    $now = date('c');
    $stmt = $pdo->prepare('UPDATE users SET display_name = ?, photo_url = ?, updated_at = ? WHERE id = ?');
    $stmt->execute([$displayName, $photoURL, $now, $uid]);

    $fetch = $pdo->prepare('SELECT id, email, display_name, photo_url, role FROM users WHERE id = ? LIMIT 1');
    $fetch->execute([$uid]);
    $user = $fetch->fetch();

    echo json_encode([
        'success' => true,
        'user' => [
            'uid' => $user['id'],
            'email' => $user['email'],
            'displayName' => $user['display_name'],
            'photoURL' => $user['photo_url'],
            'role' => $user['role'] ?: 'user'
        ]
    ]);
} else {
    echo json_encode([
        'success' => true,
        'user' => [
            'uid' => $uid,
            'email' => $_SESSION['user_email'] ?? '',
            'displayName' => $displayName,
            'photoURL' => $photoURL,
            'role' => $_SESSION['user_role'] ?? 'user'
        ]
    ]);
}
