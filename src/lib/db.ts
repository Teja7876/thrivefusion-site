import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Environment configuration for Hostinger MySQL
const dbConfig = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'thrivefusion_db',
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool | null = null;
let useLocalFallback = false;

// Local fallback database file path for dev mode if MySQL connection is unavailable
const LOCAL_DB_DIR = path.resolve(process.cwd(), '.data');
const LOCAL_DB_FILE = path.join(LOCAL_DB_DIR, 'db_store.json');

interface LocalStore {
  users: any[];
  posts: any[];
}

function getLocalStore(): LocalStore {
  if (!fs.existsSync(LOCAL_DB_DIR)) {
    fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_FILE)) {
    const initialData: LocalStore = { users: [], posts: [] };
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { users: [], posts: [] };
  }
}

function saveLocalStore(store: LocalStore) {
  if (!fs.existsSync(LOCAL_DB_DIR)) {
    fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
  }
  fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export async function getDbPool() {
  if (pool) return pool;
  try {
    pool = mysql.createPool(dbConfig);
    // Test connection
    const connection = await pool.getConnection();
    connection.release();
    useLocalFallback = false;
    await initSchema();
    return pool;
  } catch (error) {
    console.warn('MySQL Connection Warning: Could not connect to MySQL server. Falling back to local file store for development mode.', error);
    useLocalFallback = true;
    return null;
  }
}

async function initSchema() {
  if (!pool) return;
  
  const createUsersTable = `
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
  `;

  const createPostsTable = `
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
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(createPostsTable);
  } catch (err) {
    console.error('Error initializing MySQL schema:', err);
  }
}

// Global Helper Functions using Prepared Statements or Local Fallback

// --- USER OPERATIONS ---

export async function findUserByEmail(email: string) {
  const p = await getDbPool();
  if (p && !useLocalFallback) {
    const [rows]: any = await p.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows.length === 0) return null;
    const user = rows[0];
    return {
      uid: user.id,
      email: user.email,
      passwordHash: user.password_hash,
      displayName: user.display_name,
      photoURL: user.photo_url,
      role: user.role,
      googleId: user.google_id,
      resetToken: user.reset_token,
      resetTokenExpires: user.reset_token_expires,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  } else {
    const store = getLocalStore();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }
}

export async function findUserById(id: string) {
  const p = await getDbPool();
  if (p && !useLocalFallback) {
    const [rows]: any = await p.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return null;
    const user = rows[0];
    return {
      uid: user.id,
      email: user.email,
      passwordHash: user.password_hash,
      displayName: user.display_name,
      photoURL: user.photo_url,
      role: user.role,
      googleId: user.google_id,
      resetToken: user.reset_token,
      resetTokenExpires: user.reset_token_expires,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  } else {
    const store = getLocalStore();
    const user = store.users.find(u => u.uid === id);
    return user || null;
  }
}

export async function createUser(userData: {
  uid: string;
  email: string;
  passwordHash?: string | null;
  displayName: string;
  photoURL?: string | null;
  role?: string;
  googleId?: string | null;
}) {
  const now = new Date().toISOString();
  const role = userData.role || 'user';
  const photoURL = userData.photoURL || null;
  const passwordHash = userData.passwordHash || null;
  const googleId = userData.googleId || null;

  const p = await getDbPool();
  if (p && !useLocalFallback) {
    await p.execute(
      `INSERT INTO users (id, email, password_hash, display_name, photo_url, role, google_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userData.uid, userData.email, passwordHash, userData.displayName, photoURL, role, googleId, now, now]
    );
  } else {
    const store = getLocalStore();
    const newUser = {
      uid: userData.uid,
      email: userData.email,
      passwordHash,
      displayName: userData.displayName,
      photoURL,
      role,
      googleId,
      resetToken: null,
      resetTokenExpires: null,
      createdAt: now,
      updatedAt: now,
    };
    store.users.push(newUser);
    saveLocalStore(store);
  }

  return {
    uid: userData.uid,
    email: userData.email,
    displayName: userData.displayName,
    photoURL,
    role,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateUserProfile(id: string, updates: { displayName?: string; photoURL?: string | null }) {
  const now = new Date().toISOString();
  const p = await getDbPool();
  if (p && !useLocalFallback) {
    if (updates.displayName !== undefined && updates.photoURL !== undefined) {
      await p.execute('UPDATE users SET display_name = ?, photo_url = ?, updated_at = ? WHERE id = ?', [
        updates.displayName,
        updates.photoURL,
        now,
        id,
      ]);
    } else if (updates.displayName !== undefined) {
      await p.execute('UPDATE users SET display_name = ?, updated_at = ? WHERE id = ?', [updates.displayName, now, id]);
    } else if (updates.photoURL !== undefined) {
      await p.execute('UPDATE users SET photo_url = ?, updated_at = ? WHERE id = ?', [updates.photoURL, now, id]);
    }
  } else {
    const store = getLocalStore();
    const index = store.users.findIndex(u => u.uid === id);
    if (index !== -1) {
      if (updates.displayName !== undefined) store.users[index].displayName = updates.displayName;
      if (updates.photoURL !== undefined) store.users[index].photoURL = updates.photoURL;
      store.users[index].updatedAt = now;
      saveLocalStore(store);
    }
  }
}

export async function setPasswordResetToken(email: string, token: string, expiresIso: string) {
  const p = await getDbPool();
  if (p && !useLocalFallback) {
    await p.execute('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [
      token,
      expiresIso,
      email,
    ]);
  } else {
    const store = getLocalStore();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.resetToken = token;
      user.resetTokenExpires = expiresIso;
      saveLocalStore(store);
    }
  }
}

export async function resetPasswordWithToken(token: string, newPasswordHash: string) {
  const now = new Date().toISOString();
  const p = await getDbPool();
  if (p && !useLocalFallback) {
    const [rows]: any = await p.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ? LIMIT 1',
      [token, now]
    );
    if (rows.length === 0) return false;
    const userId = rows[0].id;
    await p.execute(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL, updated_at = ? WHERE id = ?',
      [newPasswordHash, now, userId]
    );
    return true;
  } else {
    const store = getLocalStore();
    const user = store.users.find(u => u.resetToken === token && u.resetTokenExpires && u.resetTokenExpires > now);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    user.resetToken = null;
    user.resetTokenExpires = null;
    user.updatedAt = now;
    saveLocalStore(store);
    return true;
  }
}

// --- POSTS OPERATIONS ---

export interface PostRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  tags: string[];
  categories: string[];
  imageUrl: string;
  published: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

function parsePostRow(row: any): PostRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    description: row.description || '',
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || []),
    categories: typeof row.categories === 'string' ? JSON.parse(row.categories || '[]') : (row.categories || []),
    imageUrl: row.image_url || '',
    published: Boolean(row.published),
    authorId: row.author_id,
    authorName: row.author_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllPosts(onlyPublished = true): Promise<PostRecord[]> {
  const p = await getDbPool();
  if (p && !useLocalFallback) {
    const query = onlyPublished
      ? 'SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC'
      : 'SELECT * FROM posts ORDER BY created_at DESC';
    const [rows]: any = await p.execute(query);
    return rows.map(parsePostRow);
  } else {
    const store = getLocalStore();
    let posts = store.posts || [];
    if (onlyPublished) {
      posts = posts.filter(post => post.published);
    }
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function getPostBySlugOrId(identifier: string): Promise<PostRecord | null> {
  const p = await getDbPool();
  if (p && !useLocalFallback) {
    const [rows]: any = await p.execute('SELECT * FROM posts WHERE id = ? OR slug = ? LIMIT 1', [
      identifier,
      identifier,
    ]);
    if (rows.length === 0) return null;
    return parsePostRow(rows[0]);
  } else {
    const store = getLocalStore();
    const post = (store.posts || []).find(p => p.id === identifier || p.slug === identifier);
    return post || null;
  }
}

export async function createPost(postData: Omit<PostRecord, 'createdAt' | 'updatedAt'>): Promise<PostRecord> {
  const now = new Date().toISOString();
  const newPost: PostRecord = {
    ...postData,
    createdAt: now,
    updatedAt: now,
  };

  const p = await getDbPool();
  if (p && !useLocalFallback) {
    await p.execute(
      `INSERT INTO posts (id, title, slug, content, description, tags, categories, image_url, published, author_id, author_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newPost.id,
        newPost.title,
        newPost.slug,
        newPost.content,
        newPost.description,
        JSON.stringify(newPost.tags),
        JSON.stringify(newPost.categories),
        newPost.imageUrl,
        newPost.published ? 1 : 0,
        newPost.authorId,
        newPost.authorName,
        now,
        now,
      ]
    );
  } else {
    const store = getLocalStore();
    if (!store.posts) store.posts = [];
    store.posts.push(newPost);
    saveLocalStore(store);
  }

  return newPost;
}

export async function updatePost(id: string, postData: Partial<PostRecord>): Promise<PostRecord | null> {
  const now = new Date().toISOString();
  const existing = await getPostBySlugOrId(id);
  if (!existing) return null;

  const updated: PostRecord = {
    ...existing,
    ...postData,
    updatedAt: now,
  };

  const p = await getDbPool();
  if (p && !useLocalFallback) {
    await p.execute(
      `UPDATE posts 
       SET title = ?, slug = ?, content = ?, description = ?, tags = ?, categories = ?, image_url = ?, published = ?, author_name = ?, updated_at = ?
       WHERE id = ?`,
      [
        updated.title,
        updated.slug,
        updated.content,
        updated.description,
        JSON.stringify(updated.tags),
        JSON.stringify(updated.categories),
        updated.imageUrl,
        updated.published ? 1 : 0,
        updated.authorName,
        now,
        id,
      ]
    );
  } else {
    const store = getLocalStore();
    const index = (store.posts || []).findIndex(p => p.id === id);
    if (index !== -1) {
      store.posts[index] = updated;
      saveLocalStore(store);
    }
  }

  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  const p = await getDbPool();
  if (p && !useLocalFallback) {
    const [result]: any = await p.execute('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } else {
    const store = getLocalStore();
    const initialLength = (store.posts || []).length;
    store.posts = (store.posts || []).filter(p => p.id !== id);
    saveLocalStore(store);
    return store.posts.length < initialLength;
  }
}
