'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

export default function CartPage() {
  const {
    cartItems,
    cartLoading,
    removeFromCart,
    updateQuantity,
    toggleCheck,
  } = useCart();

  // Parse product name and unit (e.g. "แครอทออร์แกนิค (500g)" -> name: "แครอทออร์แกนิค", unit: "500g")
  const getProductDetails = (fullName: string) => {
    const match = fullName.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      return { name: match[1], unit: match[2] };
    }
    return { name: fullName, unit: 'ชิ้น' };
  };

  // Calculations
  const checkedItems = cartItems.filter((item) => item.checked);
  
  // Total unique checked products
  const checkedItemsCount = checkedItems.length;

  // Subtotal for checked items
  const itemsSubtotal = checkedItems.reduce((sum, item) => {
    const price = typeof item.product.price === 'number'
      ? item.product.price
      : parseFloat(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  // Flat shipping fee
  const shippingFee = itemsSubtotal > 0 ? 40 : 0;

  // Net total
  const netTotal = itemsSubtotal + shippingFee;

  // Total quantity for the header cart badge
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const router = useRouter();

  // Load user from localStorage
  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // Checkout action
  const handleCheckout = () => {
    if (checkedItemsCount === 0) {
      alert('กรุณาเลือกสินค้าอย่างน้อย 1 รายการเพื่อสั่งซื้อ');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-surface text-on-surface">
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
            Smartket
          </Link>


          {/* Actions (Cart, Profile) */}
          <div className="flex items-center gap-stack-md">

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

      {/* Main Cart Content */}
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
        {/* Back button */}
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-surface-tint transition-colors mb-6 self-start w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>กลับสู่หน้าหลัก</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-headline-lg font-bold text-primary">
                ตะกร้าสินค้าขายส่ง
              </h1>
              <p className="text-body-lg text-on-surface-variant mt-1 font-light">
                ทบทวนรายการสินค้าและดำเนินการสั่งซื้อแบบขายส่ง
              </p>
            </div>

            {cartLoading ? (
              /* Loading skeleton while fetching cart from DB */
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="flex items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 animate-pulse"
                  >
                    <div className="w-5 h-5 rounded bg-surface-container-low flex-shrink-0" />
                    <div className="w-24 h-24 bg-surface-container-low rounded-xl flex-shrink-0" />
                    <div className="flex-grow flex flex-col gap-2">
                      <div className="h-5 bg-surface-container-low rounded w-2/3" />
                      <div className="h-4 bg-surface-container-low rounded w-1/3" />
                      <div className="h-4 bg-surface-container-low rounded w-1/4" />
                    </div>
                    <div className="w-28 h-10 bg-surface-container-low rounded-full" />
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant/20 shadow-sm flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-outline text-6xl">
                  shopping_cart_off
                </span>
                <h3 className="text-xl font-headline-md text-on-surface-variant font-medium">
                  ไม่มีสินค้าในตะกร้าของคุณ
                </h3>
                <p className="text-body-md text-outline max-w-sm">
                  คุณยังไม่ได้เลือกสินค้าใด ๆ ใส่ตะกร้า กรุณากลับไปเลือกชมสินค้าจากหน้าแรก
                </p>
                <Link
                  href="/"
                  className="bg-primary text-on-primary font-label-md px-6 py-2.5 rounded-full hover:bg-surface-tint transition-all shadow-sm cursor-pointer mt-2"
                >
                  เลือกซื้อสินค้าต่อ
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => {
                  const details = getProductDetails(item.product.name);
                  const price = typeof item.product.price === 'number'
                    ? item.product.price
                    : parseFloat(item.product.price);
                  const itemSubtotal = price * item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      {/* Checkbox Selector */}
                      <label className="flex items-center justify-center cursor-pointer p-1">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleCheck(item.product.id)}
                          className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer transition-colors"
                        />
                      </label>

                      {/* Product Image */}
                      <div className="w-24 h-24 bg-surface-container-low rounded-xl p-2 flex items-center justify-center border border-outline-variant/10 overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image_url}
                          alt={details.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-on-surface truncate font-body-lg">
                            {details.name}
                          </h3>
                          <p className="text-body-md text-on-surface-variant font-light mt-0.5">
                            {details.unit}
                          </p>
                          <p className="text-body-sm text-outline font-light mt-1">
                            {Math.round(price)} บาท / ชิ้น
                          </p>
                        </div>

                        {/* Quantity Adjuster & Total Price */}
                        <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 flex-shrink-0">
                          {/* Quantity Counter */}
                          <div className="flex items-center bg-surface-container border border-outline-variant/30 rounded-full p-1 min-w-[100px] justify-between">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
                              aria-label="Decrease quantity"
                            >
                              <span className="material-symbols-outlined text-[18px]">remove</span>
                            </button>
                            <span className="font-semibold text-on-surface w-6 text-center select-none font-body-lg text-body-md">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
                              aria-label="Increase quantity"
                              title={item.quantity >= item.product.stock_quantity ? `สินค้าคงเหลือ ${item.product.stock_quantity} ชิ้น` : ''}
                            >
                              <span className="material-symbols-outlined text-[18px]">add</span>
                            </button>
                          </div>


                          {/* Item Subtotal */}
                          <div className="text-right min-w-[80px]">
                            <span className="text-lg font-bold text-primary font-body-lg">
                              {Math.round(itemSubtotal)} บาท
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-outline hover:text-error transition-colors p-2 rounded-full hover:bg-error-container/20 flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="w-full lg:w-1/3 bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col gap-6 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold text-primary font-headline-lg border-b border-outline-variant/30 pb-4">
              สรุปคำสั่งซื้อ
            </h2>

            <div className="flex flex-col gap-3 font-label-md text-label-md">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>ยอดรวมสินค้า ({checkedItemsCount} รายการ)</span>
                <span className="font-semibold text-on-surface">{Math.round(itemsSubtotal)} บาท</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>ค่าจัดส่ง</span>
                <span className="font-semibold text-on-surface">
                  {shippingFee > 0 ? `${Math.round(shippingFee)} บาท` : 'ฟรี'}
                </span>
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-on-surface font-body-lg">ยอดรวมสุทธิ</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-primary font-headline-lg">
                    {Math.round(netTotal)} บาท
                  </span>
                </div>
              </div>
              <p className="text-right text-[12px] text-outline mt-0.5">
                รวมภาษีมูลค่าเพิ่มแล้ว
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkedItemsCount === 0}
              className="bg-primary hover:bg-surface-tint text-on-primary w-full py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none font-label-lg"
            >
              สั่งซื้อสินค้า
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <Link
              href="/"
              className="text-on-surface-variant hover:text-primary transition-colors text-center text-label-lg font-semibold py-1 block cursor-pointer"
            >
              เลือกซื้อสินค้าต่อ
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
