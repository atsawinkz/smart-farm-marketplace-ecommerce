"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

interface OrderItem {
  id: string;
  date: string;
  status: "completed" | "preparing" | "pending" | "cancelled";
  itemsSummary: string;
  totalItems: number;
  totalAmount: number;
  icon: string;
}

const MOCK_ORDERS: OrderItem[] = [
  {
    id: "SK-2024-042",
    date: "Oct 24, 2024",
    status: "completed",
    itemsSummary: "Organic Carrot 10kg, Broccoli 5kg, and 3 more items",
    totalItems: 5,
    totalAmount: 2450,
    icon: "shopping_bag"
  },
  {
    id: "SK-2024-045",
    date: "Oct 28, 2024",
    status: "preparing",
    itemsSummary: "Heirloom Tomatoes 20kg",
    totalItems: 1,
    totalAmount: 1800,
    icon: "eco"
  }
];

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { cartItems } = useCart();
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user session:", err);
      }
    }
  }, []);

  // Filter orders based on active tab
  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending_payment") return order.status === "pending";
    if (activeTab === "to_ship") return order.status === "preparing";
    if (activeTab === "completed") return order.status === "completed";
    if (activeTab === "cancelled") return order.status === "cancelled";
    return true;
  });

  // Calculate To Ship badge count
  const toShipCount = MOCK_ORDERS.filter((order) => order.status === "preparing").length;

  return (
    <div className="bg-[#f8faf6] text-[#1b3322] min-h-screen flex flex-col font-body-md">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 w-full bg-primary/95 dark:bg-primary-container/95 backdrop-blur-md transition-all duration-300 border-b border-primary-container/20">
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
              <span className="material-symbols-outlined text-[26px]">agriculture</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-[#1b3322] truncate">{user ? user.name : "Somchai Farm"}</span>
              <span className="text-xs text-gray-400 truncate">{user ? user.email : "somchai@example.com"}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col gap-1">
            <Link 
              href="/profile" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
              <span>โปรไฟล์ของฉัน</span>
            </Link>
            <Link 
              href="/orders" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1b3322] text-white font-semibold text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>คำสั่งซื้อ</span>
            </Link>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="flex-grow flex flex-col gap-6">


          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1b3322] font-headline-lg">คำสั่งซื้อของฉัน</h1>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex gap-6 overflow-x-auto pb-px">
              {[
                { id: "all", label: "All" },
                { id: "pending_payment", label: "Pending Payment" },
                { id: "to_ship", label: "To Ship", badge: toShipCount },
                { id: "completed", label: "Completed" },
                { id: "cancelled", label: "Cancelled" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all relative flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "border-[#1b3322] text-[#1b3322] font-semibold"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="w-5 h-5 bg-[#bf5f2b] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards List */}
          <div className="flex flex-col gap-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-gray-300 text-6xl">
                  shopping_bag
                </span>
                <h3 className="text-lg font-semibold text-gray-500">
                  ไม่มีรายการคำสั่งซื้อในหมวดหมู่นี้
                </h3>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4"
                >
                  {/* Card Header Info */}
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#1b3322]">Order #{order.id}</span>
                      <span className="text-xs text-gray-400">Placed on {order.date}</span>
                    </div>

                    {/* Status Badge */}
                    {order.status === "completed" && (
                      <span className="flex items-center gap-1 bg-[#e2efe0] text-[#2e7d32] text-xs font-semibold px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Completed
                      </span>
                    )}
                    {order.status === "preparing" && (
                      <span className="flex items-center gap-1 bg-[#fbf3db] text-[#bf5f2b] text-xs font-semibold px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                        Preparing to Ship
                      </span>
                    )}
                  </div>

                  <hr className="border-gray-50" />

                  {/* Card Body Info */}
                  <div className="flex items-center gap-4 justify-between flex-wrap md:flex-nowrap">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                        <span className="material-symbols-outlined text-[28px]">{order.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-[#1b3322] truncate" title={order.itemsSummary}>
                          {order.itemsSummary}
                        </span>
                        <span className="text-xs text-gray-400">{order.totalItems} items total</span>
                      </div>
                    </div>

                    <div className="flex flex-col text-right shrink-0">
                      <span className="text-xs text-gray-400">Total Amount</span>
                      <span className="text-xl font-bold text-[#1b3322] font-headline-md">
                        {order.totalAmount.toLocaleString()} บาท
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex justify-end gap-3 mt-2">
                    <button className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold py-2 px-5 rounded-full text-xs transition-colors">
                      Order Details
                    </button>
                    {order.status === "completed" && (
                      <button className="bg-[#1b3322] hover:bg-[#122417] text-white font-semibold py-2 px-6 rounded-full text-xs transition-colors">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button 
                onClick={() => setCurrentPage(1)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                disabled={currentPage === 1}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              
              <button 
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                  currentPage === 1
                    ? "bg-[#1b3322] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                1
              </button>

              <button 
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                  currentPage === 2
                    ? "bg-[#1b3322] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                2
              </button>

              <button 
                onClick={() => setCurrentPage(2)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                disabled={currentPage === 2}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-primary-container text-on-primary py-12 border-t border-outline-variant/20 mt-auto">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-bold text-lg text-white">Smartket</span>
            <span className="text-xs text-white/60">
              © 2024 Smartket Wholesale Produce. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-xs text-white/80">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Wholesale FAQ</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
