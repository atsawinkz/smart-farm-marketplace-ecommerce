import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface OrderRow {
  id: number;
  user_id: number;
  total_price: string;
  status: string;
  created_at: string;
  user_name: string;
  user_address: string;
  user_phone: string;
}

interface OrderDetailRow {
  id: number;
  product_id: number;
  quantity: number;
  price_per_unit: string;
  product_name: string;
  image_url: string;
}

const DB_STATUS_MAP: Record<string, string> = {
  pending: 'pending',
  paid: 'pending',
  accepted: 'shipped',
  shipping: 'shipped',
  delivered: 'completed',
  completed: 'completed',
  cancelled: 'cancelled',
};

export async function GET() {
  try {
    const orders = await query<OrderRow[]>(`
      SELECT o.id, o.user_id, o.total_price, o.status, o.created_at,
             u.name AS user_name,
             TRIM(CONCAT(
               COALESCE(u.address, ''),
               IF(u.subdistrict IS NOT NULL AND u.subdistrict != '', CONCAT(' ต.', u.subdistrict), ''),
               IF(u.district IS NOT NULL AND u.district != '', CONCAT(' อ.', u.district), ''),
               IF(u.province IS NOT NULL AND u.province != '', CONCAT(' จ.', u.province), ''),
               IF(u.postal_code IS NOT NULL AND u.postal_code != '', CONCAT(' ', u.postal_code), '')
             )) AS user_address,
             u.phone AS user_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    for (const order of orders) {
      const details = await query<OrderDetailRow[]>(
        `SELECT od.id, od.product_id, od.quantity, od.price_per_unit, p.name AS product_name, p.image_url
         FROM order_details od
         LEFT JOIN products p ON od.product_id = p.id
         WHERE od.order_id = ?`,
        [order.id]
      );
      (order as any).items = details;
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'ไม่สามารถดึงข้อมูลออเดอร์จากฐานข้อมูลได้', detail: String(error) }, { status: 500 });
  }
}

const ADMIN_ALLOWED = ['pending', 'shipped'];

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุ id และสถานะ' }, { status: 400 });
    }
    if (!ADMIN_ALLOWED.includes(status)) {
      return NextResponse.json({ success: false, error: 'ไม่สามารถเปลี่ยนสถานะนี้ได้' }, { status: 400 });
    }
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ success: true, message: 'อัปเดตสถานะสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'ไม่สามารถอัปเดตสถานะออเดอร์ได้', detail: String(error) }, { status: 500 });
  }
}
