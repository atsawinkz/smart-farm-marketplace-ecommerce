import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // Query user from database
    const users = await query<any[]>(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบชื่อผู้ใช้งานในระบบ' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password with bcryptjs
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, error: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Login successful
    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        address: user.address,
        subdistrict: user.subdistrict,
        district: user.district,
        province: user.province,
        postal_code: user.postal_code
      }
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}
