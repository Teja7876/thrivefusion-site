<?php
require_once __DIR__ . '/../config.php';

$data = getRequestJSON();
$action = $data['action'] ?? '';
$email = strtolower(trim($data['email'] ?? ''));
$token = $data['token'] ?? '';
$newPassword = $data['newPassword'] ?? '';

$pdo = getPDOConnection();

if ($action === 'request') {
    if (empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email is required.']);
        exit();
    }

    if ($pdo) {
        $resetToken = generateUUID();
        $expires = date('c', time() + 3600);
        $stmt = $pdo->prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?');
        $stmt->execute([$resetToken, $expires, $email]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Password reset instruction processed.'
    ]);
    exit();
}

if ($action === 'confirm') {
    if (empty($token) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(['error' => 'Token and new password are required.']);
        exit();
    }

    if ($pdo) {
        $now = date('c');
        $stmt = $pdo->prepare('SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > ? LIMIT 1');
        $stmt->execute([$token, $now]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid or expired password reset token.']);
            exit();
        }

        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $update = $pdo->prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL, updated_at = ? WHERE id = ?');
        $update->execute([$newHash, $now, $user['id']]);

        echo json_encode(['success' => true, 'message' => 'Password has been reset successfully.']);
        exit();
    }

    echo json_encode(['success' => true]);
    exit();
}

http_response_code(400);
echo json_encode(['error' => 'Invalid action.']);
