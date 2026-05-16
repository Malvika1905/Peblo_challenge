'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Save, 
  Trash2, 
  Sparkles, 
  Share2, 
  Archive,
  CheckCircle2,
  Clock
} from 'lucide-react';
import styles from './Editor.module.css';

export default function Editor({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [shareId, setShareId] = useState('');
  const [aiData, setAiData] = useState<{ summary: string; actionItems: string[]; suggestedTitle: string }>({ 
    summary: '', 
    actionItems: [], 
    suggestedTitle: '' 
  });
  
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isNew, setIsNew] = useState(params.id === 'new');
  
  const router = useRouter();

  useEffect(() => {
    if (!isNew) {
      fetchNote();
    }
  }, [params.id, isNew]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setTitle(data.note.title);
        setContent(data.note.content);
        setTags(data.note.tags || []);
        setIsPublic(data.note.isPublic);
        setShareId(data.note.shareId);
        setAiData({
          summary: data.note.summary,
          actionItems: data.note.actionItems,
          suggestedTitle: data.note.suggestedTitle
        });
      }
    } catch (error) {
      console.error('Failed to fetch note');
    }
  };

  const handleSave = async (isAuto = false) => {
    if (!title && !content) {
      console.log('Editor: Title or content is empty, skipping save');
      return;
    }
    if (!isAuto) setSaving(true);
    
    try {
      const url = isNew ? '/api/notes' : `/api/notes/${params.id}`;
      const method = isNew ? 'POST' : 'PATCH';
      
      console.log(`Editor: Attempting ${method} to ${url}`);
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags, isPublic }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Editor: Save successful', data);
        setLastSaved(new Date());
        if (isNew) {
          console.log('Editor: New note created, redirecting to:', data.note._id);
          router.replace(`/notes/${data.note._id}`);
          setIsNew(false);
        }
      } else {
        console.error('Editor: Save failed with error:', data.error);
      }
    } catch (error) {
      console.error('Editor: Save failed with exception:', error);
    } finally {
      if (!isAuto) setSaving(false);
    }
  };

  // Auto-save logic (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        handleSave(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const handleEnrich = async () => {
    if (!content || content.length < 20) {
      console.log('Editor: Content too short for AI analysis');
      return;
    }
    setAiLoading(true);
    console.log('Editor: Requesting AI analysis for:', params.id);
    
    try {
      const res = await fetch(`/api/notes/${params.id}/ai`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        console.log('Editor: AI analysis successful', data);
        setAiData(data);
      } else {
        console.error('Editor: AI analysis failed with error:', data.error);
      }
    } catch (error) {
      console.error('Editor: AI analysis failed with exception:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      await fetch(`/api/notes/${params.id}`, { method: 'DELETE' });
      router.push('/notes');
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="fade-in">
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.push('/notes')}>
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        
        <div className={styles.status}>
          {lastSaved && (
            <div className={styles.lastSaved}>
              <CheckCircle2 size={14} />
              <span>Saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
          {saving && <span>Saving...</span>}
        </div>

        <div className={styles.actions}>
          {!isNew && (
            <>
              <button 
                className={`${styles.actionBtn} ${aiLoading ? styles.spinning : ''}`} 
                onClick={handleEnrich}
                disabled={aiLoading}
              >
                <Sparkles size={18} />
                <span>AI Analyze</span>
              </button>
              <button 
                className={`${styles.actionBtn} ${isPublic ? styles.active : ''}`}
                onClick={async () => {
                  const newPublicState = !isPublic;
                  setIsPublic(newPublicState);
                  // We'll trigger a save with the correct state
                  setSaving(true);
                  try {
                    const url = `/api/notes/${params.id}`;
                    const res = await fetch(url, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title, content, tags, isPublic: newPublicState }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setLastSaved(new Date());
                      setShareId(data.note.shareId);
                    }
                  } catch (error) {
                    console.error('Share failed', error);
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                <Share2 size={18} />
                <span>{isPublic ? 'Public' : 'Share'}</span>
              </button>
              <button className={styles.deleteBtn} onClick={handleDelete}>
                <Trash2 size={18} />
              </button>
            </>
          )}
          <button className="btn-primary" onClick={() => handleSave()}>
            <Save size={18} />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className={styles.editorContainer}>
        <div className={styles.mainEditor}>
          <input 
            className={styles.titleInput}
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <div className={styles.tagSection}>
            <div className={styles.tagList}>
              {tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
            <input 
              className={styles.tagInput}
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={addTag}
            />
          </div>

          <textarea 
            className={styles.contentInput}
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {!isNew && (aiData.summary || aiData.actionItems.length > 0 || isPublic) && (
          <aside className={styles.sidebar}>
            {aiData.suggestedTitle && (
              <div className={styles.aiSection}>
                <h4>AI Suggested Title</h4>
                <p className={styles.suggestedTitle} onClick={() => setTitle(aiData.suggestedTitle)}>
                  {aiData.suggestedTitle}
                </p>
              </div>
            )}
            
            {aiData.summary && (
              <div className={styles.aiSection}>
                <h4>Summary</h4>
                <p>{aiData.summary}</p>
              </div>
            )}

            {aiData.actionItems.length > 0 && (
              <div className={styles.aiSection}>
                <h4>Action Items</h4>
                <ul>
                  {aiData.actionItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {isPublic && shareId && (
              <div className={styles.shareSection}>
                <h4>Public Link</h4>
                <div className={styles.shareLink}>
                  <input readOnly value={typeof window !== 'undefined' ? `${window.location.origin}/shared/${shareId}` : ''} />
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/shared/${shareId}`);
                    alert('Copied!');
                  }}>Copy</button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
