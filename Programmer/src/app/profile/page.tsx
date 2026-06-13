"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

import THAI_LOCATION_DATA_RAW from '@/lib/thai-address.json';

const THAI_LOCATION_DATA = THAI_LOCATION_DATA_RAW as Record<string, Record<string, Record<string, string>>>;

const PROVINCES = Object.keys(THAI_LOCATION_DATA).sort((a, b) => a.localeCompare(b, 'th'));

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

interface Address {
  id: number;
  user_id: number;
  title: string;
  name: string;
  email: string;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { cartItems } = useCart();
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // General state
  const [editing, setEditing] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressItem, setEditingAddressItem] = useState<Address | null>(null);
  const [addressError, setAddressError] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: '',
    name: '',
    email: '',
    address: '',
    subdistrict: '',
    district: '',
    province: '',
    postal_code: '',
    phone: '',
    is_default: false
  });

  // Delete Confirmation State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const fetchOrders = async (userId: number) => {
    try {
      const res = await fetch(`/api/orders?user_id=${userId}`);
      const result = await res.json();
      if (result.success) setOrders(result.data);
    } catch { /* ignore */ }
    setOrdersLoading(false);
  };

  const fetchAddresses = async (userId: number) => {
    setAddressesLoading(true);
    try {
      const res = await fetch(`/api/auth/addresses?user_id=${userId}`);
      const result = await res.json();
      if (result.success && result.data) {
        setAddresses(result.data);
      }
    } catch (err) {
      console.error('Fetch addresses error:', err);
    }
    setAddressesLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);
        fetchOrders(u.id);
        fetchAddresses(u.id);
        
        fetch(`/api/auth/profile?id=${u.id}`)
          .then(res => res.json())
          .then(result => {
            if (result.success && result.data) {
              const latestUser = result.data;
              localStorage.setItem("user", JSON.stringify(latestUser));
              setUser(latestUser);
            }
          })
          .catch(() => { /* ignore */ });
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

  // Addresses handlers
  const handleOpenAddAddress = () => {
    setEditingAddressItem(null);
    setAddressForm({
      title: '',
      name: user?.name || '',
      email: user?.email || '',
      address: '',
      subdistrict: '',
      district: '',
      province: '',
      postal_code: '',
      phone: user?.phone || '',
      is_default: addresses.length === 0
    });
    setAddressError('');
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressItem(addr);
    setAddressForm({
      title: addr.title,
      name: addr.name || '',
      email: addr.email || '',
      address: addr.address,
      subdistrict: addr.subdistrict,
      district: addr.district,
      province: addr.province,
      postal_code: addr.postal_code,
      phone: addr.phone,
      is_default: addr.is_default
    });
    setAddressError('');
    setAddressModalOpen(true);
  };

  const handleProvinceChange = (provinceVal: string) => {
    setAddressForm(prev => ({
      ...prev,
      province: provinceVal,
      district: '',
      subdistrict: '',
      postal_code: ''
    }));
  };

  const handleDistrictChange = (districtVal: string) => {
    setAddressForm(prev => ({
      ...prev,
      district: districtVal,
      subdistrict: '',
      postal_code: ''
    }));
  };

  const handleSubdistrictChange = (subdistrictVal: string) => {
    setAddressForm(prev => {
      const pCode = THAI_LOCATION_DATA[prev.province]?.[prev.district]?.[subdistrictVal] || prev.postal_code;
      return {
        ...prev,
        subdistrict: subdistrictVal,
        postal_code: pCode
      };
    });
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      const res = await fetch('/api/auth/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          user_id: user.id,
          action: 'set_default'
        })
      });
      const result = await res.json();
      if (result.success) {
        // Refresh local user state for default address fields
        const profRes = await fetch(`/api/auth/profile?id=${user.id}`);
        const profResult = await profRes.json();
        if (profResult.success && profResult.data) {
          localStorage.setItem("user", JSON.stringify(profResult.data));
          setUser(profResult.data);
        }
        fetchAddresses(user.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = (id: number) => {
    setAddressToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      const res = await fetch(`/api/auth/addresses?id=${addressToDelete}&user_id=${user.id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        // Refresh local user state
        const profRes = await fetch(`/api/auth/profile?id=${user.id}`);
        const profResult = await profRes.json();
        if (profResult.success && profResult.data) {
          localStorage.setItem("user", JSON.stringify(profResult.data));
          setUser(profResult.data);
        }
        fetchAddresses(user.id);
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการลบที่อยู่');
      }
    } catch (err) {
      console.error(err);
    }
    setDeleteConfirmOpen(false);
    setAddressToDelete(null);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.title || !addressForm.name || !addressForm.email || !addressForm.address || !addressForm.district || !addressForm.province || !addressForm.phone) {
      setAddressError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    setSavingAddress(true);
    setAddressError('');

    try {
      let res;
      if (editingAddressItem) {
        res = await fetch('/api/auth/addresses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingAddressItem.id,
            user_id: user.id,
            ...addressForm
          })
        });
      } else {
        res = await fetch('/api/auth/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            ...addressForm
          })
        });
      }

      const result = await res.json();
      if (result.success) {
        // Refresh local user state
        const profRes = await fetch(`/api/auth/profile?id=${user.id}`);
        const profResult = await profRes.json();
        if (profResult.success && profResult.data) {
          localStorage.setItem("user", JSON.stringify(profResult.data));
          setUser(profResult.data);
        }
        setAddressModalOpen(false);
        fetchAddresses(user.id);
      } else {
        setAddressError(result.error || 'เกิดข้อผิดพลาดในการบันทึกที่อยู่');
      }
    } catch {
      setAddressError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
    }
    setSavingAddress(false);
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf6]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f8faf6] text-[#1b3322] min-h-screen flex flex-col font-body-md">
      <header className="sticky top-0 z-50 w-full bg-[#1b3322]/95 backdrop-blur-md transition-all duration-300 border-b border-primary-container/20">
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
                <Link href="/register" className="bg-on-primary text-[#1b3322] font-label-lg px-4 py-2 rounded-full hover:bg-inverse-primary transition-all shadow-sm cursor-pointer">สมัครสมาชิก</Link>
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

        {/* Green Profile Header Card */}
        <div className="bg-[#224229] rounded-[24px] p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-white relative overflow-hidden shadow-md">
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full sm:w-auto text-center sm:text-left">
            {/* Avatar container with green border and icon */}
            <div className="w-24 h-24 rounded-full border-4 border-[#335c3c] bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-[48px]" data-weight="fill">person</span>
            </div>
            
            <div className="flex flex-col min-w-0">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="font-bold text-2xl truncate">{user.name}</span>
              </div>
              <span className="text-white/60 text-sm mt-1 font-semibold truncate">@{user.username}</span>
            </div>
          </div>

          {editing ? (
            <button 
              onClick={() => setEditing(false)}
              className="bg-white text-[#1b3322] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-all shadow-md relative z-10 active:scale-95 shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              ยกเลิก
            </button>
          ) : (
            <button 
              onClick={() => setEditing(true)}
              className="bg-white text-[#1b3322] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-all shadow-md relative z-10 active:scale-95 shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              แก้ไขโปรไฟล์
            </button>
          )}
        </div>

        {/* Edit View */}
        {editing ? (
          <>
            {/* ที่อยู่จัดส่ง Section */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg md:text-xl text-[#1b3322] font-headline-md">ที่อยู่จัดส่ง</h2>
                <span className="text-xs text-gray-400 font-semibold">
                  บันทึกแล้ว {addresses.length} จาก 5 ที่อยู่
                </span>
              </div>

              {addressesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      className={`bg-white rounded-2xl p-5 border-2 transition-all flex flex-col gap-3 relative ${
                        addr.is_default ? 'border-[#1b3322]' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        {/* Left side: Badge & Title */}
                        <div className="flex flex-col gap-2 shrink-0 w-full sm:w-[110px]">
                          {addr.is_default ? (
                            <span className="bg-[#1b3322] text-white px-3 py-1 rounded-full text-[11px] font-bold text-center w-fit">
                              ค่าเริ่มต้น
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="bg-[#f4f7f3] text-gray-500 hover:bg-[#e2efe0] hover:text-[#1b3322] px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer text-center w-fit"
                            >
                              ตั้งเป็นค่าเริ่มต้น
                            </button>
                          )}
                          <p className="font-bold text-xs text-[#1b3322] mt-1">{addr.title}</p>
                        </div>

                        {/* Middle side: User contact & Address */}
                        <div className="flex-grow flex flex-col gap-1.5 text-xs text-gray-500 min-w-0">
                          <p className="font-bold text-sm text-[#1b3322]">{addr.name}</p>
                          <p className="leading-relaxed">
                            {addr.address} ต.{addr.subdistrict} อ.{addr.district} จ.{addr.province} {addr.postal_code}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="material-symbols-outlined text-[16px] text-gray-400">mail</span>
                            <span className="font-mono">{addr.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-gray-400">call</span>
                            <span>{addr.phone}</span>
                          </div>
                        </div>

                        {/* Right side: Action buttons */}
                        <div className="flex items-center gap-1 shrink-0 self-center sm:self-start">
                          <button 
                            onClick={() => handleOpenEditAddress(addr)}
                            className="text-gray-400 hover:text-[#1b3322] p-1.5 rounded-full hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                            title="แก้ไขที่อยู่"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 flex items-center justify-center cursor-pointer"
                            title="ลบที่อยู่"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {addresses.length < 5 && (
                    <button 
                      onClick={handleOpenAddAddress}
                      className="bg-transparent hover:bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-[#1b3322] transition-all flex flex-col items-center justify-center gap-2 min-h-[140px] cursor-pointer text-gray-400 hover:text-[#1b3322] group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-[#e2efe0] flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-[24px]">add_location_alt</span>
                      </div>
                      <span className="text-xs font-semibold">เพิ่มที่อยู่ใหม่</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Default Profile Details View */
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg md:text-xl text-[#1b3322] font-headline-md">การซื้อของฉัน</h2>
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
                        ? 'bg-[#1b3322] text-white scale-105' 
                        : 'bg-[#f4f7f3] text-primary group-hover:bg-[#e2efe0] group-hover:scale-105'
                    }`}>
                      <span className="material-symbols-outlined text-[24px] md:text-[26px]">
                        {icon}
                      </span>
                    </div>
                    <span className={`text-[11px] md:text-xs font-semibold transition-colors ${
                      isActive ? 'text-[#1b3322] font-bold' : 'text-[#1b3322] group-hover:text-primary'
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
                          <span className="w-10 h-10 rounded-full bg-[#1b3322]/10 flex items-center justify-center">
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
      </main>

      {/* Address Form Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg p-6 md:p-8 rounded-3xl border border-gray-100 shadow-2xl relative animate-scale-up flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setAddressModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              title="ปิด"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <h2 className="text-xl font-bold text-[#1b3322] font-headline-lg border-b border-gray-100 pb-2">
              {editingAddressItem ? 'แก้ไขที่อยู่จัดส่ง' : 'เพิ่มที่อยู่ใหม่'}
            </h2>

            {addressError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{addressError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">ชื่อเรียกที่อยู่ (เช่น บ้านพักอาศัย, ที่ทำงาน) *</label>
                <input type="text" value={addressForm.title}
                  onChange={e => setAddressForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="เช่น บ้านพักอาศัย, ที่ทำงาน"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">ชื่อ-นามสกุล *</label>
                <input type="text" value={addressForm.name}
                  onChange={e => setAddressForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="ชื่อ-นามสกุล ผู้รับ"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">อีเมล *</label>
                <input type="email" value={addressForm.email}
                  onChange={e => setAddressForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="อีเมลผู้รับ"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
                <input type="text" value={addressForm.phone}
                  onChange={e => setAddressForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="เบอร์โทรศัพท์สำหรับจัดส่ง"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">จังหวัด *</label>
                <div className="relative">
                  <select value={addressForm.province} onChange={e => handleProvinceChange(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 pr-10 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] transition-colors appearance-none">
                    <option value="">เลือกจังหวัด</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[20px]">arrow_drop_down</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">อำเภอ / เขต *</label>
                {addressForm.province && THAI_LOCATION_DATA[addressForm.province] ? (
                  <div className="relative">
                    <select value={addressForm.district} onChange={e => handleDistrictChange(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 pr-10 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] transition-colors appearance-none">
                      <option value="">เลือกอำเภอ</option>
                      {Object.keys(THAI_LOCATION_DATA[addressForm.province]).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[20px]">arrow_drop_down</span>
                  </div>
                ) : (
                  <input type="text" value={addressForm.district}
                    onChange={e => setAddressForm(p => ({ ...p, district: e.target.value }))}
                    placeholder="อำเภอ"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">ตำบล / แขวง</label>
                {addressForm.province && addressForm.district && THAI_LOCATION_DATA[addressForm.province]?.[addressForm.district] ? (
                  <div className="relative">
                    <select value={addressForm.subdistrict} onChange={e => handleSubdistrictChange(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 pr-10 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] transition-colors appearance-none">
                      <option value="">เลือกตำบล</option>
                      {Object.keys(THAI_LOCATION_DATA[addressForm.province][addressForm.district]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[20px]">arrow_drop_down</span>
                  </div>
                ) : (
                  <input type="text" value={addressForm.subdistrict}
                    onChange={e => setAddressForm(p => ({ ...p, subdistrict: e.target.value }))}
                    placeholder="ตำบล"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">รหัสไปรษณีย์</label>
                <input type="text" value={addressForm.postal_code}
                  onChange={e => setAddressForm(p => ({ ...p, postal_code: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                  maxLength={5}
                  disabled={!!(addressForm.province && addressForm.district && addressForm.subdistrict && THAI_LOCATION_DATA[addressForm.province]?.[addressForm.district]?.[addressForm.subdistrict])}
                  placeholder="รหัสไปรษณีย์"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors disabled:opacity-70 disabled:bg-gray-100" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1">รายละเอียดที่อยู่ (บ้านเลขที่, ถนน, ซอย) *</label>
                <textarea
                  rows={2}
                  value={addressForm.address}
                  onChange={e => setAddressForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="บ้านเลขที่, หมู่บ้าน, ถนน"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors resize-none" />
              </div>

              <div className="md:col-span-2 flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="is_default_checkbox"
                  checked={addressForm.is_default}
                  disabled={editingAddressItem?.is_default}
                  onChange={e => setAddressForm(p => ({ ...p, is_default: e.target.checked }))}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" 
                />
                <label htmlFor="is_default_checkbox" className="text-xs font-semibold text-gray-600 select-none cursor-pointer">
                  ตั้งเป็นที่อยู่เริ่มต้น
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-2">
              <button 
                onClick={() => setAddressModalOpen(false)} 
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSaveAddress} 
                disabled={savingAddress}
                className="px-6 py-2.5 rounded-full bg-[#1b3322] text-white hover:bg-[#1b3322]/90 disabled:opacity-50 font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                {savingAddress ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm p-6 rounded-3xl border border-gray-100 shadow-2xl relative animate-scale-up flex flex-col items-center text-center gap-4">
            <h3 className="text-lg font-bold text-[#1b3322]">ยืนยันการลบที่อยู่</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-full font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                ใช่, ลบที่อยู่นี้
              </button>
              <button
                onClick={() => { setDeleteConfirmOpen(false); setAddressToDelete(null); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}