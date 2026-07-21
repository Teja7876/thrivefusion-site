import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("published", "==", true),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedPosts: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-12">
        <p>{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>No blog posts published yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article key={post.id} className="group relative flex flex-col items-start justify-between rounded-3xl bg-card shadow-md transition-shadow hover:shadow-xl overflow-hidden border border-border">
          {post.imageUrl && (
            <div className="relative w-full h-48 overflow-hidden bg-muted">
              <img
                src={post.imageUrl}
                alt={post.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-8 flex flex-col flex-grow w-full">
            <div className="flex items-center gap-x-4 text-xs">
              <time dateTime={post.createdAt} className="text-muted-foreground">
                {format(new Date(post.createdAt), "MMMM d, yyyy")}
              </time>
              {post.categories && post.categories.length > 0 && (
                <span className="relative z-10 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">
                  {post.categories[0]}
                </span>
              )}
            </div>
            <div className="group relative mt-3 flex-grow">
              <h3 className="mt-3 text-2xl font-bold leading-8 text-foreground group-hover:text-primary transition-colors">
                <a href={`/blog/post?slug=${post.slug || post.id}`}>
                  <span className="absolute inset-0"></span>
                  {post.title}
                </a>
              </h3>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {post.description}
              </p>
            </div>
            <div className="relative mt-8 flex items-center gap-x-4">
              <div className="text-sm leading-6">
                <p className="font-semibold text-foreground">
                  <span className="absolute inset-0"></span>
                  {post.authorName}
                </p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
