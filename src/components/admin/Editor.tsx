import { useEffect, useState } from 'react';
import { db, storage } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface EditorProps {
  postId?: string;
}

export default function Editor({ postId: initialPostId }: EditorProps) {
  const [postId, setPostId] = useState(initialPostId || 'new');

  useEffect(() => {
    if (!initialPostId && typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setPostId(searchParams.get('id') || 'new');
    }
  }, [initialPostId]);

  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (postId !== 'new') {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setContent(data.content || '');
        setDescription(data.description || '');
        setTags((data.tags || []).join(', '));
        setCategories((data.categories || []).join(', '));
        setImageUrl(data.imageUrl || '');
        setPublished(data.published || false);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (): Promise<string> => {
    if (!featuredImage) return imageUrl;
    
    const fileRef = ref(storage, `blog/${Date.now()}_${featuredImage.name}`);
    await uploadBytes(fileRef, featuredImage);
    return await getDownloadURL(fileRef);
  };

  const handleSave = async (isPublished: boolean) => {
    if (!user) return;
    setSaving(true);
    
    try {
      let finalImageUrl = imageUrl;
      if (featuredImage) {
        finalImageUrl = await handleImageUpload();
        setImageUrl(finalImageUrl);
      }

      const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const postData = {
        title,
        slug: generatedSlug,
        content,
        description,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        categories: categories.split(',').map(c => c.trim()).filter(Boolean),
        imageUrl: finalImageUrl,
        published: isPublished,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        updatedAt: new Date().toISOString(),
      };

      if (postId === 'new') {
        const newDocRef = doc(collection(db, 'posts'));
        await setDoc(newDocRef, {
          ...postData,
          createdAt: new Date().toISOString(),
        });
        if (isPublished) {
          alert('Post published successfully! It will be live in a few minutes.');
        } else {
          alert('Draft saved successfully!');
        }
        window.location.href = `/admin/editor?id=${newDocRef.id}`;
      } else {
        const docRef = doc(db, 'posts', postId);
        await updateDoc(docRef, postData);
        setPublished(isPublished);
        if (isPublished) {
          alert('Post published successfully! It will be live in a few minutes.');
        } else {
          alert('Post saved successfully!');
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{postId === 'new' ? 'Create New Post' : 'Edit Post'}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            {preview ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button variant="secondary" onClick={() => handleSave(false)} disabled={saving}>
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            {published ? 'Update Published' : 'Publish'}
          </Button>
        </div>
      </div>

      {preview ? (
        <Card className="p-8 prose dark:prose-invert max-w-none">
          <h1>{title || 'Untitled'}</h1>
          {imageUrl && <img src={imageUrl} alt={title} className="rounded-lg w-full max-h-96 object-cover" />}
          <ReactMarkdown>{content}</ReactMarkdown>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content (Markdown)</label>
                  <Textarea 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    placeholder="Write your post here in Markdown..."
                    className="min-h-[500px] font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="custom-url-slug" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">SEO Description</label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief summary for search engines" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categories (comma separated)</label>
                  <Input value={categories} onChange={e => setCategories(e.target.value)} placeholder="Technology, Education" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="react, accessibility" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Featured Image</label>
                  <Input type="file" accept="image/*" onChange={e => setFeaturedImage(e.target.files?.[0] || null)} />
                  {imageUrl && !featuredImage && (
                    <div className="mt-2 text-sm text-muted-foreground">Current image: <a href={imageUrl} target="_blank" rel="noreferrer" className="text-primary underline">View</a></div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
