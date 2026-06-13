'use client';

import React, { useState, useEffect } from 'react';

interface OrderItem {
  product_name: string;
  quantity: number;
  price_per_unit: string;
}

interface Order {
  id: number;
  user_id: number;
  total_price: string;
  status: string;
  created_at: string;
  user_name: string;
  user_address: string;
  user_phone: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'รอดำเนินการ', bg: 'bg-primary-container/10', text: 'text-on-primary-container' },
  shipped: { label: 'ที่ต้องจัดส่ง', bg: 'bg-secondary-container/20', text: 'text-on-secondary-container' },
  completed: { label: 'เสร็จสิ้น', bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
  cancelled: { label: 'ยกเลิก', bg: 'bg-error-container/20', text: 'text-on-error-container' },
};

const ADMIN_STATUS_OPTIONS = [
  { value: 'pending', label: 'รอดำเนินการ' },
  { value: 'shipped', label: 'ที่ต้องจัดส่ง' },
];

const STATUS_FILTERS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'pending', label: 'รอดำเนินการ' },
  { value: 'shipped', label: 'ที่ต้องจัดส่ง' },
];

const FILTER_MATCH: Record<string, string[]> = {
  all: [],
  pending: ['pending'],
  shipped: ['shipped'],
  completed: ['completed'],
  cancelled: ['cancelled'],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const result = await res.json();
      if (result.success) setOrders(result.data);
    } catch {}
    setLoading(false);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (newStatus === 'completed' || newStatus === 'cancelled') return;
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
    } catch {}
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getDate()} ${['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][date.getMonth()]} ${date.getFullYear() + 543} | ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const formatPrice = (price: string) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(Number(price));

  const isAdminEditable = (status: string) => status === 'pending' || status === 'shipped';

  const filteredOrders = orders
    .filter((o) => {
      if (filter === 'all') return true;
      return (FILTER_MATCH[filter] || []).includes(o.status);
    });

  const summaryCards = [
    {
      label: 'รอดำเนินการ',
      value: orders.filter((o) => o.status === 'pending').length,
      icon: 'payments',
      color: 'bg-primary-container/10 border-primary-container/20',
      iconBg: 'bg-primary-container text-on-primary',
      badge: '+12% vs เมื่อวาน',
      badgeColor: 'text-primary',
    },
    {
      label: 'ที่ต้องจัดส่ง',
      value: orders.filter((o) => o.status === 'shipped').length,
      icon: 'assignment_turned_in',
      color: 'bg-secondary-container/20 border-secondary-container/40',
      iconBg: 'bg-secondary text-on-secondary',
      badge: 'รอการจัดส่ง',
      badgeColor: 'text-secondary',
    },
    {
      label: 'เสร็จสิ้น',
      value: orders.filter((o) => o.status === 'completed').length,
      icon: 'package_2',
      color: 'bg-surface-container-high border-outline-variant/30',
      iconBg: 'bg-outline text-surface',
      badge: 'เสร็จสมบูรณ์',
      badgeColor: 'text-on-surface-variant',
    },
    {
      label: 'ยกเลิก',
      value: orders.filter((o) => o.status === 'cancelled').length,
      icon: 'cancel',
      color: 'bg-error-container/20 border-error-container/40',
      iconBg: 'bg-error text-on-error',
      badge: 'ยกเลิก',
      badgeColor: 'text-error',
    },
  ];

  const getInitialsBg = (name: string | null | undefined) => {
    const safeName = name || 'Customer';
    const palettes = ['bg-tertiary-fixed text-tertiary', 'bg-secondary-fixed text-secondary', 'bg-primary-fixed text-primary', 'bg-tertiary-container/20 text-tertiary', 'bg-error-container/20 text-error'];
    let hash = 0;
    for (let i = 0; i < safeName.length; i++) hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    return palettes[Math.abs(hash) % palettes.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold font-headline-lg text-primary">Order Status Management</h2>
          <p className="text-sm text-on-surface-variant/80 mt-1">จัดการสถานะการสั่งซื้อสินค้าเกษตรประจำวัน</p>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className={`p-5 rounded-xl border ${card.color}`}>
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${card.badgeColor}`}>{card.badge}</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-on-surface mt-0.5">{card.value} รายการ</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              filter === f.value
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="text-left px-6 py-4 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-4 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">ลูกค้า</th>
                <th className="text-left px-6 py-4 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">วันที่สั่งซื้อ</th>
                <th className="text-right px-6 py-4 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">ยอดรวม</th>
                <th className="text-center px-6 py-4 font-semibold text-on-surface-variant text-[11px] uppercase tracking-wider">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant text-sm">ไม่พบรายการออเดอร์</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const initials = order.user_name?.replace(/คุณ/, '').charAt(0) || '?';
                  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const editable = isAdminEditable(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-6 py-5 font-bold text-primary text-xs">#SK-{String(order.id).padStart(4, '0')}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${getInitialsBg(order.user_name)}`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface text-sm">{order.user_name || 'ลูกค้า'}</p>
                            <p className="text-xs text-on-surface-variant">{order.user_address || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant text-xs">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-5 text-right font-bold text-primary">{formatPrice(order.total_price)}</td>
                      <td className="px-6 py-5 text-center">
                        {editable ? (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none ${config.bg} ${config.text}`}
                          >
                            {ADMIN_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                            {config.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant">แสดง 1-{filteredOrders.length} จาก {filteredOrders.length} รายการ</p>
        </div>
      </div>
    </div>
  );
}
