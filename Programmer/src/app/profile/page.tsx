"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

const PROVINCES = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น',
  'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร',
  'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก',
  'นครปฐม', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี',
  'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์',
  'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 'พัทลุง',
  'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 'ภูเก็ต',
  'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด',
  'ระนอง', 'ระยอง', 'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน',
  'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ',
  'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย',
  'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง',
  'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี'
];

import THAI_LOCATION_DATA_RAW from '@/lib/thai-address.json';

const THAI_LOCATION_DATA = THAI_LOCATION_DATA_RAW as Record<string, Record<string, Record<string, string>>>;

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'รอชำระเงิน', color: 'bg-amber-100 text-amber-800' },
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
  { id: 'pending', label: 'รอชำระเงิน' },
  { id: 'paid', label: 'ชำระแล้ว' },
  { id: 'shipped', label: 'จัดส่งแล้ว' },
  { id: 'cancelled', label: 'ยกเลิก' },
];

const TAB_ICONS: Record<string, string> = {
  all: 'receipt_long',
  pending: 'pending_actions',
  paid: 'payments',
  shipped: 'local_shipping',
  cancelled: 'cancel',
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { cartItems } = useCart();
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', subdistrict: '', district: '', province: '', postal_code: '' });

  const fetchOrders = async (userId: number) => {
    try {
      const res = await fetch(`/api/orders?user_id=${userId}`);
      const result = await res.json();
      if (result.success) setOrders(result.data);
    } catch { /* ignore */ }
    setOrdersLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      try {
        const u = JSON.parse(storedUser);
        fetchOrders(u.id);
        
        fetch(`/api/auth/profile?id=${u.id}`)
          .then(res => res.json())
          .then(result => {
            if (result.success && result.data) {
              const latestUser = result.data;
              localStorage.setItem("user", JSON.stringify(latestUser));
              setUser(latestUser);
              setForm({
                name: latestUser.name || '',
                email: latestUser.email || '',
                phone: latestUser.phone || '',
                address: latestUser.address || '',
                subdistrict: latestUser.subdistrict || '',
                district: latestUser.district || '',
                province: latestUser.province || '',
                postal_code: latestUser.postal_code || '',
              });
            } else {
              setUser(u);
              setForm({
                name: u.name || '',
                email: u.email || '',
                phone: u.phone || '',
                address: u.address || '',
                subdistrict: u.subdistrict || '',
                district: u.district || '',
                province: u.province || '',
                postal_code: u.postal_code || '',
              });
            }
          })
          .catch(() => {
            setUser(u);
            setForm({
              name: u.name || '',
              email: u.email || '',
              phone: u.phone || '',
              address: u.address || '',
              subdistrict: u.subdistrict || '',
              district: u.district || '',
              province: u.province || '',
              postal_code: u.postal_code || '',
            });
          });
      } catch (err) {
        console.error("Failed to parse user session:", err);
        router.push("/login");
      }
    }
  }, [router]);

  const formatDate = (d: string) => {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const startEdit = () => {
    if (!user) return;
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      subdistrict: user.subdistrict || '',
      district: user.district || '',
      province: user.province || '',
      postal_code: user.postal_code || '',
    });
    setEditing(true);
    setError('');
  };

  const cancelEdit = () => {
    setEditing(false);
    setError('');
  };

  const handleProvinceChange = (provinceVal: string) => {
    setForm(prev => ({
      ...prev,
      province: provinceVal,
      district: '',
      subdistrict: '',
      postal_code: ''
    }));
  };

  const handleDistrictChange = (districtVal: string) => {
    setForm(prev => ({
      ...prev,
      district: districtVal,
      subdistrict: '',
      postal_code: ''
    }));
  };

  const handleSubdistrictChange = (subdistrictVal: string) => {
    setForm(prev => {
      const pCode = THAI_LOCATION_DATA[prev.province]?.[prev.district]?.[subdistrictVal] || prev.postal_code;
      return {
        ...prev,
        subdistrict: subdistrictVal,
        postal_code: pCode
      };
    });
  };

  const saveProfile = async () => {
    if (!form.name || !form.email) {
      setError('กรุณากรอกชื่อและอีเมล');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...form }),
      });
      const result = await res.json();

      if (!result.success) {
        setError(result.error || 'เกิดข้อผิดพลาด');
        setSaving(false);
        return;
      }

      const updatedUser = result.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
    }
    setSaving(false);
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8faf6] text-[#1b3322] min-h-screen flex flex-col font-body-md">
      <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-md transition-all duration-300 border-b border-primary-container/20">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto">
          <Link href="/" className="text-white font-headline-md font-bold flex items-center gap-2 group cursor-pointer">
            <span className="material-symbols-outlined text-inverse-primary text-3xl group-hover:-rotate-12 transition-transform duration-300" data-weight="fill">eco</span>
            Smartket
          </Link>
          <div className="flex items-center gap-stack-md">
            <Link href="/cart" className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 flex items-center justify-center relative bg-white/10">
              <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
              {totalCartQuantity > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">{totalCartQuantity}</span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-[1px] h-6 bg-white/20"></div>
                  <div className="flex flex-col text-right">
                    <span className="text-white font-medium text-sm leading-tight group-hover:text-inverse-primary transition-colors">{user.name}</span>
                    <span className="text-white/70 text-xs">{user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิกทั่วไป'}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#e2efe0] group-hover:bg-[#d5e8d2] transition-colors flex items-center justify-center text-[#1b3322]">
                    <span className="material-symbols-outlined text-[24px]">person</span>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer"
                  title="ออกจากระบบ"
                >
                  <span className="material-symbols-outlined text-[24px]">logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-white hover:text-white/80 font-label-lg transition-colors px-4 py-2 cursor-pointer">เข้าสู่ระบบ</Link>
                <Link href="/register" className="bg-on-primary text-primary font-label-lg px-4 py-2 rounded-full hover:bg-inverse-primary transition-all shadow-sm cursor-pointer">สมัครสมาชิก</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1000px] w-full mx-auto px-4 py-8 flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition-colors self-start">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>กลับสู่หน้าหลัก</span>
        </Link>

        {/* Profile Header Card */}
        <div className="bg-primary rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-white relative overflow-hidden shadow-md">
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full sm:w-auto text-center sm:text-left">
            {/* Avatar container */}
            <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-[40px]" data-weight="fill">person</span>
            </div>
            
            <div className="flex flex-col min-w-0">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="font-bold text-2xl truncate">{user.name}</span>
              </div>
              <span className="text-white/70 text-sm mt-2 font-mono truncate">{user.email}</span>
            </div>
          </div>

          {!editing && (
            <button 
              onClick={startEdit}
              className="bg-white text-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/90 transition-all shadow-md relative z-10 active:scale-95 shrink-0 cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* การซื้อของฉัน Card */}
        {!editing && (
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg md:text-xl text-[#1b3322]">การซื้อของฉัน</h2>
            </div>

            {/* Tabs Selector (Icons) */}
            <div className="grid grid-cols-5 gap-2 md:gap-4 py-4 border-t border-b border-gray-50 mt-2">
              {TABS.map(tab => {
                const tabCount = orders.filter(o => o.status === tab.id).length;
                const icon = TAB_ICONS[tab.id];
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-col items-center text-center group cursor-pointer outline-none"
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-sm mb-2 transition-all ${
                      isActive 
                        ? 'bg-primary text-white scale-105' 
                        : 'bg-[#f4f7f3] text-primary group-hover:bg-[#e2efe0] group-hover:scale-105'
                    }`}>
                      <span className="material-symbols-outlined text-[24px] md:text-[26px]">
                        {icon}
                      </span>
                    </div>
                    <span className={`text-[11px] md:text-xs font-semibold transition-colors ${
                      isActive ? 'text-primary font-bold' : 'text-[#1b3322] group-hover:text-primary'
                    }`}>
                      {tab.label}
                      {tab.id !== 'all' && tabCount > 0 && (
                        <span className="ml-1 text-[10px]">({tabCount})</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-[#f8faf6] rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-5xl text-gray-300">shopping_bag</span>
                <h3 className="text-md font-semibold text-gray-500">
                  {activeTab === 'all' ? 'ยังไม่มีคำสั่งซื้อ' : 'ไม่มีคำสั่งซื้อในหมวดนี้'}
                </h3>
                <p className="text-xs text-gray-400">
                  {activeTab === 'all' ? 'คุณยังไม่มีประวัติการสั่งซื้อ' : 'ลองตรวจสอบหมวดหมู่อื่น'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredOrders.map(order => {
                  const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
                  const itemCount = order.items ? order.items.reduce((s: number, i: any) => s + i.quantity, 0) : 0;
                  const price = order.total_price ? parseFloat(order.total_price) : 0;

                  return (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="bg-[#f8faf6] rounded-2xl p-5 border border-gray-100 hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center gap-4 group"
                    >
                      <div className="flex-grow flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#2e7d32]">receipt_long</span>
                          </span>
                          <div>
                            <p className="font-bold text-[#1b3322] text-sm group-hover:text-primary transition-colors">#SF-{order.id}</p>
                            <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                        <div className="md:ml-4 flex items-center gap-4 text-xs text-gray-500">
                          <span>{itemCount} รายการ</span>
                          <span className="hidden md:inline text-gray-300">|</span>
                          <span>{PAYMENT_LABELS[order.payment_method] || order.payment_method}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                        <span className="text-md font-bold text-primary">{price.toFixed(0)} บาท</span>
                        <span className="material-symbols-outlined text-gray-400 text-[20px] group-hover:translate-x-1 transition-transform">chevron_right</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {editing && (
          <>
            {/* Personal Info & Address Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-8 animate-fade-in">
              {/* ข้อมูลส่วนตัว Section */}
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-lg md:text-xl text-[#1b3322] border-b border-gray-100 pb-2">ข้อมูลส่วนตัว</h2>
                {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">ชื่อ-นามสกุล</label>
                    <input type="text" value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">อีเมล</label>
                    <input type="email" value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">เบอร์โทรศัพท์</label>
                    <input type="text" value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* ที่อยู่จัดส่ง Section */}
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-lg md:text-xl text-[#1b3322] border-b border-gray-100 pb-2">ที่อยู่จัดส่ง</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">จังหวัด</label>
                    <div className="relative">
                      <select value={form.province} onChange={e => handleProvinceChange(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 pr-10 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] transition-colors appearance-none">
                        <option value="">เลือกจังหวัด</option>
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">arrow_drop_down</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">อำเภอ / เขต</label>
                    {form.province && THAI_LOCATION_DATA[form.province] ? (
                      <div className="relative">
                        <select value={form.district} onChange={e => handleDistrictChange(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 pr-10 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] transition-colors appearance-none">
                          <option value="">เลือกอำเภอ</option>
                          {Object.keys(THAI_LOCATION_DATA[form.province]).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">arrow_drop_down</span>
                      </div>
                    ) : (
                      <input type="text" value={form.district}
                        onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">ตำบล / แขวง</label>
                    {form.province && form.district && THAI_LOCATION_DATA[form.province]?.[form.district] ? (
                      <div className="relative">
                        <select value={form.subdistrict} onChange={e => handleSubdistrictChange(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 pr-10 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] transition-colors appearance-none">
                          <option value="">เลือกตำบล</option>
                          {Object.keys(THAI_LOCATION_DATA[form.province][form.district]).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">arrow_drop_down</span>
                      </div>
                    ) : (
                      <input type="text" value={form.subdistrict}
                        onChange={e => setForm(p => ({ ...p, subdistrict: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">รหัสไปรษณีย์</label>
                    <input type="text" value={form.postal_code}
                      onChange={e => setForm(p => ({ ...p, postal_code: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                      maxLength={5}
                      disabled={!!(form.province && form.district && form.subdistrict && THAI_LOCATION_DATA[form.province]?.[form.district]?.[form.subdistrict])}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors disabled:opacity-70 disabled:bg-gray-100" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">ที่อยู่</label>
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                      placeholder="บ้านเลขที่, หมู่บ้าน, ถนน"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors resize-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Save / Cancel actions */}
            <div className="flex justify-end gap-3 animate-fade-in">
              <button 
                onClick={cancelEdit} 
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button 
                onClick={saveProfile} 
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </>
        )}

      </main>
    </div>
  );
}