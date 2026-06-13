'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

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
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert(result.error || 'ลบไม่สำเร็จ');
      }
    } catch {
      alert('เกิดข้อผิดพลาด');
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">ทั้งหมด {products.length} รายการ</p>
          <Link
            href="/admin/products/add"
            className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-md hover:bg-surface-tint transition-all flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            เพิ่มสินค้า
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
            <span className="material-symbols-outlined text-5xl text-outline">inventory_2</span>
            <h3 className="text-xl font-headline-md text-on-surface-variant mt-4">ยังไม่มีสินค้า</h3>
            <p className="text-sm text-outline mt-1">เพิ่มสินค้าชิ้นแรกของคุณ</p>
            <Link href="/admin/products/add" className="inline-block bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md hover:bg-surface-tint transition-all mt-6">
              เพิ่มสินค้า
            </Link>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">รูป</th>
                    <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">สินค้า</th>
                    <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">หมวดหมู่</th>
                    <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">ราคาต่อหน่วย</th>
                    <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">จำนวนในสต๊อก</th>
                    <th className="text-center px-4 py-3 font-semibold text-on-surface-variant">วันนำเข้า</th>
                    <th className="text-center px-4 py-3 font-semibold text-on-surface-variant">วันหมดอายุ</th>
                    <th className="text-center px-4 py-3 font-semibold text-on-surface-variant">เหลือกี่วัน</th>
                    <th className="text-center px-4 py-3 font-semibold text-on-surface-variant">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const daysLeft = p.expiry_date
                      ? Math.ceil((new Date(p.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      : null;
                    const formatDate = (d: string) => {
                      if (!d) return '—';
                      const date = new Date(d);
                      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
                    };
                    return (
                      <tr key={p.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 bg-surface-container rounded-lg overflow-hidden flex items-center justify-center border border-outline-variant/10">
                            <img
                              src={p.image_url || 'https://placehold.co/48'}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-on-surface">{p.name}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{p.category_name || '—'}</td>
                        <td className="px-4 py-3 text-right font-semibold text-primary whitespace-nowrap">
                          ฿{Math.round(Number(p.price || p.original_price))}
                          {p.promo_price && <span className="text-xs text-outline line-through ml-1">฿{p.original_price}</span>}
                        </td>
                        <td className="px-4 py-3 text-right text-on-surface-variant">{p.stock_quantity}</td>
                        <td className="px-4 py-3 text-center text-on-surface-variant text-xs whitespace-nowrap">{formatDate(p.lot_in_date)}</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            daysLeft !== null && daysLeft <= 3
                              ? 'bg-error/10 text-error'
                              : daysLeft !== null && daysLeft <= 7
                                ? 'bg-warning/10 text-warning'
                                : 'text-on-surface-variant'
                          }`}>
                            {formatDate(p.expiry_date)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {daysLeft !== null ? (
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              daysLeft <= 0
                                ? 'bg-error/15 text-error'
                                : daysLeft <= 3
                                  ? 'bg-orange-100 text-orange-700'
                                  : daysLeft <= 7
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-success/10 text-success'
                            }`}>
                              {daysLeft <= 0 ? 'หมดอายุ' : `${daysLeft} วัน`}
                            </span>
                          ) : (
                            <span className="text-xs text-outline">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => router.push(`/admin/products/edit/${p.id}`)}
                              className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                            >
                              แก้ไข
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                              className="text-xs bg-error/10 text-error px-3 py-1.5 rounded-full font-medium hover:bg-error/20 transition-colors cursor-pointer"
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)}>
          <div
            className="bg-surface-container-lowest rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-outline-variant/20 text-center flex flex-col items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-error">delete_forever</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface font-headline-lg">ยืนยันการลบสินค้า</h3>
              <p className="text-sm text-on-surface-variant mt-2">
                คุณต้องการลบสินค้า "<strong className="text-on-surface">{deleteTarget.name}</strong>" ใช่หรือไม่?
              </p>
              <p className="text-xs text-error mt-1">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            </div>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 border border-outline-variant/40 text-on-surface-variant px-5 py-2.5 rounded-full font-medium hover:bg-surface-container-low transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-error text-on-error px-5 py-2.5 rounded-full font-bold hover:bg-error/90 transition-all text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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
      )}
    </>
  );
}
