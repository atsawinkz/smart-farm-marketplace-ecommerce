import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'ผักกินใบและลำต้น', main_type: 'vegetable' },
  { id: 2, name: 'ผักกินผล', main_type: 'vegetable' },
  { id: 3, name: 'ผักกินดอก', main_type: 'vegetable' },
  { id: 4, name: 'ผักกินฝักและเมล็ด', main_type: 'vegetable' },
  { id: 5, name: 'ผักกินหัวหรือราก', main_type: 'vegetable' },
  { id: 6, name: 'ผักกินหัวที่เกิดจากกาบใบ', main_type: 'vegetable' },
  { id: 7, name: 'ผลไม้เมืองร้อน', main_type: 'fruit' },
  { id: 8, name: 'ผลไม้เมืองหนาว / นำเข้า', main_type: 'fruit' },
  { id: 9, name: 'ตระกูลส้มและมะนาว', main_type: 'fruit' },
  { id: 10, name: 'ตระกูลแตง', main_type: 'fruit' },
];

export async function GET() {
  try {
    const categories = await query<any[]>('SELECT id, name, main_type FROM categories ORDER BY main_type, id');
    if (categories && categories.length > 0) {
      return NextResponse.json({ success: true, data: categories, source: 'database' });
    }
    return NextResponse.json({ success: true, data: FALLBACK_CATEGORIES, source: 'fallback' });
  } catch {
    return NextResponse.json({ success: true, data: FALLBACK_CATEGORIES, source: 'fallback' });
  }
}
