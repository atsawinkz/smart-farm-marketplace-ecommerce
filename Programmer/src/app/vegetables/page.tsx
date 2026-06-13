'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  original_price: number;
  promo_price: number | null;
  price: string | number;
  stock_quantity: number;
  image_url: string;
  is_best_seller?: boolean;
  category_name?: string;
  main_type?: string;
}

export default function VegetablesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems, addToCart } = useCart();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // Load products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.data) {
          // Filter only vegetable products
          const vegetableOnly = data.data.filter((p: any) => p.main_type === 'vegetable');
          setProducts(vegetableOnly);
        }
      } catch (error) {
        console.error('Failed to load products from API:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Header scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate total item quantity in cart
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Toggle favorite list
  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Filter products based on search query
  const filteredProducts = products.filter((p) => {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
           (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const renderProductCard = (product: Product) => (
    <article key={product.id} className="flex flex-col group relative">
      {/* Card Container */}
      <div className="bg-surface-container-low rounded-xl aspect-square mb-stack-md relative overflow-hidden flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/30 transition-all duration-300 shadow-sm group-hover:shadow-md">
        {/* Tags */}
        {!!product.is_best_seller && (
          <span className="absolute top-3 left-3 bg-tertiary-container text-on-tertiary-container text-xs px-2 py-1 rounded-full font-label-md z-10 shadow-sm">
            ขายดี
          </span>
        )}
        {product.promo_price != null && (
          <span className="absolute top-3 right-3 bg-error text-on-error text-xs px-2 py-1 rounded-full font-label-md z-10 shadow-sm">
            ลดราคา
          </span>
        )}

        {/* Product Image */}
        <img
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
          src={product.image_url}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1 px-1">
        <span className="text-label-md text-outline font-label-md uppercase tracking-wider">
          {product.category_name || 'ผักสด'}
        </span>
        <h3 className="text-body-lg font-body-lg text-on-surface font-medium line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-body-sm text-on-surface-variant line-clamp-1 font-light" title={product.description}>
          {product.description || 'สดสะอาด คุณภาพออร์แกนิคแท้ 100%'}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-headline-md font-headline-md text-primary font-bold">
              ฿{typeof product.price === 'number' ? product.price.toFixed(0) : parseFloat(String(product.price)).toFixed(0)}
            </span>
            {product.promo_price != null && (
              <span className="text-body-sm text-outline line-through">
                ฿{product.original_price}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              if (!user) {
                router.push('/login');
                return;
              }
              addToCart(product);
            }}
            aria-label="เพิ่มลงตะกร้า"
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-surface-tint active:scale-95 hover:scale-105 transition-all shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-surface text-on-surface">
      {/* TopNavBar */}
      <header
        className={`sticky top-0 z-50 w-full bg-primary/95 dark:bg-primary-container/95 backdrop-blur-md transition-all duration-300 ${
          hasScrolled ? 'shadow-sm border-transparent' : 'border-b border-primary-container/20'
        }`}
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
            Smartket
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-gutter">
            <Link
              href="/"
              className="font-label-lg text-label-lg pb-1 transition-all duration-200 text-white/70 hover:text-white"
            >
              หน้าหลัก
            </Link>

            <Link
              href="/vegetables"
              className="font-label-lg text-label-lg pb-1 transition-all duration-200 text-white border-b-2 border-inverse-primary font-semibold"
            >
              ผักสด
            </Link>

            <Link
              href="/fruits"
              className="font-label-lg text-label-lg pb-1 transition-all duration-200 text-white/70 hover:text-white"
            >
              ผลไม้
            </Link>
          </nav>

          {/* Actions (Cart, Profile) */}
          <div className="flex items-center gap-stack-md">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <input
                className="bg-surface-container-low border border-outline-variant/50 text-on-surface rounded-full py-2 pl-4 pr-10 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 w-48 lg:w-64"
                placeholder="ค้นหาผักสด..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline">search</span>
            </div>

            {user && (
              <Link href="/cart" className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 flex items-center justify-center relative">
                <span className="material-symbols-outlined" data-icon="shopping_cart">
                  shopping_cart
                </span>
                {totalCartQuantity > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
                    {totalCartQuantity}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile / Registration Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
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

      <main className="flex-grow">
        {/* Main Content Area */}
        <div id="products-section" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-stack-lg">
          {/* Section Headers */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/30 pb-4">
            <div>
              <span className="text-label-lg text-outline uppercase tracking-wider font-semibold">
                ผักสดอินทรีย์
              </span>
              <h2 className="text-3xl font-headline-lg text-primary mt-1">
                ผักสดจากสวนออร์แกนิคทั้งหมด
              </h2>
              <p className="text-body-lg text-on-surface-variant mt-1">คัดสรรผักสดคุณภาพระดับพรีเมียม ปลอดสารเคมี 100% ส่งตรงจากฟาร์ม</p>
            </div>
          </div>

          {/* Search info text if search active */}
          {searchQuery && (
            <div className="flex items-center justify-between bg-surface-container-low p-3 px-4 rounded-xl border border-outline-variant/30">
              <span className="text-body-md text-on-surface-variant">
                ผลการค้นหาสำหรับ: <strong className="text-primary">"{searchQuery}"</strong> ({filteredProducts.length} รายการ)
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary hover:text-error transition-colors text-label-md font-semibold"
              >
                ล้างตัวค้นหา
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-gutter gap-y-stack-lg animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex flex-col">
                  <div className="bg-surface-container-low rounded-xl aspect-square mb-stack-md" />
                  <div className="h-4 bg-surface-container-low rounded w-1/3 mb-2" />
                  <div className="h-6 bg-surface-container-low rounded w-3/4 mb-2" />
                  <div className="h-8 bg-surface-container-low rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-low rounded-3xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
              <h3 className="text-xl font-headline-md text-on-surface-variant">ไม่พบรายการผักสดที่ระบุ</h3>
              <p className="text-body-md text-outline mt-1">กรุณาลองเปลี่ยนคำค้นหาใหม่อีกครั้ง</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-gutter gap-y-stack-lg">
              {filteredProducts.map((product) => renderProductCard(product))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-primary-container text-on-primary py-12 border-t border-outline-variant/20 mt-auto">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-headline-md font-headline-md font-bold text-on-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" data-weight="fill">
                eco
              </span>
              Smartket
            </Link>
            <p className="text-body-md text-on-primary/80 max-w-xs">
              ตลาดออนไลน์สำหรับคนรักสุขภาพ รวบรวมสินค้าเกษตรอินทรีย์คุณภาพสูงจากเกษตรกรไทย
            </p>
            <p className="text-label-md text-on-primary/60 mt-4">
              © 2024 Smartket. All rights reserved. Cultivating transparency.
            </p>
          </div>
          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-body-lg font-headline-md font-semibold">ลิงก์ด่วน</h3>
            <nav className="flex flex-col gap-2">
              {['About Us', 'Quick Links', 'Privacy Policy', 'Shipping Info'].map((link) => (
                <a key={link} className="text-body-md text-on-primary/80 hover:text-secondary-fixed transition-colors cursor-pointer w-fit">
                  {link}
                </a>
              ))}
            </nav>
          </div>
          {/* Social */}
          <div className="flex flex-col gap-4">
            <h3 className="text-body-lg font-headline-md font-semibold">ติดตามเรา (Follow Us)</h3>
            <div className="flex gap-4">
              {['share', 'photo_camera', 'mail'].map((icon) => (
                <a
                  key={icon}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-on-primary hover:bg-white/20 hover:text-secondary-fixed transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </a>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-label-md text-on-primary/80 mb-2">สมัครรับข่าวสารและโปรโมชั่นพิเศษ</p>
              <div className="flex max-w-sm rounded-lg overflow-hidden border border-white/20">
                <input
                  className="bg-white/10 border-none text-on-primary placeholder-on-primary/50 px-4 py-2 w-full focus:ring-0 outline-none"
                  placeholder="อีเมลของคุณ"
                  type="email"
                />
                <button className="bg-secondary text-on-secondary px-6 py-2 font-label-md hover:bg-surface-tint hover:text-on-primary transition-all">
                  สมัคร
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
