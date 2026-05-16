'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Tag as TagIcon, 
  Zap,
  Calendar
} from 'lucide-react';
import styles from './Insights.module.css';

export default function InsightsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/insights');
      const d = await res.json();
      if (res.ok) {
        setData(d);
      }
    } catch (error) {
      console.error('Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading insights...</div>;
  if (!data) return <div className={styles.error}>Failed to load insights</div>;

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <h1>Productivity Insights</h1>
        <p className={styles.subtitle}>Track your writing progress and AI usage</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <Zap size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Total Notes</p>
            <h3>{data.totalNotes}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>AI Insights Generated</p>
            <h3>{data.totalAiOps}</h3>
          </div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Clock size={20} />
            <h2>Recently Edited</h2>
          </div>
          <div className={styles.list}>
            {data.recentlyEdited.map(note => (
              <div key={note._id} className={styles.listItem}>
                <span>{note.title}</span>
                <span className={styles.time}>{new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <TagIcon size={20} />
            <h2>Top Tags</h2>
          </div>
          <div className={styles.tags}>
            {data.topTags.map(tag => (
              <div key={tag._id} className={styles.tagItem}>
                <span className={styles.tagName}>{tag._id}</span>
                <span className={styles.tagCount}>{tag.count} notes</span>
              </div>
            ))}
            {data.topTags.length === 0 && <p className={styles.empty}>No tags used yet.</p>}
          </div>
        </section>

        <section className={`${styles.section} ${styles.fullWidth}`}>
          <div className={styles.sectionHeader}>
            <Calendar size={20} />
            <h2>Weekly Activity</h2>
          </div>
          <div className={styles.chart}>
            {data.weeklyActivity.map(day => (
              <div key={day._id} className={styles.barContainer}>
                <div 
                  className={styles.bar} 
                  style={{ height: `${Math.min(day.count * 20, 200)}px` }}
                >
                  <span className={styles.barValue}>{day.count}</span>
                </div>
                <span className={styles.barLabel}>{day._id.split('-').slice(1).join('/')}</span>
              </div>
            ))}
            {data.weeklyActivity.length === 0 && <p className={styles.empty}>No activity in the last 7 days.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
