'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const router = useRouter();
  interface ProductItem {
    id: number; name: string; category_name: string;
    original_price: number;
    price: number | string; stock_quantity: number;
    image_url: string; is_best_seller?: boolean;
    lot_in_date?: string; expiry_date?: string;
    description?: string;
  }
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const result = await res.json();
      if (result.success) setProducts(result.data);
    } catch {}
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      const result = await res.json();
      if (result.success) {
        setProducts((prev) => prev.filter((p: ProductItem) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert(result.error || 'ลบไม่สำเร็จ');
      }
    } catch {
      alert('เกิดข้อผิดพลาด');
    }
    setDeleting(false);
  };

  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-on-surface-variant shrink-0">
            ทั้งหมด <strong className="text-on-surface">{products.length}</strong> รายการ
          </p>
          <div className="relative max-w-xs w-full flex items-center gap-2">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาสินค้า..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
            <Link
              href="/admin/products/add"
              className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              เพิ่มสินค้า
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-xl bg-surface-container-low flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-outline">inventory_2</span>
            </div>
            <h3 className="text-lg font-headline-md text-on-surface mt-5 font-bold">ยังไม่มีสินค้า</h3>
            <p className="text-sm text-on-surface-variant/70 mt-1">เพิ่มสินค้าชิ้นแรกของคุณ</p>
            <Link href="/admin/products/add" className="inline-block bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:brightness-110 transition-all mt-6 shadow-sm">
              เพิ่มสินค้า
            </Link>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/80">
                    <th className="text-left px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">รูป</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">สินค้า</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">หมวดหมู่</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">ราคาต่อหน่วย</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">ราคาพิเศษ</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">จำนวนในสต๊อก</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">วันนำเข้า</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">วันหมดอายุ</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">เหลือกี่วัน</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-on-surface-variant text-sm">ไม่พบสินค้าที่ค้นหา</td>
                    </tr>
                  ) : filteredProducts.map((p, idx) => {
                    const daysLeft = p.expiry_date
                      ? Math.ceil((new Date(p.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      : null;
                    const formatDate = (d: string | undefined) => {
                      if (!d) return '—';
                      const date = new Date(d);
                      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
                    };
                    return (
                      <tr key={p.id} className={`border-b border-outline-variant/10 transition-colors hover:bg-surface-container-low/40 ${idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/20'}`}>
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 bg-surface-container rounded-lg overflow-hidden flex items-center justify-center border border-outline-variant/20">
                            <img
                              src={p.image_url || 'https://placehold.co/48'}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-on-surface">{p.name}</td>
                        <td className="px-4 py-3 text-on-surface-variant text-xs">{p.category_name || '—'}</td>
                        <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                          <span className="text-primary">
                            ฿{Math.round(Number(p.original_price))}{p.description ? <span className="text-xs font-normal text-on-surface-variant ml-0.5">/{p.description}</span> : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {daysLeft !== null && daysLeft <= 3 ? (
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-xs text-outline/50 line-through">฿{Math.round(Number(p.original_price))}</span>
                              <span className="text-error font-bold text-sm">฿{Math.round(Number(p.original_price) * 0.7)}</span>
                              {p.description && <span className="text-xs font-normal text-on-surface-variant ml-0.5">/{p.description}</span>}
                            </div>
                          ) : (
                            <span className="text-xs text-outline/50">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-on-surface-variant">{p.stock_quantity}</td>
                        <td className="px-4 py-3 text-center text-on-surface-variant text-xs whitespace-nowrap">{formatDate(p.lot_in_date)}</td>
                        <td className="px-4 py-3 text-center text-on-surface-variant text-xs whitespace-nowrap">{formatDate(p.expiry_date)}</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {daysLeft !== null ? (
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                              daysLeft <= 0
                                ? 'bg-error/15 text-error'
                                : daysLeft <= 3
                                  ? 'bg-orange-100 text-orange-800'
                                  : daysLeft <= 7
                                    ? 'bg-amber-50 text-amber-800'
                                    : 'bg-primary/10 text-primary'
                            }`}>
                              {daysLeft <= 0 ? 'หมดอายุ' : `${daysLeft} วัน`}
                            </span>
                          ) : (
                            <span className="text-xs text-outline/50">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => router.push(`/admin/products/edit/${p.id}`)}
                              className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-md font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                            >
                              แก้ไข
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                              className="text-xs bg-error/10 text-error px-3 py-1.5 rounded-md font-medium hover:bg-error/20 transition-colors cursor-pointer"
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)}>
          <div
            className="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-outline-variant/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-error">delete_forever</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface font-headline-md">ยืนยันการลบสินค้า</h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  คุณต้องการลบสินค้า "<strong className="text-on-surface">{deleteTarget.name}</strong>" ใช่หรือไม่?
                </p>
                <p className="text-xs text-error/80 mt-1">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
              </div>
              <div className="flex items-center gap-3 w-full pt-1">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 border border-outline-variant/40 text-on-surface-variant px-5 py-2.5 rounded-lg font-medium hover:bg-surface-container-low transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-error text-on-error px-5 py-2.5 rounded-lg font-bold hover:brightness-110 transition-all text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {deleting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> กำลังลบ...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[16px]">delete</span> ลบสินค้า</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
