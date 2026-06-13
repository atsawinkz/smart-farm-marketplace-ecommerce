'use client';

import React, { useState, useEffect } from 'react';

interface DayData {
  day: number;
  vegetable: number;
  fruit: number;
}

interface BestSellerItem {
  name: string;
  total_quantity: number;
  total_revenue: number;
}

interface BestSellers {
  vegetables: BestSellerItem[];
  fruits: BestSellerItem[];
}

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

export default function AdminDashboard() {
  const [data, setData] = useState<DayData[]>([]);
  const [month, setMonth] = useState(6);
  const [monthLabel, setMonthLabel] = useState('มิถุนายน');
  const [year, setYear] = useState(2569);
  const [daysInMonth, setDaysInMonth] = useState(30);
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState<BestSellers>({ vegetables: [], fruits: [] });

  useEffect(() => {
    fetch('/api/admin/sales-volume')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setYear(res.year);
          setMonth(res.month);
          setMonthLabel(res.monthLabel);
          setDaysInMonth(res.daysInMonth);
          if (res.bestSellers) setBestSellers(res.bestSellers);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalVeg = data.reduce((s, d) => s + d.vegetable, 0);
  const totalFruit = data.reduce((s, d) => s + d.fruit, 0);
  const grandTotal = totalVeg + totalFruit;

  const maxVal = Math.max(...data.map((d) => Math.max(d.vegetable, d.fruit)), 0);
  const yMax = maxVal === 0 ? 5000 : Math.ceil(maxVal * 1.15);

  const PAD_L = 60, PAD_R = 20, PAD_T = 20, PAD_B = 30;
  const chartW = 1100 - PAD_L - PAD_R;
  const chartH = 300 - PAD_T - PAD_B;
  const n = data.length;
  const toX = (i: number) => PAD_L + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
  const toY = (val: number) => PAD_T + chartH - (val / yMax) * chartH;

  const vegPoints = data.map((d, i) => `${toX(i)},${toY(d.vegetable)}`).join(' ');
  const fruitPoints = data.map((d, i) => `${toX(i)},${toY(d.fruit)}`).join(' ');

  const formatBaht = (n: number) => {
    if (n >= 1000000) return `฿${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `฿${(n / 1000).toFixed(1)}K`;
    return `฿${n}`;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(price);

  const xLabels: number[] = [];
  const step = Math.max(1, Math.floor(daysInMonth / 10));
  for (let d = 1; d <= daysInMonth; d += step) {
    xLabels.push(d);
  }
  if (xLabels[xLabels.length - 1] !== daysInMonth) xLabels.push(daysInMonth);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
          <p className="text-xs text-on-surface-variant font-medium">ยอดขายผักรวม</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{formatPrice(totalVeg)}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
          <p className="text-xs text-on-surface-variant font-medium">ยอดขายผลไม้รวม</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{formatPrice(totalFruit)}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
          <p className="text-xs text-on-surface-variant font-medium">ยอดขายรวมทั้งหมด</p>
          <p className="text-2xl font-bold text-primary mt-1">{formatPrice(grandTotal)}</p>
        </div>
      </div>

      {/* Chart */}
      <div>
        <h2 className="text-xl font-bold font-headline-lg text-primary">ยอดขายต่อเดือน</h2>
        <p className="text-sm text-on-surface-variant/80 mt-1">ยอดขายแยกตามประเภทสินค้า ({daysInMonth} วัน)</p>
      </div>

      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-lg border border-outline-variant">
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-sm text-on-surface font-medium">ผัก</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-600" />
            <span className="text-sm text-on-surface font-medium">ผลไม้</span>
          </div>
          {maxVal === 0 && (
            <span className="text-xs text-on-surface-variant/60 ml-auto">ยังไม่มีข้อมูลการขายในเดือนนี้</span>
          )}
        </div>

        <div className="relative" style={{ height: 300 }}>
          <svg className="w-full h-full" viewBox="0 0 1100 300" preserveAspectRatio="none">
            {yTicks.map((r) => {
              const y = PAD_T + chartH - r * chartH;
              return (
                <g key={r}>
                  <line x1={PAD_L} y1={y} x2={1100 - PAD_R} y2={y} stroke="#e1e3df" strokeWidth="1" />
                  <text x={PAD_L - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#73796f">
                    {formatBaht(Math.round(yMax * r))}
                  </text>
                </g>
              );
            })}

            {maxVal > 0 && (
              <>
                <polyline points={vegPoints} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={fruitPoints} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {data.map((d, i) => d.vegetable > 0 && (
                  <g key={`veg-${i}`}>
                    <circle cx={toX(i)} cy={toY(d.vegetable)} r="3.5" fill="#16a34a" stroke="#fff" strokeWidth="1.5" />
                    <title>{`ผัก วันที่ ${d.day}: ฿${d.vegetable.toLocaleString('th-TH')}`}</title>
                  </g>
                ))}
                {data.map((d, i) => d.fruit > 0 && (
                  <g key={`fruit-${i}`}>
                    <circle cx={toX(i)} cy={toY(d.fruit)} r="3.5" fill="#d97706" stroke="#fff" strokeWidth="1.5" />
                    <title>{`ผลไม้ วันที่ ${d.day}: ฿${d.fruit.toLocaleString('th-TH')}`}</title>
                  </g>
                ))}
              </>
            )}
          </svg>

          <div className="flex justify-between mt-1" style={{ paddingLeft: PAD_L, paddingRight: PAD_R }}>
            {xLabels.map((d) => (
              <span key={d} className="text-[10px] text-outline text-center">{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
            <h2 className="font-bold font-headline-md text-primary text-sm">ผักขายดี TOP 5</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="px-6 py-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">อันดับ</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">สินค้า</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">จำนวนที่ขายได้</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">ยอดรวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {bestSellers.vegetables.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant text-sm">ยังไม่มีข้อมูล</td>
                  </tr>
                ) : bestSellers.vegetables.map((item, idx) => (
                  <tr key={item.name} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        idx === 0 ? 'bg-amber-100 text-amber-800' :
                        idx === 1 ? 'bg-gray-100 text-gray-600' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-surface-container-high text-on-surface-variant'
                      }`}>{idx + 1}</span>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium text-on-surface">{item.name}</td>
                    <td className="px-6 py-3.5 text-sm text-right text-on-surface-variant">{item.total_quantity}</td>
                    <td className="px-6 py-3.5 text-sm font-bold text-primary text-right">{formatPrice(item.total_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <h2 className="font-bold font-headline-md text-primary text-sm">ผลไม้ขายดี TOP 5</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="px-6 py-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">อันดับ</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">สินค้า</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">จำนวนที่ขายได้</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">ยอดรวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {bestSellers.fruits.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant text-sm">ยังไม่มีข้อมูล</td>
                  </tr>
                ) : bestSellers.fruits.map((item, idx) => (
                  <tr key={item.name} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        idx === 0 ? 'bg-amber-100 text-amber-800' :
                        idx === 1 ? 'bg-gray-100 text-gray-600' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-surface-container-high text-on-surface-variant'
                      }`}>{idx + 1}</span>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium text-on-surface">{item.name}</td>
                    <td className="px-6 py-3.5 text-sm text-right text-on-surface-variant">{item.total_quantity}</td>
                    <td className="px-6 py-3.5 text-sm font-bold text-primary text-right">{formatPrice(item.total_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
