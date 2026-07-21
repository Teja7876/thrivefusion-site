import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (typeof window === 'undefined') return;
      
      const searchParams = new URLSearchParams(window.location.search);
      const slug = searchParams.get('slug');
      
      if (!slug) {
        setError("Post not found");
        setLoading(false);
        return;
      }

      try {
        let fetchedPost: any = null;
        
        // First, try to find by ID (if slug is actually an ID)
        const docRef = doc(db, "posts", slug);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().published) {
          fetchedPost = { id: docSnap.id, ...docSnap.data() };
        }

        // If not found by ID, query by slug
        if (!fetchedPost) {
          const q = query(
            collection(db, "posts"),
            where("slug", "==", slug),
            where("published", "==", true),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            fetchedPost = { id: doc.id, ...doc.data() };
          }
        }
        
        if (fetchedPost) {
          setPost(fetchedPost);
          document.title = `${fetchedPost.title} | ThriveFusion Blog`;
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
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
        <h2 className="text-2xl font-bold mb-4">{error || "Post not found"}</h2>
        <a href="/blog" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <a href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </a>
      </div>
      
      <article className="prose prose-lg dark:prose-invert prose-primary mx-auto max-w-none">
        <header className="mb-12 not-prose">
          <div className="flex items-center gap-x-4 text-sm mb-6">
            <time dateTime={post.createdAt} className="text-muted-foreground">
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </time>
            {post.categories && post.categories[0] && (
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                {post.categories[0]}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">{post.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {post.description}
          </p>
          
          <div className="flex items-center gap-x-4 pb-8 border-b border-border">
            <div className="text-sm leading-6">
              <p className="font-semibold text-foreground">By {post.authorName}</p>
            </div>
          </div>
          
          {post.imageUrl && (
            <div className="mt-8 relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-lg">
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
        
        <div className="mt-12 text-foreground blog-content">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </div>
      </article>
    </>
  );
}
