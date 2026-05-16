'use client';

import Link from 'next/link';
import { Sparkles, Shield, Share2, Search } from 'lucide-react';
import styles from './Landing.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>P</div>
          <span>Peblo</span>
        </div>
        <div className={styles.auth}>
          <Link href="/login" className={styles.loginLink}>Login</Link>
          <Link href="/signup" className="btn-primary">Sign Up</Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={`${styles.hero} fade-in`}>
          <h1>Your AI-Powered <br /><span className={styles.highlight}>Notes Workspace</span></h1>
          <p>The smartest way to capture thoughts, collaborate with AI, and share insights. Built for the modern builder.</p>
          <div className={styles.cta}>
            <Link href="/signup" className="btn-primary">Get Started for Free</Link>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Sparkles /></div>
            <h3>AI-Enriched</h3>
            <p>Automatically generate summaries, action items, and titles from your raw thoughts.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Shield /></div>
            <h3>Secure Auth</h3>
            <p>Your notes are protected with industry-standard encryption and JWT authentication.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Share2 /></div>
            <h3>Public Sharing</h3>
            <p>Share your insights with the world with a single click. No login required for readers.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Search /></div>
            <h3>Deep Search</h3>
            <p>Find exactly what you're looking for with lightning-fast keyword and tag filtering.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Peblo Challenge. Built with passion for excellence.</p>
      </footer>
    </div>
  );
}
