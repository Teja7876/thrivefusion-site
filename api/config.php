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

function ensureDatabaseTables($pdo) {
    if (!$pdo) return;
    try {
        $pdo->exec("
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
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL
            );
        ");
        $pdo->exec("
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
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL
            );
        ");
    } catch (Exception $e) {
        // Table creation errors ignored if already existing
    }
}

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
        ensureDatabaseTables($pdo);
        return $pdo;
    } catch (PDOException $e) {
        error_log('[ThriveFusion DB Error]: MySQL connection failed: ' . $e->getMessage());

        // Fallback to SQLite ONLY in local unconfigured dev environment when no env vars are defined
        $isEnvConfigured = !empty(getenv('MYSQL_HOST')) || !empty(getenv('DB_HOST')) || !empty(getenv('MYSQL_USER')) || !empty(getenv('DB_USER'));
        if (!$isEnvConfigured) {
            try {
                $sqlitePath = __DIR__ . '/database.sqlite';
                $pdo = new PDO("sqlite:" . $sqlitePath, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
                ensureDatabaseTables($pdo);
                return $pdo;
            } catch (PDOException $e2) {
                return null;
            }
        }

        return null;
    }
}

function getRequestJSON() {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    return json_decode($raw, true) ?: [];
}

function generateUUID() {
    if (function_exists('random_bytes')) {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
