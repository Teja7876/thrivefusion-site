<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $q = isset($_GET['q']) ? strtolower(trim($_GET['q'])) : '';
    $category = isset($_GET['category']) ? strtolower(trim($_GET['category'])) : '';
    $tag = isset($_GET['tag']) ? strtolower(trim($_GET['tag'])) : '';
    $isAdminView = isset($_GET['admin']) && $_GET['admin'] === 'true';

    if ($isAdminView) {
        $userRole = $_SESSION['user_role'] ?? null;
        if ($userRole !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized admin access.']);
            exit();
        }
    }

    $pdo = getPDOConnection();
    $posts = [];

    if ($pdo) {
        $sql = $isAdminView
            ? 'SELECT * FROM posts ORDER BY created_at DESC'
            : 'SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC';
        
        $stmt = $pdo->query($sql);
        $rows = $stmt->fetchAll();

        foreach ($rows as $row) {
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

            // Apply filter
            if ($q !== '') {
                $inTitle = str_contains(strtolower($post['title']), $q);
                $inDesc = str_contains(strtolower($post['description']), $q);
                $inContent = str_contains(strtolower($post['content']), $q);
                if (!$inTitle && !$inDesc && !$inContent) continue;
            }

            if ($category !== '' && !in_array($category, array_map('strtolower', $post['categories']))) {
                continue;
            }

            if ($tag !== '' && !in_array($tag, array_map('strtolower', $post['tags']))) {
                continue;
            }

            $posts[] = $post;
        }
    }

    echo json_encode(['posts' => $posts]);
    exit();
}

if ($method === 'POST') {
    $userRole = $_SESSION['user_role'] ?? null;
    $userUid = $_SESSION['user_uid'] ?? null;

    if ($userRole !== 'admin' || !$userUid) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized: Admin privileges required to create posts.']);
        exit();
    }

    $data = getRequestJSON();
    $title = trim($data['title'] ?? '');
    $slug = trim($data['slug'] ?? '');
    $content = $data['content'] ?? '';
    $description = trim($data['description'] ?? '');
    $tags = $data['tags'] ?? [];
    $categories = $data['categories'] ?? [];
    $imageUrl = $data['imageUrl'] ?? '';
    $published = !empty($data['published']);

    if (empty($title) || empty($content)) {
        http_response_code(400);
        echo json_encode(['error' => 'Title and content are required.']);
        exit();
    }

    $generatedSlug = !empty($slug) ? $slug : preg_replace('/[^a-z0-9]+/', '-', strtolower($title));
    $generatedSlug = trim($generatedSlug, '-');

    $id = generateUUID();
    $now = date('c');

    $pdo = getPDOConnection();

    if ($pdo) {
        // Get user display name
        $userStmt = $pdo->prepare('SELECT display_name FROM users WHERE id = ? LIMIT 1');
        $userStmt->execute([$userUid]);
        $u = $userStmt->fetch();
        $authorName = $u['display_name'] ?? 'Administrator';

        $stmt = $pdo->prepare(
            'INSERT INTO posts (id, title, slug, content, description, tags, categories, image_url, published, author_id, author_name, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            $title,
            $generatedSlug,
            $content,
            $description,
            json_encode($tags),
            json_encode($categories),
            $imageUrl,
            $published ? 1 : 0,
            $userUid,
            $authorName,
            $now,
            $now
        ]);

        $newPost = [
            'id' => $id,
            'title' => $title,
            'slug' => $generatedSlug,
            'content' => $content,
            'description' => $description,
            'tags' => $tags,
            'categories' => $categories,
            'imageUrl' => $imageUrl,
            'published' => $published,
            'authorId' => $userUid,
            'authorName' => $authorName,
            'createdAt' => $now,
            'updatedAt' => $now
        ];

        http_response_code(201);
        echo json_encode(['success' => true, 'post' => $newPost]);
        exit();
    }
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
