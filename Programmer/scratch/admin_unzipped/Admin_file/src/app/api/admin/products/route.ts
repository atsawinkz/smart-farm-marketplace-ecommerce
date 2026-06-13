import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { query } from '@/lib/db';

interface ProductRow {
  id: number;
  category_id: number;
  name: string;
  description: string;
  original_price: number;
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
      SELECT p.*, c.name AS category_name, c.main_type
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    return NextResponse.json({ success: true, data: products || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'ไม่สามารถดึงข้อมูลสินค้าจากฐานข้อมูลได้', detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const category_id = parseInt(formData.get('category_id') as string, 10);
    const description = (formData.get('description') as string) || '';
    const original_price = parseInt(formData.get('original_price') as string, 10);
    const stock_quantity = parseInt(formData.get('stock_quantity') as string, 10);
    const is_best_seller = formData.get('is_best_seller') === 'on';
    const expiry_date = formData.get('expiry_date') as string;

    if (!name || !category_id || !original_price) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกชื่อสินค้า หมวดหมู่ และราคา' }, { status: 400 });
    }

    let image_url = '';
    const file = formData.get('image') as File | null;

    if (file && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, error: 'รองรับเฉพาะไฟล์ JPG, PNG, WebP เท่านั้น' }, { status: 400 });
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'ไฟล์รูปต้องมีขนาดไม่เกิน 5MB' }, { status: 400 });
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');

      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);

      image_url = `/images/products/${filename}`;
    }

    try {
      const result = await query<DbResult>(
        `INSERT INTO products (name, category_id, description, original_price, stock_quantity, image_url, is_best_seller, lot_in_date, expiry_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
        [name, category_id, description, original_price, stock_quantity || 0, image_url || null, is_best_seller ? 1 : 0, expiry_date || null]
      );

      return NextResponse.json({
        success: true,
        data: { id: result.insertId, name, category_id, description, original_price, stock_quantity, image_url, is_best_seller },
        message: 'เพิ่มสินค้าสำเร็จ'
      });
    } catch {
      return NextResponse.json({ success: false, error: 'ไม่สามารถบันทึกข้อมูลลงฐานข้อมูลได้' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการอัปโหลด' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();

    const id = parseInt(formData.get('id') as string, 10);
    const name = formData.get('name') as string;
    const category_id = parseInt(formData.get('category_id') as string, 10);
    const description = (formData.get('description') as string) || '';
    const original_price = parseInt(formData.get('original_price') as string, 10);
    const stock_quantity = parseInt(formData.get('stock_quantity') as string, 10);
    const is_best_seller = formData.get('is_best_seller') === 'on';
    const expiry_date = formData.get('expiry_date') as string;

    if (!id || !name || !category_id || !original_price) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    let image_url = '';
    const file = formData.get('image') as File | null;

    if (file && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, error: 'รองรับเฉพาะไฟล์ JPG, PNG, WebP เท่านั้น' }, { status: 400 });
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'ไฟล์รูปต้องมีขนาดไม่เกิน 5MB' }, { status: 400 });
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
      image_url = `/images/products/${filename}`;
    }

    try {
      if (image_url) {
        await query(
          `UPDATE products SET name=?, category_id=?, description=?, original_price=?, stock_quantity=?, image_url=?, is_best_seller=?, lot_in_date=CURDATE(), expiry_date=?
           WHERE id=?`,
          [name, category_id, description, original_price, stock_quantity || 0, image_url, is_best_seller ? 1 : 0, expiry_date || null, id]
        );
      } else {
        await query(
          `UPDATE products SET name=?, category_id=?, description=?, original_price=?, stock_quantity=?, is_best_seller=?, lot_in_date=CURDATE(), expiry_date=?
           WHERE id=?`,
          [name, category_id, description, original_price, stock_quantity || 0, is_best_seller ? 1 : 0, expiry_date || null, id]
        );
      }

      return NextResponse.json({ success: true, message: 'อัปเดตสินค้าสำเร็จ' });
    } catch {
      return NextResponse.json({ success: false, error: 'ไม่สามารถอัปเดตข้อมูลได้' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการอัปโหลด' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ไม่พบรหัสสินค้า' }, { status: 400 });
    }
    await query('DELETE FROM order_details WHERE product_id = ?', [id]);
    await query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'ลบสินค้าสำเร็จ' });
  } catch {
    return NextResponse.json({ success: false, error: 'ไม่สามารถลบสินค้าได้' }, { status: 500 });
  }
}
