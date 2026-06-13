import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface CategoryRow {
  id: number;
  name: string;
  main_type: string;
}

export async function GET() {
  try {
    const categories = await query<CategoryRow[]>('SELECT id, name, main_type FROM categories ORDER BY main_type, id');
    return NextResponse.json({ success: true, data: categories || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'ไม่สามารถดึงข้อมูลหมวดหมู่จากฐานข้อมูลได้', detail: String(error) }, { status: 500 });
  }
}
