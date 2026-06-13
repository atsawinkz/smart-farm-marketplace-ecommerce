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
  const [user, setUser] = useState<any>(null);
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
              <Link href="/orders" className="text-xs md:text-sm font-medium text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                <span>ดูประวัติการสั่งซื้อ</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-50 mt-2">
              <Link href="/orders?tab=pending" className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#f4f7f3] text-primary group-hover:bg-[#e2efe0] group-hover:scale-105 transition-all flex items-center justify-center shadow-sm mb-3">
                  <span className="material-symbols-outlined text-[26px]">pending_actions</span>
                </div>
                <span className="text-xs md:text-sm text-[#1b3322] font-semibold group-hover:text-primary transition-colors">รอการชำระเงิน</span>
              </Link>

              <Link href="/orders?tab=paid" className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#f4f7f3] text-primary group-hover:bg-[#e2efe0] group-hover:scale-105 transition-all flex items-center justify-center shadow-sm mb-3">
                  <span className="material-symbols-outlined text-[26px]">local_shipping</span>
                </div>
                <span className="text-xs md:text-sm text-[#1b3322] font-semibold group-hover:text-primary transition-colors">ที่ต้องจัดส่ง</span>
              </Link>

              <Link href="/orders?tab=shipped" className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#f4f7f3] text-primary group-hover:bg-[#e2efe0] group-hover:scale-105 transition-all flex items-center justify-center shadow-sm mb-3">
                  <span className="material-symbols-outlined text-[26px]">check_circle</span>
                </div>
                <span className="text-xs md:text-sm text-[#1b3322] font-semibold group-hover:text-primary transition-colors">สำเร็จแล้ว</span>
              </Link>

              <Link href="/orders?tab=cancelled" className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#f4f7f3] text-primary group-hover:bg-[#e2efe0] group-hover:scale-105 transition-all flex items-center justify-center shadow-sm mb-3">
                  <span className="material-symbols-outlined text-[26px]">cancel</span>
                </div>
                <span className="text-xs md:text-sm text-[#1b3322] font-semibold group-hover:text-primary transition-colors">สินค้าที่ยกเลิก</span>
              </Link>
            </div>
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
                    <select value={form.province} onChange={e => setForm(p => ({ ...p, province: e.target.value }))}
                      className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] transition-colors appearance-none">
                      <option value="">เลือกจังหวัด</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">อำเภอ / เขต</label>
                    <input type="text" value={form.district}
                      onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">ตำบล / แขวง</label>
                    <input type="text" value={form.subdistrict}
                      onChange={e => setForm(p => ({ ...p, subdistrict: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">รหัสไปรษณีย์</label>
                    <input type="text" value={form.postal_code}
                      onChange={e => setForm(p => ({ ...p, postal_code: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                      maxLength={5}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none focus:border-[#2e7d32] bg-white transition-colors" />
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