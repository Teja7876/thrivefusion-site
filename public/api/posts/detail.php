<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Post identifier is required.']);
    exit();
}

$pdo = getPDOConnection();

if ($method === 'GET') {
    if ($pdo) {
        $stmt = $pdo->prepare('SELECT * FROM posts WHERE id = ? OR slug = ? LIMIT 1');
        $stmt->execute([$id, $id]);
        $row = $stmt->fetch();

        if ($row) {
            $post = [
                'id' => $row['id'],
                'title' => $row['title'],
                'slug' => $row['slug'],
                'content' => $row['content'],
                'description' => $row['description'] ?: '',
                'tags' => json_decode($row['tags'] ?: '[]', true) ?: [],
                'categories' => json_decode($row['categories'] ?: '[]', true) ?: [],
                'imageUrl' => $row['image_url'] ?: '',
                'published' => (bool)$row['published'],
                'authorId' => $row['author_id'],
                'authorName' => $row['author_name'],
                'createdAt' => $row['created_at'],
                'updatedAt' => $row['updated_at']
            ];

            echo json_encode(['post' => $post]);
            exit();
        }
    }

    http_response_code(404);
    echo json_encode(['error' => 'Post not found.']);
    exit();
}

if ($method === 'PUT') {
    $userRole = $_SESSION['user_role'] ?? null;
    if ($userRole !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized: Admin privileges required.']);
        exit();
    }

    $data = getRequestJSON();
    $now = date('c');

    if ($pdo) {
        $stmt = $pdo->prepare('SELECT * FROM posts WHERE id = ? OR slug = ? LIMIT 1');
        $stmt->execute([$id, $id]);
        $existing = $stmt->fetch();

        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Post not found.']);
            exit();
        }

        $title = isset($data['title']) ? trim($data['title']) : $existing['title'];
        $slug = isset($data['slug']) ? trim($data['slug']) : $existing['slug'];
        $content = isset($data['content']) ? $data['content'] : $existing['content'];
        $description = isset($data['description']) ? trim($data['description']) : $existing['description'];
        $tags = isset($data['tags']) ? json_encode($data['tags']) : $existing['tags'];
        $categories = isset($data['categories']) ? json_encode($data['categories']) : $existing['categories'];
        $imageUrl = isset($data['imageUrl']) ? $data['imageUrl'] : $existing['image_url'];
        $published = isset($data['published']) ? ($data['published'] ? 1 : 0) : $existing['published'];

        $update = $pdo->prepare(
            'UPDATE posts 
             SET title = ?, slug = ?, content = ?, description = ?, tags = ?, categories = ?, image_url = ?, published = ?, updated_at = ?
             WHERE id = ?'
        );
        $update->execute([
            $title,
            $slug,
            $content,
            $description,
            $tags,
            $categories,
            $imageUrl,
            $published,
            $now,
            $existing['id']
        ]);

        echo json_encode(['success' => true]);
        exit();
    }
}

if ($method === 'DELETE') {
    $userRole = $_SESSION['user_role'] ?? null;
    if ($userRole !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized: Admin privileges required.']);
        exit();
    }

    if ($pdo) {
        $stmt = $pdo->prepare('DELETE FROM posts WHERE id = ? OR slug = ?');
        $stmt->execute([$id, $id]);
        echo json_encode(['success' => true]);
        exit();
    }
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
