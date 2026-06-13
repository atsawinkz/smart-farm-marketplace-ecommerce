'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'รอดำเนินการ', color: 'bg-amber-100 text-amber-800', icon: 'hourglass_empty' },
  paid: { label: 'ชำระเงินแล้ว', color: 'bg-blue-100 text-blue-800', icon: 'check_circle' },
  shipped: { label: 'จัดส่งแล้ว', color: 'bg-green-100 text-green-800', icon: 'local_shipping' },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-800', icon: 'cancel' },
};

const PAYMENT_LABELS: Record<string, string> = {
  promptpay: 'พร้อมเพย์',
  bank_transfer: 'โอนเงินผ่านธนาคาร',
  cod: 'เก็บเงินปลายทาง',
  credit_card: 'บัตรเครดิต / เดบิต',
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [user, setUser] = React.useState<any>(null);
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.push('/login'); return; }
    try {
      const u = JSON.parse(storedUser);
      setUser(u);
      fetchOrder(u.id);
    } catch { router.push('/login'); }
  }, [router]);

  const fetchOrder = async (userId: number) => {
    try {
      const res = await fetch(`/api/orders?user_id=${userId}`);
      const result = await res.json();
      if (result.success) {
        const found = result.data.find((o: any) => o.id.toString() === orderId);
        if (found) setOrder(found);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface text-on-surface">
        <span className="material-symbols-outlined text-6xl text-outline">search_off</span>
        <h2 className="text-xl font-bold text-on-surface-variant">ไม่พบคำสั่งซื้อ</h2>
        <Link href="/orders" className="bg-primary text-on-primary px-6 py-2.5 rounded-full hover:bg-surface-tint transition-all">กลับไปรายการคำสั่งซื้อ</Link>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800', icon: 'info' };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-surface text-on-surface">
      <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-md border-b border-primary-container/20">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto">
          <Link href="/" className="text-white font-headline-md font-bold flex items-center gap-2 group">
            <span className="material-symbols-outlined text-inverse-primary text-3xl group-hover:-rotate-12 transition-transform" data-weight="fill">eco</span>
            Smartket
          </Link>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer group">
            <span className="text-white font-medium text-sm leading-tight group-hover:text-inverse-primary transition-colors hidden md:inline">{user.name}</span>
            <div className="w-8 h-8 rounded-full bg-[#e2efe0] flex items-center justify-center text-[#1b3322]">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-3xl w-full mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-surface-tint transition-colors mb-6 w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>กลับไปที่การสั่งซื้อ</span>
        </Link>

        <div className="flex flex-col gap-6">
          {/* Order Header */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-headline-lg font-bold text-primary">คำสั่งซื้อ #SF-{order.id}</h1>
                <p className="text-sm text-outline mt-1">{formatDate(order.created_at)}</p>
              </div>
              <span className={`text-sm font-bold px-4 py-2 rounded-full ${statusInfo.color} flex items-center gap-2 w-fit`}>
                <span className="material-symbols-outlined text-[18px]">{statusInfo.icon}</span>
                {statusInfo.label}
              </span>
            </div>

            {order.payment_status === 'pending' && order.status === 'pending' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600">info</span>
                <p className="text-sm text-amber-800">รอดำเนินการ อยู่ระหว่างรอการชำระเงิน</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
            <h2 className="text-lg font-bold text-primary font-headline-lg mb-4">รายการสินค้า</h2>
            <div className="flex flex-col gap-4">
              {order.items && order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-outline-variant/10 last:border-0">
                  <img src={item.image_url || 'https://placehold.co/60'} alt={item.product_name} className="w-16 h-16 rounded-xl object-contain bg-surface-container border border-outline-variant/10" />
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-on-surface text-sm truncate">{item.product_name}</p>
                    <p className="text-xs text-outline mt-0.5">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-primary">{Math.round(parseFloat(item.price_per_unit) * item.quantity)} บาท</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-outline-variant/20 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>ค่าจัดส่ง</span>
                <span className="font-semibold text-on-surface">40 บาท</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-primary">
                <span>ยอดรวมสุทธิ</span>
                <span>{Math.round(parseFloat(order.total_price))} บาท</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <h2 className="text-lg font-bold text-primary font-headline-lg">ที่อยู่จัดส่ง</h2>
              </div>
              <p className="text-sm text-on-surface leading-relaxed">{order.shipping_address}</p>
              {order.shipping_phone && <p className="text-sm text-outline mt-2">โทร: {order.shipping_phone}</p>}
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">payments</span>
              <h2 className="text-lg font-bold text-primary font-headline-lg">ข้อมูลการชำระเงิน</h2>
            </div>
            <div className="text-sm text-on-surface-variant space-y-2">
              <p>วิธีการชำระ: <span className="font-semibold text-on-surface">{PAYMENT_LABELS[order.payment_method] || order.payment_method}</span></p>
              {order.payment_status && <p>สถานะการชำระ: {order.payment_status === 'paid' ? <span className="text-green-600 font-semibold">ชำระแล้ว</span> : <span className="text-amber-600 font-semibold">รอดำเนินการ</span>}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
