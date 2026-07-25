import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search, FileText, CheckCircle, Clock } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts?admin=true');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching admin posts: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchPosts();
        } else {
          alert('Failed to delete post.');
        }
      } catch (error) {
        console.error("Error deleting post: ", error);
      }
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (filter === 'published' && !p.published) return false;
    if (filter === 'draft' && p.published) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      return p.title.toLowerCase().includes(term) || p.authorName.toLowerCase().includes(term);
    }
    return true;
  });

  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.published).length;
  const draftCount = posts.filter(p => !p.published).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Blog Management</h2>
          <p className="text-muted-foreground text-sm">Create, edit, publish, and manage website articles.</p>
        </div>
        <Button onClick={() => window.location.href = '/admin/editor'}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Articles List</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-8 h-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Filter Pills */}
            <div className="flex items-center rounded-lg bg-muted p-1 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${filter === 'all' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${filter === 'published' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
              >
                Published
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${filter === 'draft' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
              >
                Drafts
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No blog posts found matching criteria.</p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Author</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredPosts.map(post => (
                    <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium max-w-xs truncate">
                        <a href={`/blog/${post.slug || post.id}`} target="_blank" rel="noreferrer" className="hover:underline">
                          {post.title}
                        </a>
                      </td>
                      <td className="p-4 align-middle">
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${post.published ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                          title="Click to toggle status"
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4 align-middle">{post.authorName}</td>
                      <td className="p-4 align-middle">{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => window.location.href = `/admin/editor?id=${post.id}`}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
