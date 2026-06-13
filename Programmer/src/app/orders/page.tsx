'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'รอดำเนินการ', color: 'bg-amber-100 text-amber-800' },
  paid: { label: 'ชำระเงินแล้ว', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'จัดส่งแล้ว', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-800' },
};

const PAYMENT_LABELS: Record<string, string> = {
  promptpay: 'พร้อมเพย์',
  bank_transfer: 'โอนเงิน',
  cod: 'เก็บปลายทาง',
  credit_card: 'บัตรเครดิต',
};

const TABS = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'pending', label: 'รอดำเนินการ' },
  { id: 'paid', label: 'ชำระแล้ว' },
  { id: 'shipped', label: 'จัดส่งแล้ว' },
  { id: 'cancelled', label: 'ยกเลิก' },
];

export default function OrdersPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [user, setUser] = React.useState<any>(null);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('all');

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.push('/login'); return; }
    try {
      const u = JSON.parse(storedUser);
      setUser(u);
      fetchOrders(u.id);
    } catch { router.push('/login'); }
  }, [router]);

  const fetchOrders = async (userId: number) => {
    try {
      const res = await fetch(`/api/orders?user_id=${userId}`);
      const result = await res.json();
      if (result.success) setOrders(result.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-surface text-on-surface">
      <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-md border-b border-primary-container/20">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto">
          <Link href="/" className="text-white font-headline-md font-bold flex items-center gap-2 group">
            <span className="material-symbols-outlined text-inverse-primary text-3xl group-hover:-rotate-12 transition-transform" data-weight="fill">eco</span>
            Smart Farm Marketplace
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/cart" className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 flex items-center justify-center relative bg-white/10">
              <span className="material-symbols-outlined">shopping_cart</span>
              {totalCartQuantity > 0 && <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1">{totalCartQuantity}</span>}
            </Link>
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-[1px] h-6 bg-white/20"></div>
              <span className="text-white font-medium text-sm leading-tight group-hover:text-inverse-primary transition-colors hidden md:inline">{user.name}</span>
              <div className="w-8 h-8 rounded-full bg-[#e2efe0] flex items-center justify-center text-[#1b3322]">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-surface-tint transition-colors mb-6 w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>กลับ</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-headline-lg font-bold text-primary mb-6">คำสั่งซื้อของฉัน</h1>

        <div className="border-b border-outline-variant/30 mb-6 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-outline hover:text-on-surface-variant'
                }`}
              >
                {tab.label}
                {tab.id !== 'all' && (
                  <span className="ml-1.5 text-xs">({orders.filter(o => o.status === tab.id).length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant/20">
            <span className="material-symbols-outlined text-6xl text-outline">shopping_bag</span>
            <h3 className="text-xl font-headline-md text-on-surface-variant font-medium mt-4">
              {activeTab === 'all' ? 'ยังไม่มีคำสั่งซื้อ' : 'ไม่มีคำสั่งซื้อในหมวดนี้'}
            </h3>
            <p className="text-body-md text-outline mt-2">
              {activeTab === 'all' ? 'คุณยังไม่มีประวัติการสั่งซื้อ' : 'ลองตรวจสอบหมวดหมู่อื่น'}
            </p>
            {activeTab === 'all' && (
              <Link href="/" className="inline-block bg-primary text-on-primary font-label-md px-6 py-2.5 rounded-full hover:bg-surface-tint transition-all mt-6">เลือกซื้อสินค้า</Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map(order => {
              const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
              const itemCount = order.items ? order.items.reduce((s: number, i: any) => s + i.quantity, 0) : 0;
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-outline-variant/20 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex-grow flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                      </span>
                      <div>
                        <p className="font-bold text-on-surface text-sm">#SF-{order.id}</p>
                        <p className="text-xs text-outline">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="md:ml-4 flex items-center gap-4 text-sm text-on-surface-variant">
                      <span>{itemCount} รายการ</span>
                      <span className="hidden md:inline text-outline">|</span>
                      <span>{PAYMENT_LABELS[order.payment_method] || order.payment_method}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                    <span className="text-lg font-extrabold text-primary font-headline-lg">{Math.round(parseFloat(order.total_price))} บาท</span>
                    <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
