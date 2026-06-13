import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export async function GET() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = getDaysInMonth(year, month);
  const thaiYear = year + 543;
  const monthLabel = THAI_MONTHS[month - 1];

  try {
    const [salesRows, bestSellers] = await Promise.all([
      query<any[]>(`
        SELECT
          DAY(o.created_at) AS day,
          c.main_type,
          SUM(od.quantity * od.price_per_unit) AS total
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE o.status = 'completed'
          AND YEAR(o.created_at) = ?
          AND MONTH(o.created_at) = ?
        GROUP BY DAY(o.created_at), c.main_type
        ORDER BY day
      `, [year, month]),
      query<any[]>(`
        SELECT
          p.name,
          c.main_type,
          SUM(od.quantity) AS total_quantity,
          SUM(od.quantity * od.price_per_unit) AS total_revenue
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE o.status = 'completed'
          AND YEAR(o.created_at) = ?
          AND MONTH(o.created_at) = ?
        GROUP BY p.id, p.name, c.main_type
        ORDER BY c.main_type, total_quantity DESC
      `, [year, month]),
    ]);

    const daily: Record<number, { day: number; vegetable: number; fruit: number }> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      daily[d] = { day: d, vegetable: 0, fruit: 0 };
    }

    for (const row of salesRows) {
      if (daily[row.day]) {
        daily[row.day][row.main_type as 'vegetable' | 'fruit'] = Math.round(Number(row.total));
      }
    }

    const vegTop = bestSellers
      .filter((r: any) => r.main_type === 'vegetable')
      .slice(0, 5)
      .map((r: any) => ({ name: r.name, total_quantity: Number(r.total_quantity), total_revenue: Number(r.total_revenue) }));

    const fruitTop = bestSellers
      .filter((r: any) => r.main_type === 'fruit')
      .slice(0, 5)
      .map((r: any) => ({ name: r.name, total_quantity: Number(r.total_quantity), total_revenue: Number(r.total_revenue) }));

    const data = Object.values(daily);
    return NextResponse.json({
      success: true,
      data,
      year: thaiYear,
      month,
      monthLabel,
      daysInMonth,
      bestSellers: { vegetables: vegTop, fruits: fruitTop },
    });
  } catch (error) {
    const emptyData = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, vegetable: 0, fruit: 0 }));
    return NextResponse.json({ success: true, data: emptyData, year: thaiYear, month, monthLabel, daysInMonth, source: 'empty', bestSellers: { vegetables: [], fruits: [] } });
  }
}
