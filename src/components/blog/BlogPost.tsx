import { useEffect, useState } from 'react';
import { format } from "date-fns";
import { ArrowLeft, Loader2, Calendar, User, Tag } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostAndRelated = async () => {
      if (typeof window === 'undefined') return;
      
      const searchParams = new URLSearchParams(window.location.search);
      const slug = searchParams.get('slug') || window.location.pathname.split('/').pop();
      
      if (!slug) {
        setError("Article not found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) {
          setError("Article not found");
          setLoading(false);
          return;
        }

        const data = await res.json();
        const fetchedPost = data.post;
        
        if (fetchedPost && fetchedPost.published) {
          setPost(fetchedPost);
          document.title = `${fetchedPost.title} | ThriveFusion Alliance Foundation`;

          // Fetch related posts matching category
          try {
            const relatedRes = await fetch('/api/posts');
            if (relatedRes.ok) {
              const relatedData = await relatedRes.json();
              const allPosts = relatedData.posts || [];
              const filtered = allPosts
                .filter((p: any) => p.id !== fetchedPost.id && p.published)
                .slice(0, 3);
              setRelatedPosts(filtered);
            }
          } catch {
            // Ignore related posts error
          }
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndRelated();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-32 min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-4">{error || "Article not found"}</h2>
        <a href="/blog" className="inline-flex items-center text-primary hover:underline font-semibold">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog Listing
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <a href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </a>
      </div>
      
      <article className="prose prose-lg dark:prose-invert prose-primary mx-auto max-w-none">
        <header className="mb-12 not-prose">
          <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
            <time dateTime={post.createdAt} className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </time>

            {post.categories && post.categories.map((cat: string) => (
              <span key={cat} className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">{post.title}</h1>
          
          {post.description && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {post.description}
            </p>
          )}
          
          <div className="flex items-center gap-x-4 pb-8 border-b border-border">
            <div className="flex items-center gap-2 text-sm leading-6">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold text-foreground">By {post.authorName}</p>
            </div>
          </div>
          
          {post.imageUrl && (
            <div className="mt-8 relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-lg border">
              <img
                src={post.imageUrl}
                alt={post.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
        </header>
        
        <div className="mt-12 text-foreground blog-content leading-relaxed space-y-4">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </div>

        {/* Tags badges */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-border not-prose flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground mr-2">Tags:</span>
            {post.tags.map((tag: string) => (
              <span key={tag} className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-border">
          <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rel) => (
              <a
                key={rel.id}
                href={`/blog/${rel.slug || rel.id}`}
                className="group rounded-2xl border bg-card p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {rel.imageUrl && (
                    <img src={rel.imageUrl} alt={rel.title} className="w-full h-36 object-cover rounded-xl mb-4" />
                  )}
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">{rel.title}</h4>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{rel.description}</p>
                </div>
                <div className="mt-4 text-xs font-semibold text-primary">Read Article →</div>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
