'use client';

import React from 'react';
import { Calendar, User, FileText } from 'lucide-react';
import styles from './SharedNote.module.css';

export default function SharedNotePage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = React.use(params);
  const [note, setNote] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetchSharedNote();
  }, [shareId]);

  const fetchSharedNote = async () => {
    try {
      const res = await fetch(`/api/shared/${shareId}`);
      const data = await res.json();
      if (res.ok) {
        setNote(data.note);
      } else {
        setError(data.error || 'Note not found');
      }
    } catch (err) {
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>P</div>
          <span>Peblo</span>
        </div>
        <p className={styles.badge}>Shared Note</p>
      </header>

      <article className={`${styles.content} fade-in`}>
        <h1 className={styles.title}>{note.title}</h1>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <User size={16} />
            <span>{note.userId?.name || 'Unknown Author'}</span>
          </div>
          <div className={styles.metaItem}>
            <Calendar size={16} />
            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className={styles.tags}>
          {note.tags?.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.body}>
          {note.content.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {note.summary && (
          <div className={styles.summary}>
            <h3>AI Summary</h3>
            <p>{note.summary}</p>
          </div>
        )}
      </article>

      <footer className={styles.footer}>
        <p>Created with Peblo - Your AI-powered Notes Workspace</p>
      </footer>
    </div>
  );
}
