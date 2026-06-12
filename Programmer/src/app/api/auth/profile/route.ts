import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, phone, address, subdistrict, district, province, postal_code } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ไม่พบผู้ใช้' }, { status: 400 });
    }

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกชื่อและอีเมล' }, { status: 400 });
    }

    await query(
      `UPDATE users SET name = ?, email = ?, phone = ?, address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ? WHERE id = ?`,
      [name, email, phone || null, address || null, subdistrict || null, district || null, province || null, postal_code || null, id]
    );

    const users = await query<any[]>(
      'SELECT id, username, name, email, phone, role, address, subdistrict, district, province, postal_code FROM users WHERE id = ?',
      [id]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, error: 'ไม่พบผู้ใช้' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: users[0] });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
