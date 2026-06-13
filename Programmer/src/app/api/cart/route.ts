import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'ต้องระบุ user_id' }, { status: 400 });
    }

    const [rows] = await pool.execute<any[]>(
      `SELECT 
        c.cart_item_id,
        c.quantity,
        p.product_id,
        p.category_id,
        p.name,
        p.description,
        p.original_price,
        p.stock_quantity,
        p.image_url,
        cat.name        AS category_name,
        cat.main_type
      FROM cart_items c
      JOIN products p   ON c.product_id = p.product_id
      LEFT JOIN categories cat ON p.category_id = cat.category_id
      WHERE c.user_id = ?`,
      [parseInt(userId)]
    );

    const cartItems = rows.map((row) => ({
      product: {
        id: row.product_id,          // expose as 'id' so frontend works unchanged
        category_id: row.category_id,
        name: row.name,
        description: row.description,
        original_price: row.original_price,
        promo_price: null,           // column doesn't exist in DB — default null
        price: row.original_price,   // use original_price as price
        stock_quantity: row.stock_quantity,
        image_url: row.image_url,
        is_best_seller: false,       // column doesn't exist in DB — default false
        category_name: row.category_name?.trim() ?? null,
        main_type: row.main_type,
      },
      quantity: row.quantity,
      checked: true,
    }));

    return NextResponse.json({ success: true, data: cartItems });
  } catch (error: any) {
    console.error('Get cart items error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Use a dedicated connection so we can wrap in a transaction
  const conn = await pool.getConnection();
  try {
    const body = await request.json();
    const { user_id, items } = body;

    if (!user_id) {
      conn.release();
      return NextResponse.json({ success: false, error: 'ต้องระบุ user_id' }, { status: 400 });
    }

    await conn.beginTransaction();

    // Delete existing cart items for this user
    await conn.execute('DELETE FROM cart_items WHERE user_id = ?', [user_id]);

    // Bulk insert new cart items (if any)
    if (items && Array.isArray(items) && items.length > 0) {
      const validItems = items.filter(
        (item) => item.product_id && item.quantity > 0
      );

      if (validItems.length > 0) {
        const placeholders = validItems.map(() => '(?, ?, ?)').join(', ');
        const values = validItems.flatMap((item) => [
          user_id,
          item.product_id,
          item.quantity,
        ]);
        await conn.execute(
          `INSERT INTO cart_items (user_id, product_id, quantity) VALUES ${placeholders}`,
          values
        );
      }
    }

    await conn.commit();
    return NextResponse.json({ success: true, message: 'บันทึกตะกร้าสินค้าสำเร็จ' });
  } catch (error: any) {
    await conn.rollback();
    console.error('Save cart items error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    conn.release();
  }
}
