'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Search,
  Archive
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const menuItems = [
    { name: 'My Notes', icon: FileText, path: '/notes' },
    { name: 'Insights', icon: BarChart3, path: '/insights' },
    { name: 'Archived', icon: Archive, path: '/archived' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>P</div>
        <span>Peblo</span>
      </div>

      <button className={styles.newNoteBtn} onClick={() => router.push('/notes/new')}>
        <PlusCircle size={20} />
        <span>New Note</span>
      </button>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
