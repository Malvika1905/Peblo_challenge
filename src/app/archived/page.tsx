'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Archive, Calendar, RotateCcw } from 'lucide-react';
import styles from '../notes/Notes.module.css';

export default function ArchivedPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  const fetchArchivedNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes?archived=true`);
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Failed to fetch archived notes');
    } finally {
      setLoading(false);
    }
  };

  const unarchiveNote = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isArchived: false }),
    });
    fetchArchivedNotes();
  };

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <h1>Archived Notes</h1>
          <p className={styles.subtitle}>You have {notes.length} archived notes</p>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading archived notes...</div>
      ) : notes.length === 0 ? (
        <div className={styles.empty}>
          <p>No archived notes.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {notes.map((note) => (
            <Link href={`/notes/${note._id}`} key={note._id} className={styles.noteCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{note.title}</h3>
                <button onClick={(e) => unarchiveNote(note._id, e)} title="Unarchive">
                  <RotateCcw size={18} />
                </button>
              </div>
              <p className={styles.preview}>
                {note.content?.substring(0, 120) || 'No content...'}
              </p>
              <div className={styles.footer}>
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
