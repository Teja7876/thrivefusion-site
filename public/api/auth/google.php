<?php
require_once __DIR__ . '/../config.php';

$data = getRequestJSON();
$email = strtolower(trim($data['email'] ?? ''));
$name = trim($data['name'] ?? '');
$picture = $data['picture'] ?? null;
$googleId = $data['googleId'] ?? null;

if (empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email is required for Google Sign-In.']);
    exit();
}

$pdo = getPDOConnection();

if ($pdo) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        $uid = generateUUID();
        $now = date('c');
        $role = 'user';
        $displayName = !empty($name) ? $name : explode('@', $email)[0];

        $insert = $pdo->prepare(
            'INSERT INTO users (id, email, password_hash, display_name, photo_url, role, google_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $insert->execute([$uid, $email, null, $displayName, $picture, $role, $googleId, $now, $now]);

        $user = [
            'id' => $uid,
            'email' => $email,
            'display_name' => $displayName,
            'photo_url' => $picture,
            'role' => $role
        ];
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
    $uid = 'google_' . time();
    $_SESSION['user_uid'] = $uid;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = 'user';

    echo json_encode([
        'success' => true,
        'user' => [
            'uid' => $uid,
            'email' => $email,
            'displayName' => !empty($name) ? $name : explode('@', $email)[0],
            'photoURL' => $picture,
            'role' => 'user'
        ]
    ]);
}
