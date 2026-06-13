'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'สินค้าทั้งหมด', value: '—', icon: 'inventory_2', href: '/admin/products', color: 'bg-primary/10 text-primary' },
    { label: 'เพิ่มสินค้าใหม่', value: '', icon: 'add_circle', href: '/admin/products/add', color: 'bg-secondary-container/50 text-secondary', action: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 shadow-sm">
        <h2 className="text-xl font-bold font-headline-lg text-primary mb-2">ยินดีต้อนรับสู่ระบบจัดการสินค้า</h2>
        <p className="text-body-md text-on-surface-variant">จัดการสินค้า อัปโหลดรูปภาพ และอัปเดตราคาสินค้าเกษตรของคุณ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-center gap-4 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{stat.value || '→'}</p>
              <p className="text-sm text-on-surface-variant">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 shadow-sm">
        <h3 className="font-bold font-headline-md text-on-surface mb-3">การดำเนินการด่วน</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/add" className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-md hover:bg-surface-tint transition-all flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            เพิ่มสินค้าใหม่
          </Link>
          <Link href="/admin/products" className="bg-surface-container text-on-surface-variant px-5 py-2.5 rounded-full font-label-md hover:bg-surface-container-high transition-all flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-[18px]">list</span>
            ดูสินค้าทั้งหมด
          </Link>
          <Link href="/" className="bg-surface-container text-on-surface-variant px-5 py-2.5 rounded-full font-label-md hover:bg-surface-container-high transition-all flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-[18px]">store</span>
            หน้าร้านค้า
          </Link>
        </div>
      </div>
    </div>
  );
}
