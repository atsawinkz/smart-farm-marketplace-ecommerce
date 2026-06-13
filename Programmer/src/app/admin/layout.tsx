'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    try {
      const u = JSON.parse(storedUser);
      if (u.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(u);
      setChecked(true);
    } catch {
      router.push('/login');
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'แดชบอร์ด', icon: 'dashboard' },
    { href: '/admin/products', label: 'สินค้าทั้งหมด', icon: 'inventory_2' },
    { href: '/admin/products/add', label: 'เพิ่มสินค้า', icon: 'add_circle' },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 w-64 bg-primary text-on-primary flex flex-col z-30">
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 font-headline-md font-bold text-lg">
            <span className="material-symbols-outlined text-inverse-primary" data-weight="fill">eco</span>
            Admin Panel
          </Link>
          <Link href="/profile" className="flex items-center justify-center w-8 h-8 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all" title="กลับไปจัดการโปรไฟล์">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </Link>
        </div>
        <nav className="flex flex-col p-3 gap-1 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-10 bg-surface/95 backdrop-blur-md border-b border-outline-variant/20 px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold font-headline-lg text-primary">
            {pathname === '/admin' && 'แดชบอร์ด'}
            {pathname === '/admin/products' && 'สินค้าทั้งหมด'}
            {pathname === '/admin/products/add' && 'เพิ่มสินค้าใหม่'}
            {pathname.startsWith('/admin/products/edit') && 'แก้ไขสินค้า'}
          </h1>
          <div className="flex items-center gap-3 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span>{user?.name} (ผู้ดูแลระบบ)</span>
            <button
              onClick={() => { localStorage.removeItem('user'); router.push('/'); }}
              className="ml-2 text-error hover:text-error/80 transition-colors text-xs font-semibold cursor-pointer"
            >
              ออกจากระบบ
            </button>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
