'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const PAYMENT_LABELS: Record<string, { label: string; icon: string; instructions: string }> = {
  promptpay: {
    label: 'พร้อมเพย์ (PromptPay)',
    icon: 'qr_code_scanner',
    instructions: 'รอการยืนยันการชำระเงินจากระบบ โดยทั่วไปใช้เวลาไม่เกิน 5 นาที',
  },
  bank_transfer: {
    label: 'โอนเงินผ่านธนาคาร',
    icon: 'account_balance',
    instructions: 'กรุณาแจ้งชำระเงินโดยแนบสลิปโอนเงินผ่านช่องทาง Line หรือ Facebook ของร้าน',
  },
  cod: {
    label: 'เก็บเงินปลายทาง',
    icon: 'payments',
    instructions: 'เตรียมเงินสดจำนวนตามยอดรวมสุทธิเมื่อพนักงานจัดส่งนำสินค้ามาส่ง',
  },
  credit_card: {
    label: 'บัตรเครดิต / เดบิต',
    icon: 'credit_card',
    instructions: 'การชำระเงินผ่านบัตรสำเร็จแล้ว',
  },
};

export default function OrderSuccessPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </React.Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const total = searchParams.get('total');
  const payment = searchParams.get('payment') || 'promptpay';

  const paymentInfo = PAYMENT_LABELS[payment] || PAYMENT_LABELS.promptpay;

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-surface text-on-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-md border-b border-primary-container/20">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto">
          <Link href="/" className="text-white font-headline-md font-bold flex items-center gap-2 group">
            <span className="material-symbols-outlined text-inverse-primary text-3xl group-hover:-rotate-12 transition-transform" data-weight="fill">eco</span>
            Smartket
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
        <div className="max-w-lg w-full bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant/20 shadow-sm text-center flex flex-col items-center gap-6">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary" data-weight="fill">check_circle</span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface font-headline-lg">สั่งซื้อสินค้าสำเร็จ!</h1>
            <p className="text-on-surface-variant mt-2">ขอบคุณสำหรับคำสั่งซื้อของคุณ</p>
          </div>

          {/* Order Number */}
          <div className="w-full bg-surface-container rounded-2xl p-5 border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant">หมายเลขคำสั่งซื้อ</p>
            <p className="text-2xl font-extrabold text-primary font-headline-lg mt-1 tracking-wider">#SF-{orderId}</p>
          </div>

          {/* Payment Method */}
          <div className="w-full flex items-center gap-3 p-4 bg-surface-container rounded-2xl border border-outline-variant/20">
            <span className="material-symbols-outlined text-2xl text-primary">{paymentInfo.icon}</span>
            <div className="text-left">
              <p className="font-bold text-on-surface text-sm">วิธีการชำระเงิน</p>
              <p className="text-sm text-outline">{paymentInfo.label}</p>
            </div>
          </div>

          {/* Amount */}
          <div className="w-full flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/20">
            <span className="font-bold text-on-surface">ยอดรวมสุทธิ</span>
            <span className="text-2xl font-extrabold text-primary font-headline-lg">{total} บาท</span>
          </div>

          {/* Instructions */}
          <div className="w-full bg-surface-container rounded-2xl p-5 border border-outline-variant/20 text-left">
            <h3 className="font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">info</span>
              คำแนะนำเพิ่มเติม
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {paymentInfo.instructions}
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed mt-2">
              เราจะจัดส่งสินค้าให้คุณภายใน 3-5 วันทำการ
            </p>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col gap-3 mt-2">
            <Link
              href="/"
              className="bg-primary text-on-primary w-full py-4 rounded-full font-bold text-center hover:bg-surface-tint transition-all font-label-lg"
            >
              กลับหน้าหลัก
            </Link>
            <Link
              href="/"
              className="text-on-surface-variant hover:text-primary transition-colors text-center font-label-lg font-semibold py-2"
            >
              เลือกซื้อสินค้าต่อ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
