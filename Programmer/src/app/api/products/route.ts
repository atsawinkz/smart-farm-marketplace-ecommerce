import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Fallback seed data if the database is not configured or offline
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    category_id: 5,
    name: 'แครอต (Carrot)',
    description: 'แครอต (Carrot) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง',
    original_price: 30,
    promo_price: null,
    price: 30,
    stock_quantity: 91,
    image_url: '/images/products/แครอต.jpg',
    is_best_seller: true,
    category_name: 'ผักกินหัวหรือราก',
    main_type: 'vegetable'
  },
  {
    id: 2,
    category_id: 2,
    name: 'มะเขือเทศ (Tomato)',
    description: 'มะเขือเทศ (Tomato) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง',
    original_price: 30,
    promo_price: null,
    price: 30,
    stock_quantity: 79,
    image_url: '/images/products/มะเขือเทศ.jpg',
    is_best_seller: true,
    category_name: 'ผักกินผล',
    main_type: 'vegetable'
  },
  {
    id: 3,
    category_id: 3,
    name: 'บรอกโคลี (Broccoli)',
    description: 'บรอกโคลี (Broccoli) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/หัว',
    original_price: 45,
    promo_price: null,
    price: 45,
    stock_quantity: 59,
    image_url: '/images/products/บรอกโคลี.jpg',
    is_best_seller: false,
    category_name: 'ผักกินดอก',
    main_type: 'vegetable'
  },
  {
    id: 4,
    category_id: 7,
    name: 'มะม่วง (Mango)',
    description: 'มะม่วง (Mango) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง',
    original_price: 60,
    promo_price: null,
    price: 60,
    stock_quantity: 147,
    image_url: '/images/products/มะม่วง.jpg',
    is_best_seller: true,
    category_name: 'ผลไม้เมืองร้อน',
    main_type: 'fruit'
  }
];

export async function GET() {
  try {
    const products = await query<any[]>(`
      SELECT 
        p.product_id AS id,
        p.category_id,
        p.name,
        p.description,
        p.original_price,
        CASE
          WHEN DATEDIFF(p.expiry_date, CURDATE()) <= 3 THEN p.original_price
          ELSE NULL
        END AS promo_price,
        CASE
          WHEN DATEDIFF(p.expiry_date, CURDATE()) <= 3 THEN ROUND(p.original_price * 0.7)
          ELSE p.original_price
        END AS price,
        p.stock_quantity,
        p.image_url,
        COALESCE(monthly_sales.sales_qty, 0) AS total_sale,
        (CASE WHEN COALESCE(monthly_sales.sales_qty, 0) > 5 THEN TRUE ELSE FALSE END) AS is_best_seller,
        p.lot_in_date,
        p.expiry_date,
        c.name AS category_name,
        c.main_type
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN (
        SELECT od.product_id, SUM(od.quantity) AS sales_qty
        FROM order_details od
        JOIN orders o ON od.order_id = o.order_id
        WHERE o.status IN ('paid', 'shipped', 'completed')
          AND YEAR(o.created_at) = YEAR(CURDATE())
          AND MONTH(o.created_at) = MONTH(CURDATE())
        GROUP BY od.product_id
      ) monthly_sales ON p.product_id = monthly_sales.product_id
      ORDER BY total_sale DESC, p.product_id ASC
    `);
    
    if (products && products.length > 0) {
      return NextResponse.json({ success: true, data: products, source: 'database' });
    }
    
    return NextResponse.json({ success: true, data: FALLBACK_PRODUCTS, source: 'fallback' });
  } catch (error: any) {
    console.warn('Database connection failed, using fallback data. Error:', error.message);
    return NextResponse.json({ 
      success: true, 
      data: FALLBACK_PRODUCTS, 
      source: 'fallback', 
      warning: 'Database offline or unconfigured. Ensure XAMPP MySQL is running and smartfarm_db is imported.' 
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category_id, description, original_price, promo_price, stock_quantity, image_url } = body;

    if (!name || !category_id || !original_price) {
      return NextResponse.json({ success: false, error: 'name, category_id, and original_price are required.' }, { status: 400 });
    }

    const result = await query<any>(
      'INSERT INTO products (name, category_id, description, original_price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category_id, description || null, original_price, stock_quantity || 0, image_url || null]
    );

    return NextResponse.json({ success: true, data: { id: result.insertId, ...body } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
