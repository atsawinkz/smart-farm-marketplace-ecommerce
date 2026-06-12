import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullname, username, password, phone, email } = body;

    if (!fullname || !username || !password || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsers = await query<any[]>(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: 'ชื่อผู้ใช้งานนี้มีในระบบแล้ว' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert into database
    await query(
      'INSERT INTO users (username, password, name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, fullname, email, phone, 'customer']
    );

    return NextResponse.json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ'
    });
  } catch (error: any) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล' },
      { status: 500 }
    );
  }
}
