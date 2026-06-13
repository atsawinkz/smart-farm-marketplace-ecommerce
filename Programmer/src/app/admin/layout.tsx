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
        <div className="h-[68px] px-5 flex items-center gap-2.5 border-b border-white/10">
          <span className="material-symbols-outlined text-inverse-primary text-[24px]" data-weight="fill">eco</span>
          <span className="font-bold text-base text-[#f0e6d2] tracking-wide">Admin Panel</span>
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
      </aside>
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 h-[68px] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-on-surface">{currentTitle}</h1>
          </div>
          <div className="flex items-center gap-5 text-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>{user?.name || 'ผู้ดูแลระบบ'} ({user?.role || 'admin'})</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                router.push('/');
              }}
              className="text-error hover:text-error/80 font-medium transition-colors cursor-pointer"
            >
              ออกจากระบบ
            </button>
          </div>
        </header>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
