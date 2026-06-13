import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ProductRow {
  id: number;
  category_id: number;
  name: string;
  description: string;
  original_price: number;
  price: number;
  stock_quantity: number;
  image_url: string;
  is_best_seller: number;
  lot_in_date: string;
  expiry_date: string;
  category_name: string;
  main_type: string;
}

interface DbResult {
  insertId: number;
  affectedRows: number;
}

export async function GET() {
  try {
    const products = await query<ProductRow[]>(`
      SELECT 
        p.id,
        p.category_id,
        p.name,
        p.description,
        p.original_price,
        CASE
          WHEN DATEDIFF(p.expiry_date, CURDATE()) <= 3 THEN ROUND(p.original_price * 0.7)
          ELSE p.original_price
        END AS price,
        p.stock_quantity,
        p.image_url,
        p.is_best_seller,
        p.lot_in_date,
        p.expiry_date,
        c.name AS category_name,
        c.main_type
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.is_best_seller DESC, p.id ASC
    `);
    
    return NextResponse.json({ success: true, data: products || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'ไม่สามารถดึงข้อมูลสินค้าจากฐานข้อมูลได้', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category_id, description, original_price, promo_price, stock_quantity, image_url } = body;

    if (!name || !category_id || !original_price) {
      return NextResponse.json({ success: false, error: 'name, category_id, and original_price are required.' }, { status: 400 });
    }

    const result = await query<DbResult>(
      'INSERT INTO products (name, category_id, description, original_price, promo_price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category_id, description || null, original_price, promo_price || null, stock_quantity || 0, image_url || null]
    );

    return NextResponse.json({ success: true, data: { id: result.insertId, ...body } });
  } catch {
    return NextResponse.json({ success: false, error: 'ไม่สามารถเพิ่มสินค้าได้' }, { status: 500 });
  }
}
