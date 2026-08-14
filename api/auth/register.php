<?php
require_once __DIR__ . '/../config.php';

$data = getRequestJSON();
$name = trim($data['name'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, and password are required.']);
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters long.']);
    exit();
}

$pdo = getPDOConnection();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed. Unable to register account.']);
    exit();
}

// Check existing email
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(400);
    echo json_encode(['error' => 'An account with this email address already exists.']);
    exit();
}

$uid = generateUUID();
$passwordHash = password_hash($password, PASSWORD_BCRYPT);
$now = date('c');
$role = 'user';

$insert = $pdo->prepare(
    'INSERT INTO users (id, email, password_hash, display_name, photo_url, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
$insert->execute([$uid, $email, $passwordHash, $name, null, $role, $now, $now]);

$_SESSION['user_uid'] = $uid;
$_SESSION['user_email'] = $email;
$_SESSION['user_role'] = $role;

echo json_encode([
    'success' => true,
    'user' => [
        'uid' => $uid,
        'email' => $email,
        'displayName' => $name,
        'photoURL' => null,
        'role' => $role
    ]
]);
