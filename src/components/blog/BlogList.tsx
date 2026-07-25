import { useEffect, useState } from 'react';
import { format } from "date-fns";
import { Loader2, Search, Tag } from "lucide-react";

interface BlogListProps {
  initialPosts?: any[];
}

export default function BlogList({ initialPosts = [] }: BlogListProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = '/api/posts';
      const params = new URLSearchParams();
      if (search.trim()) params.append('q', search.trim());
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else {
        setError('Failed to load blog posts.');
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, selectedCategory]);

  // Extract all categories from posts
  const allCategories = Array.from(
    new Set(posts.flatMap(p => p.categories || []))
  );

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/40 p-4 rounded-2xl border border-border">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-background text-muted-foreground hover:bg-accent'
            }`}
          >
            All Articles
          </button>

          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">
          <p>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 rounded-3xl border border-dashed p-8">
          <p className="text-lg font-medium">No published blog posts found.</p>
          <p className="text-sm mt-1">Check back soon for new articles and announcements!</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group relative flex flex-col items-start justify-between rounded-3xl bg-card shadow-md transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden border border-border">
              {post.imageUrl ? (
                <div className="relative w-full h-48 overflow-hidden bg-muted">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="relative w-full h-48 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary/40">
                  <Tag className="h-12 w-12" />
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow w-full">
                <div className="flex items-center gap-x-3 text-xs mb-3">
                  <time dateTime={post.createdAt} className="text-muted-foreground font-medium">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </time>
                  {post.categories && post.categories[0] && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                      {post.categories[0]}
                    </span>
                  )}
                </div>

                <div className="group relative flex-grow">
                  <h3 className="text-xl font-bold leading-7 text-foreground group-hover:text-primary transition-colors">
                    <a href={`/blog/${post.slug || post.id}`}>
                      <span className="absolute inset-0"></span>
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                </div>

                <div className="relative mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">By {post.authorName}</span>
                  <span className="text-primary font-semibold hover:underline">Read Article →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
