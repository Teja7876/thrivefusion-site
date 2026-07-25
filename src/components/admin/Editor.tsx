import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Heading, Link as LinkIcon, Quote, Code, List, Trash2, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';

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
      const res = await fetch(`/api/posts/${postId}`);
      if (res.ok) {
        const data = await res.json();
        const post = data.post;
        if (post) {
          setTitle(post.title || '');
          setSlug(post.slug || '');
          setContent(post.content || '');
          setDescription(post.description || '');
          setTags((post.tags || []).join(', '));
          setCategories((post.categories || []).join(', '));
          setImageUrl(post.imageUrl || '');
          setPublished(post.published || false);
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (): Promise<string> => {
    if (!featuredImage) return imageUrl;
    
    const formData = new FormData();
    formData.append('file', featuredImage);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Image upload failed');
    return data.url;
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

      const generatedSlug = (slug || title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const postPayload = {
        title: title.trim(),
        slug: generatedSlug,
        content,
        description: description.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        categories: categories.split(',').map(c => c.trim()).filter(Boolean),
        imageUrl: finalImageUrl,
        published: isPublished,
      };

      if (postId === 'new') {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postPayload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create post');

        setPublished(isPublished);
        alert(isPublished ? 'Post published successfully!' : 'Draft saved successfully!');
        window.location.href = `/admin/editor?id=${data.post.id}`;
      } else {
        const res = await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postPayload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update post');

        setPublished(isPublished);
        alert(isPublished ? 'Post published successfully!' : 'Changes saved successfully!');
      }
    } catch (error: any) {
      console.error("Error saving post:", error);
      alert(error.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (postId === 'new') return;
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
        if (res.ok) {
          window.location.href = '/admin';
        }
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => window.location.href = '/admin'}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">{postId === 'new' ? 'Create New Article' : 'Edit Article'}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {postId !== 'new' && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setPreview(!preview)}>
            {preview ? 'Edit Code' : 'Live Preview'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleSave(false)} disabled={saving}>
            Save Draft
          </Button>
          <Button size="sm" onClick={() => handleSave(!published)} disabled={saving}>
            {published ? 'Unpublish' : 'Publish Article'}
          </Button>
        </div>
      </div>

      {preview ? (
        <Card className="p-8 prose dark:prose-invert max-w-none shadow-sm">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold mb-2">{title || 'Untitled Article'}</h1>
            {description && <p className="text-xl text-muted-foreground">{description}</p>}
          </div>
          {imageUrl && (
            <img src={imageUrl} alt={title} className="rounded-2xl w-full max-h-96 object-cover mb-8 shadow-md" />
          )}
          <ReactMarkdown>{content || '*No content written yet.*'}</ReactMarkdown>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Article Title</label>
                  <Input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="Enter descriptive post title" 
                    className="text-lg font-semibold"
                  />
                </div>

                {/* Markdown Formatting Toolbar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Content (Markdown)</label>
                    <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertFormatting('**', '**')} title="Bold">
                        <Bold className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertFormatting('*', '*')} title="Italic">
                        <Italic className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertFormatting('## ')} title="Heading">
                        <Heading className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertFormatting('[', '](https://example.com)')} title="Link">
                        <LinkIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertFormatting('> ')} title="Quote">
                        <Quote className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertFormatting('```\n', '\n```')} title="Code Block">
                        <Code className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertFormatting('- ')} title="Bullet List">
                        <List className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <Textarea 
                    id="content-textarea"
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    placeholder="Write article content using Markdown..."
                    className="min-h-[480px] font-mono leading-relaxed text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SEO Slug / URL</label>
                  <Input 
                    value={slug} 
                    onChange={e => setSlug(e.target.value)} 
                    placeholder="e.g. accessibility-guide-2026" 
                  />
                  <p className="text-xs text-muted-foreground">Leave blank to auto-generate from title.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">SEO Excerpt / Description</label>
                  <Textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Short summary for search results and social cards..."
                    className="h-24 text-sm" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categories (comma separated)</label>
                  <Input 
                    value={categories} 
                    onChange={e => setCategories(e.target.value)} 
                    placeholder="Accessibility, Inclusion, Advocacy" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input 
                    value={tags} 
                    onChange={e => setTags(e.target.value)} 
                    placeholder="education, tech, awareness" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4" />
                    Featured Image
                  </label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setFeaturedImage(e.target.files?.[0] || null)} 
                  />
                  <Input 
                    type="text" 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)} 
                    placeholder="Or paste external Image URL" 
                    className="mt-2 text-xs"
                  />
                  {imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img src={imageUrl} alt="Featured preview" className="w-full h-32 object-cover" />
                    </div>
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
