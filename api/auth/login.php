<?php
require_once __DIR__ . '/../config.php';

$data = getRequestJSON();
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required.']);
    exit();
}

$pdo = getPDOConnection();

if ($pdo) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || empty($user['password_hash']) || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password.']);
        exit();
    }

    $_SESSION['user_uid'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'] ?: 'user';

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
    // Development fallback
    http_response_code(401);
    echo json_encode(['error' => 'Invalid email or password.']);
}
