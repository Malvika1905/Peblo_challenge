'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/login', '/signup', '/shared'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) || pathname === '/';

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
            router.push('/notes');
          }
        } else if (!isPublicRoute) {
          router.push('/login');
        }
      } catch (error) {
        if (!isPublicRoute) router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router, isPublicRoute]);

  if (loading && !isPublicRoute) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
