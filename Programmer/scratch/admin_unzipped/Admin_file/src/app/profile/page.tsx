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

export default function ProfilePage() {
  interface UserProfile {
    id: number; name: string; email: string; phone: string; role: string;
    address?: string; subdistrict?: string; district?: string;
    province?: string; postal_code?: string; username?: string;
  }
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const { cartItems } = useCart();
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', subdistrict: '', district: '', province: '', postal_code: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      try {
        const u = JSON.parse(storedUser);
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
      } catch {
        router.push("/login");
      }
    }
  }, [router]);

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

  const saveProfile = async () => {
    if (!user) return;
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
            Smart Farm Marketplace
          </Link>
          <div className="flex items-center gap-stack-md">
            <Link href="/cart" className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 flex items-center justify-center relative bg-white/10">
              <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
              {totalCartQuantity > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">{totalCartQuantity}</span>
              )}
            </Link>
            {user ? (
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
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-white hover:text-white/80 font-label-lg transition-colors px-4 py-2 cursor-pointer">เข้าสู่ระบบ</Link>
                <Link href="/register" className="bg-on-primary text-primary font-label-lg px-4 py-2 rounded-full hover:bg-inverse-primary transition-all shadow-sm cursor-pointer">สมัครสมาชิก</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-[280px] flex flex-col gap-4 shrink-0">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#e2efe0] flex items-center justify-center text-[#1b3322] font-semibold shrink-0">
              <span className="material-symbols-outlined text-[26px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-[#1b3322] truncate">{user.name}</span>
              <span className="text-xs text-gray-400 truncate">{user.email}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col gap-1">
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#e2efe0] text-[#1b3322] font-semibold text-sm transition-colors">
              <span className="material-symbols-outlined text-[20px]">person</span>
              <span>โปรไฟล์ของฉัน</span>
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>คำสั่งซื้อ</span>
            </Link>
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-600 hover:bg-amber-50 text-sm transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                <span>จัดการสินค้า (Admin)</span>
              </Link>
            )}
          </div>
        </aside>

        <section className="flex-grow flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1b3322] transition-colors self-start">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>กลับสู่หน้าหลัก</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#1b3322]">จัดการโปรไฟล์</h1>

          {/* Personal Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-[#1b3322]">ข้อมูลส่วนตัว</h2>
              {!editing ? (
                <button onClick={startEdit} className="text-sm font-semibold text-[#2e7d32] hover:underline cursor-pointer">แก้ไข</button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={cancelEdit} className="text-sm font-semibold text-gray-400 hover:text-gray-600 cursor-pointer">ยกเลิก</button>
                  <button onClick={saveProfile} disabled={saving} className="text-sm font-semibold text-[#2e7d32] hover:underline disabled:opacity-50 cursor-pointer">
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                </div>
              )}
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">ชื่อ-นามสกุล</label>
                <input type="text" readOnly={!editing} value={editing ? form.name : user.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className={`w-full border rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none transition-colors ${editing ? 'bg-white border-gray-300 focus:border-[#2e7d32]' : 'bg-[#f8faf6] border-gray-100'}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">อีเมล</label>
                <input type="email" readOnly={!editing} value={editing ? form.email : user.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className={`w-full border rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none transition-colors ${editing ? 'bg-white border-gray-300 focus:border-[#2e7d32]' : 'bg-[#f8faf6] border-gray-100'}`} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1">เบอร์โทรศัพท์</label>
                <input type="text" readOnly={!editing} value={editing ? form.phone : (user.phone || '-')}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className={`w-full border rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none transition-colors ${editing ? 'bg-white border-gray-300 focus:border-[#2e7d32]' : 'bg-[#f8faf6] border-gray-100'}`} />
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-[#1b3322]">ที่อยู่จัดส่ง</h2>
              {!editing ? (
                <button onClick={startEdit} className="text-sm font-semibold text-[#2e7d32] hover:underline cursor-pointer">แก้ไข</button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={cancelEdit} className="text-sm font-semibold text-gray-400 hover:text-gray-600 cursor-pointer">ยกเลิก</button>
                  <button onClick={saveProfile} disabled={saving} className="text-sm font-semibold text-[#2e7d32] hover:underline disabled:opacity-50 cursor-pointer">
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1">ที่อยู่</label>
                <textarea
                  rows={2} readOnly={!editing}
                  value={editing ? form.address : (user.address || '')}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="บ้านเลขที่, หมู่บ้าน, ถนน"
                  className={`w-full border rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none transition-colors resize-none ${editing ? 'bg-white border-gray-300 focus:border-[#2e7d32]' : 'bg-[#f8faf6] border-gray-100'}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">ตำบล / แขวง</label>
                <input type="text" readOnly={!editing} value={editing ? form.subdistrict : (user.subdistrict || '')}
                  onChange={e => setForm(p => ({ ...p, subdistrict: e.target.value }))}
                  className={`w-full border rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none transition-colors ${editing ? 'bg-white border-gray-300 focus:border-[#2e7d32]' : 'bg-[#f8faf6] border-gray-100'}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">อำเภอ / เขต</label>
                <input type="text" readOnly={!editing} value={editing ? form.district : (user.district || '')}
                  onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                  className={`w-full border rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none transition-colors ${editing ? 'bg-white border-gray-300 focus:border-[#2e7d32]' : 'bg-[#f8faf6] border-gray-100'}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">จังหวัด</label>
                {editing ? (
                  <select value={form.province} onChange={e => setForm(p => ({ ...p, province: e.target.value }))}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] transition-colors appearance-none">
                    <option value="">เลือกจังหวัด</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                ) : (
                  <input type="text" readOnly value={user.province || ''}
                    className="w-full bg-[#f8faf6] border border-gray-100 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none" />
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">รหัสไปรษณีย์</label>
                <input type="text" readOnly={!editing} value={editing ? form.postal_code : (user.postal_code || '')}
                  onChange={e => setForm(p => ({ ...p, postal_code: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                  maxLength={5}
                  className={`w-full border rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none transition-colors ${editing ? 'bg-white border-gray-300 focus:border-[#2e7d32]' : 'bg-[#f8faf6] border-gray-100'}`} />
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="self-end border border-red-200 hover:border-red-300 text-red-500 hover:bg-red-50 font-medium py-2.5 px-6 rounded-full flex items-center gap-2 transition-colors cursor-pointer text-sm shadow-sm">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>ออกจากระบบ</span>
          </button>
        </section>
      </main>
    </div>
  );
}