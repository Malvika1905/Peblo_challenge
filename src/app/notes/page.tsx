'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, Calendar, Tag as TagIcon } from 'lucide-react';
import styles from './Notes.module.css';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [search, tagFilter]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (tagFilter) query.append('tag', tagFilter);
      
      const res = await fetch(`/api/notes?${query.toString()}`);
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <h1>My Notes</h1>
          <p className={styles.subtitle}>You have {notes.length} notes</p>
        </div>
        <Link href="/notes/new" className="btn-primary">
          <Plus size={20} />
          <span>New Note</span>
        </Link>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Tag filter could go here */}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className={styles.empty}>
          <p>No notes found. Start by creating one!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {notes.map((note) => (
            <Link href={`/notes/${note._id}`} key={note._id} className={styles.noteCard}>
              <h3>{note.title}</h3>
              <p className={styles.preview}>
                {note.content?.substring(0, 120) || 'No content...'}
                {note.content?.length > 120 && '...'}
              </p>
              <div className={styles.footer}>
                <div className={styles.tags}>
                  {note.tags.slice(0, 2).map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                  {note.tags.length > 2 && <span className={styles.tag}>+{note.tags.length - 2}</span>}
                </div>
                <div className={styles.date}>
                  <Calendar size={14} />
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
