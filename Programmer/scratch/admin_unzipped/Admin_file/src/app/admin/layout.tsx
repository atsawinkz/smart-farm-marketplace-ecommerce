'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: number; name: string; role: string } | null>(null);
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
        <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'แดชบอร์ด', icon: 'dashboard' },
    { href: '/admin/products', label: 'สินค้าทั้งหมด', icon: 'inventory_2' },
    { href: '/admin/products/add', label: 'เพิ่มสินค้า', icon: 'add_circle' },
    { href: '/admin/orders', label: 'สถานะสินค้า', icon: 'shopping_cart' },
  ];

  const pageTitle: Record<string, string> = {
    '/admin': 'แดชบอร์ด',
    '/admin/products': 'สินค้าทั้งหมด',
    '/admin/products/add': 'เพิ่มสินค้าใหม่',
    '/admin/orders': 'จัดการสถานะออเดอร์',
  };
  const currentTitle = pageTitle[pathname] ?? (pathname.startsWith('/admin/products/edit') ? 'แก้ไขสินค้า' : '');

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 w-64 bg-primary text-on-primary flex flex-col z-30 shadow-[2px_0_20px_rgba(0,0,0,0.08)]">
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-on-primary/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-inverse-primary text-[22px]" data-weight="fill">eco</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md font-bold text-sm tracking-wide">SMART FARM</span>
              <span className="text-[10px] text-on-primary/60 tracking-widest uppercase">Admin Panel</span>
            </div>
          </Link>
          <Link href="/profile" className="flex items-center justify-center w-8 h-8 rounded-lg text-on-primary/50 hover:text-on-primary hover:bg-white/10 transition-all" title="กลับไปจัดการโปรไฟล์">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </Link>
        </div>
        <div className="px-5 pt-4 pb-2">
          <p className="text-[10px] text-on-primary/40 uppercase tracking-widest font-medium">เมนู</p>
        </div>
        <nav className="flex flex-col px-3 gap-1 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-on-primary/15 text-on-primary shadow-sm'
                    : 'text-on-primary/60 hover:text-on-primary hover:bg-white/[0.06]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-inverse-primary' : ''}`}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
            <div className="w-7 h-7 rounded-full bg-inverse-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px] text-inverse-primary">store</span>
            </div>
            <Link href="/" className="text-xs text-on-primary/70 hover:text-on-primary transition-colors font-medium">
              หน้าร้านค้า
            </Link>
          </div>
        </div>
      </aside>
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h1 className="text-lg font-bold font-headline-lg text-primary">{currentTitle}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/15 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px] text-on-primary">person</span>
              </div>
              <span className="text-on-surface font-medium">{user?.name}</span>
              <span className="text-[10px] text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">ผู้ดูแลระบบ</span>
            </Link>
          </div>
        </header>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
