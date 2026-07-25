<?php
// Hostinger MySQL Database & Environment Configuration

// Enable CORS and JSON Content-Type headers
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start PHP Session for Secure Authentication
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 7 * 24 * 60 * 60, // 7 days
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

$db_host = getenv('MYSQL_HOST') ?: (getenv('DB_HOST') ?: 'localhost');
$db_user = getenv('MYSQL_USER') ?: (getenv('DB_USER') ?: 'root');
$db_pass = getenv('MYSQL_PASSWORD') ?: (getenv('DB_PASSWORD') ?: '');
$db_name = getenv('MYSQL_DATABASE') ?: (getenv('DB_NAME') ?: 'thrivefusion_db');
$db_port = getenv('MYSQL_PORT') ?: (getenv('DB_PORT') ?: 3306);

function getPDOConnection() {
    global $db_host, $db_user, $db_pass, $db_name, $db_port;
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    try {
        $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $pdo = new PDO($dsn, $db_user, $db_pass, $options);
        initTables($pdo);
        return $pdo;
    } catch (PDOException $e) {
        // Fallback for local environment if MySQL server is not running locally
        return null;
    }
}

function initTables($pdo) {
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
          reset_token_expires VARCHAR(255) NULL,
          created_at VARCHAR(255) NOT NULL,
          updated_at VARCHAR(255) NOT NULL
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
          created_at VARCHAR(255) NOT NULL,
          updated_at VARCHAR(255) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";

    try {
        $pdo->exec($createUsersTable);
        $pdo->exec($createPostsTable);
    } catch (Exception $e) {
        // Ignore table init errors
    }
}

function getRequestJSON() {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    return json_decode($raw, true) ?: [];
}

function generateUUID() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
