'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

function Combobox({ options, value, onChange, placeholder }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    setFilter(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  }, [onChange]);

  return (
    <div className="relative" ref={ref}>
      <input
        value={filter}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm pr-10"
      />
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-outline hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container-high"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
      </button>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setFilter(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-surface-container-low cursor-pointer ${
                opt === value ? 'bg-primary/10 text-primary font-medium' : 'text-on-surface'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const CATEGORY_OPTIONS = [
  { id: 1, name: 'ผักสด' },
  { id: 2, name: 'ผลไม้' },
];

export default function AddProductPage() {
  const router = useRouter();
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    category_id: '',
    description: '',
    original_price: '',
    stock_quantity: '0',
    expiry_date: '',
  });

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          const unique = [...new Set(result.data.map((p: { description: string }) => p.description).filter(Boolean))] as string[];
          setDescriptions(unique.sort());
        }
      })
      .catch(() => {});
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.category_id || !form.original_price || !form.description || !form.stock_quantity || !form.expiry_date) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category_id', form.category_id);
      formData.append('description', form.description);
      formData.append('original_price', form.original_price);
      formData.append('stock_quantity', form.stock_quantity || '0');
      formData.append('expiry_date', form.expiry_date);

      const fileInput = document.getElementById('product-image') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('image', fileInput.files[0]);
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error || 'เกิดข้อผิดพลาด');
        setSubmitting(false);
        return;
      }

      router.push('/admin/products');
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/20">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h2 className="text-base font-bold font-headline-md text-on-surface">ข้อมูลสินค้า</h2>
        </div>

        {error && (
          <div className="bg-error-container/30 text-error text-sm px-4 py-3 rounded-lg border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">รูปสินค้า</label>
          <div className="flex items-start gap-4">
            <div className="w-28 h-28 bg-surface-container rounded-xl border-2 border-dashed border-outline-variant/40 flex items-center justify-center overflow-hidden shrink-0">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-3xl text-outline/60">image</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high transition-all cursor-pointer text-center border border-outline-variant/30">
                <span>เลือกไฟล์รูป</span>
                <input
                  id="product-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-outline/70">รองรับ JPG, PNG, WebP • ขนาดไม่เกิน 5MB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">ชื่อสินค้า <span className="text-error">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="เช่น มะเขือเทศ (Tomato)"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">หมวดหมู่ <span className="text-error">*</span></label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none text-sm"
            >
              <option value="">เลือกหมวดหมู่</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Original Price */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">ราคาปกติ (บาท) <span className="text-error">*</span></label>
            <input
              type="number"
              min="0"
              value={form.original_price}
              onChange={(e) => setForm((p) => ({ ...p, original_price: e.target.value }))}
              placeholder="30"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">หน่วย <span className="text-error">*</span></label>
            <Combobox
              options={descriptions}
              value={form.description}
              onChange={(v) => setForm((p) => ({ ...p, description: v }))}
              placeholder="เลือกหน่วย หรือพิมพ์เพิ่มเอง"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">จำนวนสต็อก <span className="text-error">*</span></label>
            <input
              type="number"
              min="0"
              value={form.stock_quantity}
              onChange={(e) => setForm((p) => ({ ...p, stock_quantity: e.target.value }))}
              placeholder="0"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">วันหมดอายุ <span className="text-error">*</span></label>
            <input
              type="date"
              value={form.expiry_date}
              onChange={(e) => setForm((p) => ({ ...p, expiry_date: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 text-sm shadow-sm cursor-pointer"
          >
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> กำลังบันทึก...</>
            ) : (
              <><span className="material-symbols-outlined text-[18px]">check</span> บันทึกสินค้า</>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="border border-outline-variant/40 text-on-surface-variant px-6 py-3 rounded-lg font-medium hover:bg-surface-container-low transition-all text-sm cursor-pointer"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </form>
  );
}
