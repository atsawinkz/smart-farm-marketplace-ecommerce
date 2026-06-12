import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Fallback seed data if the database is not configured or offline
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    category_id: 2,
    name: 'แครอทออร์แกนิค (500g)',
    description: 'แครอทสดใหม่จากสวนเกษตรอินทรีย์ ปลอดภัยไร้สารเคมี',
    price: 45.00,
    stock_quantity: 50,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKxj_O4Ii3B1pH-lKpdIhIojjXNi77FbrTSoFU78MU2CLQjedEzYi04cDpNKJ73AQ-DP4v2jZjjjkI9bcaDYWDuKELatvd4BB_oRyvd9JYHXf2yxGtEH3HJLn49XosKoMeLjgaFPnUbxeBVMjMz81dg4y5pCxqgReEOYiW2cYPU4CWzUaNkjjWIGu-xmmWtpU-aRbVcFZIugC_Ieaoq9Ut_GSf-4UJX89mhjq5PmdcudE5AcudyrzIzGwE9ryWhMufvxujSgKPDC71',
    category_name: 'ผักกินหัวหรือราก',
    main_type: 'vegetable'
  },
  {
    id: 2,
    category_id: 4,
    name: 'มะเขือเทศเชอร์รี่ (250g)',
    description: 'มะเขือเทศเชอร์รี่รสหวานอมเปรี้ยว สดกรอบ อุดมด้วยวิตามินซี',
    price: 65.00,
    stock_quantity: 30,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2F5eSsHpmqp_ZqzwaZbV3CrjREvmYD9PssxhI9A98bgeYHbNJ9k6nrIGoYWO0XVWibS3k9WYi-N_PFGm0flm-Lzhcqkc3yp1bKPS3G24YwtFe0TwjR1igkPI0CP8jxMB4P39xvvcsits33lQWACcr7N7K1qg3STKYozAmg24QiQ6kk1qg9KfKGncpfqq33fADuH9G1xxYXC49xqEpz2Kx36KWINn7EnVVl3dQVicMcl1YKK3xCM1VMV3HCNPcaPAUMo1RB_4ptLy0',
    category_name: 'ผักกินผล',
    main_type: 'vegetable'
  },
  {
    id: 3,
    category_id: 1,
    name: 'บรอกโคลีพรีเมียม (1 หัว)',
    description: 'บรอกโคลีออร์แกนิคหัวใหญ่ ดอกแน่น กรอบอร่อย',
    price: 55.00,
    stock_quantity: 25,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4obRn2UP7lbHZGum891fYJ0X0ThVq6V_dlBkTJtjO7biJlkKKr133g-AM-1ANN2qtRlaANVVlsZTl6yS-9udf9HjV5m0zFhR5CzE0zTqZBZjQjyFwtfb_WCBPKlGuse1KPh_kLfbE3cCuZqD6R1NCT52VfG2-EMDc93KsOuyGLFoTAsp0zx7pHlYSsRH7i_2ZJYoA7N6YvA96_ZAR4kC1Y-Pt0uedz7TH4br370YxAPy1w1wQ1hxQL2LPAIpViVUJ5T8oDX4hyzbG',
    category_name: 'ผักใบเขียว',
    main_type: 'vegetable'
  },
  {
    id: 4,
    category_id: 8,
    name: 'แอปเปิ้ลฟูจิ (4 ผล)',
    description: 'แอปเปิ้ลฟูจินำเข้า รสหวานกรอบ อร่อยเต็มคำ',
    price: 120.00,
    stock_quantity: 15,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDQIVvNMzIAvECEo3B1CKJ4bmveZ3rUy0KurX2geGEvFiLekKmSsU3JJ85evm3ajvjvzQsBTHx1y0VgdLdBRYR2JhnNVxwQSRrAxKRexrblOgFT9gCwOua96FCfhi4dTy85An7lTAYxv4GLiT4ZJbIGC13khMpcxKIr3FYbKE03MzRvwHEV4fSJxc8AGrcznVUyV_MUjkcd1R4acdeV7KYUgxMQFPHFobj4XYN7uVa_l5SlsWteKfLjRgvSfcx4tOKZzNXitfvvbFz',
    category_name: 'ผลไม้เมืองหนาว / นำเข้า',
    main_type: 'fruit'
  }
];

export async function GET() {
  try {
    const products = await query<any[]>(`
      SELECT p.*, c.name as category_name, c.main_type 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
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
      warning: 'Database offline or unconfigured. Modify .env to connect to MySQL.' 
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category_id, description, price, stock_quantity, image_url } = body;

    if (!name || !category_id || !price) {
      return NextResponse.json({ success: false, error: 'Name, category_id, and price are required.' }, { status: 400 });
    }

    const result = await query<{ insertId: number }>(
      'INSERT INTO products (name, category_id, description, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category_id, description, price, stock_quantity || 0, image_url || null]
    );

    return NextResponse.json({ success: true, data: { id: result.insertId, ...body } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
