"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { cartItems } = useCart();
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      try {
        setUser(JSON.parse(storedUser));
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8faf6] text-[#1b3322] min-h-screen flex flex-col font-body-md">
      {/* TopNavBar */}
      <header
        className="sticky top-0 z-50 w-full bg-primary/95 dark:bg-primary-container/95 backdrop-blur-md transition-all duration-300 border-b border-primary-container/20"
      >
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto">
          {/* Brand Logo */}
          <Link
            href="/"
            className="text-white font-headline-md font-bold flex items-center gap-2 group cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-inverse-primary text-3xl group-hover:-rotate-12 transition-transform duration-300"
              data-weight="fill"
            >
              eco
            </span>
            Smart Farm Marketplace
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-stack-md">
            {/* Shopping Cart button */}
            <Link
              href="/cart"
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 flex items-center justify-center relative bg-white/10"
            >
              <span className="material-symbols-outlined" data-icon="shopping_cart">
                shopping_cart
              </span>
              {totalCartQuantity > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
                  {totalCartQuantity}
                </span>
              )}
            </Link>

            {/* User Profile / Registration Buttons */}
            {user ? (
              <Link href="/profile" className="flex items-center gap-3 cursor-pointer group">
                <div className="w-[1px] h-6 bg-white/20"></div>
                <div className="flex flex-col text-right">
                  <span className="text-white font-medium text-sm leading-tight group-hover:text-inverse-primary transition-colors">{user.name}</span>
                  <span className="text-white/70 text-xs">{user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิกทั่วไป'}</span>
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-[#e2efe0] group-hover:bg-[#d5e8d2] transition-colors flex items-center justify-center text-[#1b3322]"
                >
                  <span className="material-symbols-outlined text-[24px]">person</span>
                </div>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-white hover:text-white/80 font-label-lg transition-colors px-4 py-2 cursor-pointer">
                  เข้าสู่ระบบ
                </Link>
                <Link href="/register" className="bg-on-primary text-primary font-label-lg px-4 py-2 rounded-full hover:bg-inverse-primary transition-all shadow-sm cursor-pointer">
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar Menu */}
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
            <Link 
              href="/profile" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#e2efe0] text-[#1b3322] font-semibold text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
              <span>โปรไฟล์ของฉัน</span>
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>คำสั่งซื้อ</span>
            </Link>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="flex-grow flex flex-col gap-6">
          {/* Back button */}
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1b3322] transition-colors self-start">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>กลับสู่หน้าหลัก</span>
          </Link>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1b3322]">จัดการโปรไฟล์</h1>

          {/* Top Two Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 relative">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg text-[#1b3322]">ข้อมูลส่วนตัว</h2>
                <button className="text-sm font-semibold text-[#2e7d32] hover:underline cursor-pointer">แก้ไข</button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">ชื่อ-นามสกุล</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={user.name} 
                    className="w-full bg-[#f8faf6] border border-gray-100 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">เบอร์โทรศัพท์</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={user.phone || "-"} 
                    className="w-full bg-[#f8faf6] border border-gray-100 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Account Security Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 relative">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg text-[#1b3322]">ความปลอดภัยบัญชี</h2>
                <button className="text-sm font-semibold text-[#2e7d32] hover:underline cursor-pointer">แก้ไข</button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">ชื่อผู้ใช้ (Username)</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={user.username} 
                    className="w-full bg-[#f8faf6] border border-gray-100 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">อีเมล</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={user.email} 
                    className="w-full bg-[#f8faf6] border border-gray-100 rounded-lg py-2 px-3 text-sm text-[#1b3322] outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Address Book Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-[#1b3322]">สมุดที่อยู่</h2>
              <button className="flex items-center gap-1 bg-[#1b3322] hover:bg-[#122417] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>เพิ่มที่อยู่</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address item 1 */}
              <div className="border border-green-200/50 bg-[#fbfdfa] rounded-xl p-4 flex flex-col gap-2 relative">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-[#1b3322]">ที่อยู่จัดส่งฟาร์มหลัก</span>
                  <span className="bg-[#1b3322] text-white text-[10px] font-bold px-2 py-0.5 rounded">ค่าเริ่มต้น</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed min-h-[40px]">
                  123 หมู่ 4 ถนนมิตรภาพ ตำบลหนองสาหร่าย อำเภอปากช่อง นครราชสีมา 30130
                </p>
                <div className="flex gap-3 text-xs font-semibold mt-2 border-t border-gray-50 pt-2">
                  <button className="text-gray-400 hover:text-primary transition-colors cursor-pointer">แก้ไข</button>
                  <button className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">ลบ</button>
                </div>
              </div>

              {/* Address item 2 */}
              <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2 relative">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-[#1b3322]">ร้านค้าส่งในเมือง</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed min-h-[40px]">
                  456 ซอย 2 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110
                </p>
                <div className="flex justify-between items-center text-xs font-semibold mt-2 border-t border-gray-50 pt-2">
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-primary transition-colors cursor-pointer">แก้ไข</button>
                    <button className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">ลบ</button>
                  </div>
                  <button className="text-gray-400 hover:text-[#2e7d32] transition-colors cursor-pointer">ตั้งเป็นค่าเริ่มต้น</button>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="self-end border border-red-200 hover:border-red-300 text-red-500 hover:bg-red-50 font-medium py-2.5 px-6 rounded-full flex items-center gap-2 transition-colors cursor-pointer text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>ออกจากระบบ</span>
          </button>

        </section>

      </main>
    </div>
  );
}
