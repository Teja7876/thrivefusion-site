<?php
// Hostinger MySQL Migration & Database Initialization Script (Secured)
require_once __DIR__ . '/config.php';

// Security Gate 1: Require Secret Key Authorization
$setupKey = $_GET['key'] ?? $_SERVER['HTTP_X_SETUP_KEY'] ?? '';
$expectedKey = getenv('SETUP_SECRET_KEY') ?: 'THRIVEFUSION_SETUP_SECRET_2026';

if (!hash_equals($expectedKey, $setupKey)) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden: Invalid or missing authorization key.']);
    exit();
}

// Security Gate 2: Check for Setup Lock File
$lockFile = __DIR__ . '/setup.lock';
if (file_exists($lockFile)) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden: Database initialization has already been executed. Remove setup.lock to re-run.']);
    exit();
}

$pdo = getPDOConnection();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed. Please verify configuration.']);
    exit();
}

$createUsersTable = "
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NULL,
      display_name VARCHAR(255) NOT NULL,
      photo_url TEXT NULL,
      role VARCHAR(50) DEFAULT 'user',
      google_id VARCHAR(255) NULL,
      reset_token VARCHAR(255) NULL,
      reset_token_expires DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_users_email (email),
      INDEX idx_users_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";

$createPostsTable = "
    CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content LONGTEXT NOT NULL,
      description TEXT NULL,
      tags TEXT NULL,
      categories TEXT NULL,
      image_url TEXT NULL,
      published TINYINT(1) DEFAULT 0,
      author_id VARCHAR(36) NOT NULL,
      author_name VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_posts_slug (slug),
      INDEX idx_posts_published (published),
      INDEX idx_posts_author (author_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";

try {
    $pdo->exec($createUsersTable);
    $pdo->exec($createPostsTable);
    
    // Create lockfile to prevent unauthorized re-execution
    @file_put_contents($lockFile, 'LOCKED: ' . date('c'));
    
    echo json_encode(['success' => true, 'message' => 'Database tables and indexes initialized successfully. Setup endpoint is now locked.']);
} catch (Exception $e) {
    error_log('Database initialization failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database initialization failed. Please inspect server logs.']);
}

