import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const products = await query<any[]>(`
      SELECT 
        p.product_id AS id,
        p.category_id,
        p.name,
        p.description,
        p.original_price,
        NULL AS promo_price,
        p.original_price AS price,
        p.stock_quantity,
        p.image_url,
        (CASE WHEN p.total_sale > 5 THEN TRUE ELSE FALSE END) AS is_best_seller,
        p.total_sale,
        p.lot_in_date,
        p.expiry_date,
        c.name AS category_name,
        c.main_type
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.product_id DESC
    `);
    if (products && products.length > 0) {
      return NextResponse.json({ success: true, data: products });
    }
  } catch {}

  const fallback = [
    { id: 1, category_id: 5, name: 'แครอต (Carrot)', original_price: 30, promo_price: null, stock_quantity: 91, image_url: '/images/products/แครอต.jpg', is_best_seller: true, category_name: 'ผักกินหัวหรือราก', main_type: 'vegetable' },
    { id: 2, category_id: 2, name: 'มะเขือเทศ (Tomato)', original_price: 30, promo_price: null, stock_quantity: 79, image_url: '/images/products/มะเขือเทศ.jpg', is_best_seller: true, category_name: 'ผักกินผล', main_type: 'vegetable' },
    { id: 3, category_id: 3, name: 'บรอกโคลี (Broccoli)', original_price: 45, promo_price: null, stock_quantity: 59, image_url: '/images/products/บรอกโคลี.jpg', is_best_seller: false, category_name: 'ผักกินดอก', main_type: 'vegetable' },
    { id: 4, category_id: 7, name: 'มะม่วง (Mango)', original_price: 60, promo_price: null, stock_quantity: 147, image_url: '/images/products/มะม่วง.jpg', is_best_seller: true, category_name: 'ผลไม้เมืองร้อน', main_type: 'fruit' },
  ];
  return NextResponse.json({ success: true, data: fallback, source: 'fallback' });
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
      const result = await query<any>(
        `INSERT INTO products (name, category_id, description, original_price, stock_quantity, image_url, total_sale, lot_in_date, expiry_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY))`,
        [name, category_id, description, original_price, stock_quantity || 0, image_url || null, is_best_seller ? 10 : 0]
      );

      return NextResponse.json({
        success: true,
        data: { id: result.insertId, name, category_id, description, original_price, stock_quantity, image_url, is_best_seller },
        message: 'เพิ่มสินค้าสำเร็จ'
      });
    } catch (dbError: any) {
      console.error('DB insert error:', dbError.message);
      return NextResponse.json({ success: false, error: 'ไม่สามารถบันทึกข้อมูลลงฐานข้อมูลได้' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Upload error:', error.message);
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
          `UPDATE products SET name=?, category_id=?, description=?, original_price=?, stock_quantity=?, image_url=?, total_sale=?
           WHERE product_id=?`,
          [name, category_id, description, original_price, stock_quantity || 0, image_url, is_best_seller ? 10 : 0, id]
        );
      } else {
        await query(
          `UPDATE products SET name=?, category_id=?, description=?, original_price=?, stock_quantity=?, total_sale=?
           WHERE product_id=?`,
          [name, category_id, description, original_price, stock_quantity || 0, is_best_seller ? 10 : 0, id]
        );
      }

      return NextResponse.json({ success: true, message: 'อัปเดตสินค้าสำเร็จ' });
    } catch (dbError: any) {
      console.error('DB update error:', dbError.message);
      return NextResponse.json({ success: false, error: 'ไม่สามารถอัปเดตข้อมูลได้' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Upload error:', error.message);
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
    await query('DELETE FROM products WHERE product_id = ?', [id]);
    return NextResponse.json({ success: true, message: 'ลบสินค้าสำเร็จ' });
  } catch (error: any) {
    console.error('Delete error:', error.message);
    return NextResponse.json({ success: false, error: 'ไม่สามารถลบสินค้าได้' }, { status: 500 });
  }
}
