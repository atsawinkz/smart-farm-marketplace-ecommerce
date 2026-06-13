import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'ต้องระบุ user_id' }, { status: 400 });
    }

    const addresses = await query<any[]>(
      'SELECT id, user_id, title, address, subdistrict, district, province, postal_code, phone, is_default FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC',
      [parseInt(userId)]
    );

    return NextResponse.json({ success: true, data: addresses });
  } catch (error: any) {
    console.error('Get addresses error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, title, address, subdistrict, district, province, postal_code, phone, is_default } = body;

    if (!user_id || !title || !address || !district || !province || !phone) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 });
    }

    // Check limit of 5 addresses
    const countResult = await query<any[]>(
      'SELECT COUNT(*) as count FROM user_addresses WHERE user_id = ?',
      [user_id]
    );
    const count = countResult[0]?.count || 0;
    if (count >= 5) {
      return NextResponse.json({ success: false, error: 'สามารถบันทึกที่อยู่ได้สูงสุด 5 ที่อยู่' }, { status: 400 });
    }

    const setAsDefault = is_default || count === 0;

    if (setAsDefault) {
      // Set all other addresses for this user to NOT default
      await query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [user_id]);
    }

    const result = await query<any>(
      `INSERT INTO user_addresses (user_id, title, address, subdistrict, district, province, postal_code, phone, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, title, address, subdistrict || '', district, province, postal_code || '', phone, setAsDefault]
    );

    // If this is default, also update the main users table for compatibility with any legacy code
    if (setAsDefault) {
      await query(
        `UPDATE users SET address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, phone = ? WHERE id = ?`,
        [address, subdistrict || '', district, province, postal_code || '', phone, user_id]
      );
    }

    const newAddress = {
      id: result.insertId,
      user_id,
      title,
      address,
      subdistrict,
      district,
      province,
      postal_code,
      phone,
      is_default: setAsDefault
    };

    return NextResponse.json({ success: true, data: newAddress });
  } catch (error: any) {
    console.error('Create address error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, user_id, title, address, subdistrict, district, province, postal_code, phone, is_default, action } = body;

    if (!id || !user_id) {
      return NextResponse.json({ success: false, error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    if (action === 'set_default') {
      // Set all other addresses to false
      await query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [user_id]);
      // Set this one to true
      await query('UPDATE user_addresses SET is_default = TRUE WHERE id = ? AND user_id = ?', [id, user_id]);

      // Get this address to update users table
      const addrRes = await query<any[]>(
        'SELECT address, subdistrict, district, province, postal_code, phone FROM user_addresses WHERE id = ?',
        [id]
      );
      if (addrRes.length > 0) {
        const a = addrRes[0];
        await query(
          `UPDATE users SET address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, phone = ? WHERE id = ?`,
          [a.address, a.subdistrict, a.district, a.province, a.postal_code, a.phone, user_id]
        );
      }

      return NextResponse.json({ success: true, message: 'ตั้งเป็นที่อยู่เริ่มต้นสำเร็จ' });
    }

    // Normal update
    if (!title || !address || !district || !province || !phone) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 });
    }

    await query(
      `UPDATE user_addresses 
       SET title = ?, address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, phone = ?
       WHERE id = ? AND user_id = ?`,
      [title, address, subdistrict || '', district, province, postal_code || '', phone, id, user_id]
    );

    // If this address is default, also update the users table
    const checkDefault = await query<any[]>(
      'SELECT is_default FROM user_addresses WHERE id = ?',
      [id]
    );
    if (checkDefault[0]?.is_default) {
      await query(
        `UPDATE users SET address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, phone = ? WHERE id = ?`,
        [address, subdistrict || '', district, province, postal_code || '', phone, user_id]
      );
    }

    return NextResponse.json({ success: true, message: 'แก้ไขข้อมูลที่อยู่สำเร็จ' });
  } catch (error: any) {
    console.error('Update address error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('user_id');

    if (!id || !userId) {
      return NextResponse.json({ success: false, error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    // Check if we are deleting the default address
    const checkDefault = await query<any[]>(
      'SELECT is_default FROM user_addresses WHERE id = ? AND user_id = ?',
      [parseInt(id), parseInt(userId)]
    );

    const wasDefault = checkDefault[0]?.is_default;

    await query('DELETE FROM user_addresses WHERE id = ? AND user_id = ?', [parseInt(id), parseInt(userId)]);

    if (wasDefault) {
      // Set another address as default
      const remaining = await query<any[]>(
        'SELECT id, address, subdistrict, district, province, postal_code, phone FROM user_addresses WHERE user_id = ? ORDER BY id DESC LIMIT 1',
        [parseInt(userId)]
      );

      if (remaining.length > 0) {
        const nextDefaultId = remaining[0].id;
        await query('UPDATE user_addresses SET is_default = TRUE WHERE id = ?', [nextDefaultId]);

        const r = remaining[0];
        await query(
          `UPDATE users SET address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, phone = ? WHERE id = ?`,
          [r.address, r.subdistrict, r.district, r.province, r.postal_code, r.phone, parseInt(userId)]
        );
      } else {
        // Clear address in users table
        await query(
          `UPDATE users SET address = NULL, subdistrict = NULL, district = NULL, province = NULL, postal_code = NULL WHERE id = ?`,
          [parseInt(userId)]
        );
      }
    }

    return NextResponse.json({ success: true, message: 'ลบที่อยู่สำเร็จ' });
  } catch (error: any) {
    console.error('Delete address error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
