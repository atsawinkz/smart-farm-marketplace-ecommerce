'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

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

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCheckedItems } = useCart();

  const PAYMENT_TIMEOUT = 3600;
  const [timeLeft, setTimeLeft] = React.useState(PAYMENT_TIMEOUT);
  const [isExpired, setIsExpired] = React.useState(false);

  React.useEffect(() => {
    if (isExpired) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExpired]);

  const refreshQR = () => {
    setTimeLeft(PAYMENT_TIMEOUT);
    setIsExpired(false);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [user, setUser] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [savingAddress, setSavingAddress] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState(false);
  const [addressForm, setAddressForm] = React.useState({
    address: '', subdistrict: '', district: '', province: '', postal_code: '', phone: ''
  });

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);
        setAddressForm({
          address: u.address || '',
          subdistrict: u.subdistrict || '',
          district: u.district || '',
          province: u.province || '',
          postal_code: u.postal_code || '',
          phone: u.phone || '',
        });
      } catch { /* ignore */ }
    }
  }, []);

  const checkedItems = cartItems.filter(item => item.checked);

  const itemsSubtotal = checkedItems.reduce((sum, item) => {
    const price = typeof item.product.price === 'number' ? item.product.price : parseFloat(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const shippingFee = itemsSubtotal > 0 ? 40 : 0;
  const netTotal = itemsSubtotal + shippingFee;

  const getProductDetails = (fullName: string) => {
    const match = fullName.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) return { name: match[1], unit: match[2] };
    return { name: fullName, unit: 'ชิ้น' };
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    setSavingAddress(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: addressForm.phone || user.phone,
          address: addressForm.address,
          subdistrict: addressForm.subdistrict,
          district: addressForm.district,
          province: addressForm.province,
          postal_code: addressForm.postal_code,
        }),
      });
      const result = await res.json();
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.data));
        setUser(result.data);
      }
    } catch { /* ignore */ }
    setSavingAddress(false);
    setEditingAddress(false);
  };

  const handleSubmitOrder = async () => {
    if (!user) { router.push('/login'); return; }

    const addr = editingAddress ? addressForm : user;
    if (!addr.address || !addr.district || !addr.province || !addr.phone) {
      setSubmitError('กรุณากรอกที่อยู่จัดส่งและเบอร์โทรศัพท์ให้ครบถ้วน');
      return;
    }

    if (editingAddress) {
      await handleSaveAddress();
    }

    setSubmitError('');
    setIsSubmitting(true);

    const fullAddress = `${addr.address}, ต.${addr.subdistrict} อ.${addr.district} จ.${addr.province} ${addr.postal_code}`;

    const items = checkedItems.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price_per_unit: typeof item.product.price === 'number' ? item.product.price : parseFloat(item.product.price),
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          items,
          total_price: netTotal,
          payment_method: 'promptpay',
          shipping_address: fullAddress,
          shipping_phone: addr.phone,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setSubmitError(result.error || 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
        setIsSubmitting(false);
        return;
      }

      clearCheckedItems();

      const orderData = result.data;
      const params = new URLSearchParams({
        id: orderData.id.toString(),
        total: netTotal.toString(),
        payment: 'promptpay',
      });
      router.push(`/order/success?${params.toString()}`);
    } catch {
      setSubmitError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองอีกครั้ง');
      setIsSubmitting(false);
    }
  };

  if (!checkedItems.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface text-on-surface p-8">
        <span className="material-symbols-outlined text-6xl text-outline">shopping_cart_off</span>
        <h1 className="text-2xl font-bold text-on-surface-variant">ไม่มีสินค้าที่เลือกไว้</h1>
        <p className="text-outline">กรุณาเลือกสินค้าจากตะกร้าก่อนดำเนินการสั่งซื้อ</p>
        <Link href="/cart" className="bg-primary text-on-primary px-6 py-2.5 rounded-full hover:bg-surface-tint transition-all">กลับไปยังตะกร้าสินค้า</Link>
      </div>
    );
  }

  const addr = editingAddress ? addressForm : (user || addressForm);

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-surface text-on-surface">
      <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-md border-b border-primary-container/20">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto">
          <Link href="/" className="text-white font-headline-md font-bold flex items-center gap-2 group">
            <span className="material-symbols-outlined text-inverse-primary text-3xl group-hover:-rotate-12 transition-transform" data-weight="fill">eco</span>
            Smart Farm Marketplace
          </Link>
          <span className="text-white/80 font-label-lg">ชำระเงิน</span>
        </div>
      </header>

      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <Link href="/cart" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-surface-tint transition-colors mb-6 w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>กลับไปยังตะกร้าสินค้า</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-3/5 flex flex-col gap-8">
            {/* Shipping Address */}
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold">1</span>
                  <h2 className="text-xl font-bold text-primary font-headline-lg">ที่อยู่จัดส่ง</h2>
                </div>
                {!editingAddress ? (
                  <button onClick={() => setEditingAddress(true)} className="text-sm font-semibold text-primary hover:text-surface-tint transition-colors cursor-pointer">แก้ไข</button>
                ) : (
                  <button onClick={() => { setEditingAddress(false); if (user) setAddressForm({ address: user.address||'', subdistrict: user.subdistrict||'', district: user.district||'', province: user.province||'', postal_code: user.postal_code||'', phone: user.phone||'' }); }} className="text-sm font-semibold text-outline hover:text-primary transition-colors cursor-pointer">ยกเลิก</button>
                )}
              </div>

              {!editingAddress && user?.address ? (
                <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/20">
                  <p className="text-sm text-on-surface font-medium leading-relaxed">
                    {user.address}
                    {user.subdistrict && ` ต.${user.subdistrict}`}
                    {user.district && ` อ.${user.district}`}
                    {user.province && ` จ.${user.province}`}
                    {user.postal_code && ` ${user.postal_code}`}
                  </p>
                  {user.phone && <p className="text-sm text-outline mt-2">โทร: {user.phone}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">ที่อยู่ *</label>
                    <textarea value={addr.address} onChange={e => setAddressForm(p => ({ ...p, address: e.target.value }))}
                      placeholder="บ้านเลขที่, หมู่บ้าน, ถนน"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">ตำบล / แขวง</label>
                    <input value={addr.subdistrict} onChange={e => setAddressForm(p => ({ ...p, subdistrict: e.target.value }))}
                      placeholder="ตำบล"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">อำเภอ / เขต *</label>
                    <input value={addr.district} onChange={e => setAddressForm(p => ({ ...p, district: e.target.value }))}
                      placeholder="อำเภอ"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">จังหวัด *</label>
                    <select value={addr.province} onChange={e => setAddressForm(p => ({ ...p, province: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none">
                      <option value="">เลือกจังหวัด</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">รหัสไปรษณีย์</label>
                    <input value={addr.postal_code} onChange={e => setAddressForm(p => ({ ...p, postal_code: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                      placeholder="รหัสไปรษณีย์" maxLength={5}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">เบอร์โทรศัพท์ *</label>
                    <input value={addr.phone} onChange={e => setAddressForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="เบอร์โทรศัพท์สำหรับติดต่อจัดส่ง"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  </div>
                  {editingAddress && (
                    <div className="md:col-span-2 flex gap-3">
                      <button onClick={() => { setEditingAddress(false); if (user) setAddressForm({ address: user.address||'', subdistrict: user.subdistrict||'', district: user.district||'', province: user.province||'', postal_code: user.postal_code||'', phone: user.phone||'' }); }}
                        className="flex-1 border border-outline-variant/40 text-on-surface-variant py-3 rounded-full font-semibold hover:bg-surface-container-low transition-all cursor-pointer">ยกเลิก</button>
                      <button onClick={handleSaveAddress} disabled={savingAddress || !addr.address || !addr.district || !addr.province}
                        className="flex-1 bg-primary text-on-primary py-3 rounded-full font-semibold hover:bg-surface-tint transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer">
                        {savingAddress ? 'กำลังบันทึก...' : 'บันทึกที่อยู่'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method - PromptPay Only */}
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold">2</span>
                <h2 className="text-xl font-bold text-primary font-headline-lg">วิธีการชำระเงิน</h2>
              </div>

              <div className="bg-primary/5 border-2 border-primary rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">qr_code_scanner</span>
                  <div>
                    <p className="font-bold text-on-surface text-lg">พร้อมเพย์ (PromptPay)</p>
                    <p className="text-sm text-outline">สแกน QR Code เพื่อชำระเงิน</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-white rounded-2xl p-3 shadow-sm flex items-center justify-center border border-outline-variant/20 overflow-hidden">
                    <img src={`https://promptpay.io/0948713358/${netTotal}.png`} alt="PromptPay QR Code" className="w-full h-full object-contain" />
                  </div>

                  {isExpired ? (
                    <div className="mt-4">
                      <p className="text-error font-semibold">QR Code หมดอายุแล้ว</p>
                      <button onClick={refreshQR} className="mt-2 text-sm font-semibold text-primary hover:text-surface-tint underline cursor-pointer">สร้าง QR ใหม่</button>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">timer</span>
                      <span className="font-mono font-bold text-on-surface text-lg tracking-wider">{formatTime(timeLeft)}</span>
                      <span className="text-sm text-outline">น.</span>
                    </div>
                  )}

                  <p className="mt-2 font-semibold text-on-surface">ยอดชำระ {Math.round(netTotal)} บาท</p>
                  <p className="text-sm text-outline mt-1">โอนเข้าหมายเลขโทรศัพท์ 094-871-3358</p>
                  <p className="text-sm text-outline mt-1">หลังจากชำระเงินแล้ว กด "ยืนยันคำสั่งซื้อ" เพื่อดำเนินการ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-24">
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/20 shadow-sm flex flex-col gap-5">
              <h2 className="text-xl font-bold text-primary font-headline-lg border-b border-outline-variant/30 pb-4">สรุปคำสั่งซื้อ</h2>

              <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
                {checkedItems.map(item => {
                  const details = getProductDetails(item.product.name);
                  const price = typeof item.product.price === 'number' ? item.product.price : parseFloat(item.product.price);
                  return (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img src={item.product.image_url} alt={details.name} className="w-14 h-14 rounded-xl object-contain bg-surface-container border border-outline-variant/10" />
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{details.name}</p>
                        <p className="text-xs text-outline">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-primary">{Math.round(price * item.quantity)} บาท</p>
                    </div>
                  );
                })}
              </div>

              <hr className="border-outline-variant/30" />

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>ยอดรวมสินค้า</span>
                  <span className="font-semibold text-on-surface">{Math.round(itemsSubtotal)} บาท</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>ค่าจัดส่ง</span>
                  <span className="font-semibold text-on-surface">{shippingFee > 0 ? `${Math.round(shippingFee)} บาท` : 'ฟรี'}</span>
                </div>
              </div>

              <hr className="border-outline-variant/30" />

              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-on-surface font-body-lg">ยอดรวมสุทธิ</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-primary font-headline-lg">{Math.round(netTotal)}</span>
                  <span className="text-sm font-bold text-primary ml-1">บาท</span>
                </div>
              </div>

              {submitError && <p className="text-error text-sm font-semibold bg-error-container/30 px-4 py-2 rounded-xl">{submitError}</p>}

              <button onClick={handleSubmitOrder} disabled={isSubmitting || isExpired}
                className="bg-primary hover:bg-surface-tint text-on-primary w-full py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-label-lg">
                {isSubmitting ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> ดำเนินการ...</>
                ) : (
                  <>ยืนยันคำสั่งซื้อ <span className="material-symbols-outlined text-[18px]">lock</span></>
                )}
              </button>

              <p className="text-[12px] text-outline text-center">การชำระเงินของคุณปลอดภัยด้วยการเข้ารหัส SSL</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
