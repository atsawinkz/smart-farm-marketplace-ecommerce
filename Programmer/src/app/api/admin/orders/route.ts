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

export async function GET() {
  try {
    const orders = await query<OrderRow[]>(`
      SELECT o.order_id AS id, o.user_id, o.total_price, o.status, o.created_at,
             o.shipping_recipient_name AS user_name,
             TRIM(CONCAT(
               COALESCE(o.shipping_address, ''),
               IF(o.shipping_subdistrict IS NOT NULL AND o.shipping_subdistrict != '', CONCAT(' ต.', o.shipping_subdistrict), ''),
               IF(o.shipping_district IS NOT NULL AND o.shipping_district != '', CONCAT(' อ.', o.shipping_district), ''),
               IF(o.shipping_province IS NOT NULL AND o.shipping_province != '', CONCAT(' จ.', o.shipping_province), ''),
               IF(o.shipping_postal_code IS NOT NULL AND o.shipping_postal_code != '', CONCAT(' ', o.shipping_postal_code), '')
             )) AS user_address,
             o.shipping_recipient_phone AS user_phone
      FROM orders o
      ORDER BY o.created_at DESC
    `);

    for (const order of orders) {
      const details = await query<OrderDetailRow[]>(
        `SELECT od.order_detail_id AS id, od.product_id, od.quantity, od.price_per_unit, p.name AS product_name, p.image_url
         FROM order_details od
         LEFT JOIN products p ON od.product_id = p.product_id
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
    await query('UPDATE orders SET status = ? WHERE order_id = ?', [status, id]);
    return NextResponse.json({ success: true, message: 'อัปเดตสถานะสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'ไม่สามารถอัปเดตสถานะออเดอร์ได้', detail: String(error) }, { status: 500 });
  }
}
