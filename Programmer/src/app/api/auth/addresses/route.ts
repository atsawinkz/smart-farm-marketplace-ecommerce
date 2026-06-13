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
      `SELECT 
        address_id AS id, 
        user_id, 
        'ที่อยู่จัดส่ง' AS title, 
        recipient_name AS name, 
        '' AS email, 
        address, 
        subdistrict, 
        district, 
        province, 
        postal_code, 
        recipient_phone AS phone, 
        is_default 
      FROM addresses 
      WHERE user_id = ? 
      ORDER BY is_default DESC, address_id DESC`,
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
    const { user_id, name, address, subdistrict, district, province, postal_code, phone, is_default } = body;

    if (!user_id || !name || !address || !district || !province || !phone) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 });
    }

    // Check limit of 5 addresses
    const countResult = await query<any[]>(
      'SELECT COUNT(*) as count FROM addresses WHERE user_id = ?',
      [user_id]
    );
    const count = countResult[0]?.count || 0;
    if (count >= 5) {
      return NextResponse.json({ success: false, error: 'สามารถบันทึกที่อยู่ได้สูงสุด 5 ที่อยู่' }, { status: 400 });
    }

    const setAsDefault = is_default || count === 0;

    if (setAsDefault) {
      // Set all other addresses for this user to NOT default
      await query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [user_id]);
    }

    const result = await query<any>(
      `INSERT INTO addresses (user_id, recipient_name, recipient_phone, address, subdistrict, district, province, postal_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, phone, address, subdistrict || '', district, province, postal_code || '', setAsDefault]
    );

    // If this is default, also update the main users table for compatibility
    if (setAsDefault) {
      await query(
        `UPDATE users SET name = ?, address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, phone = ? WHERE user_id = ?`,
        [name, address, subdistrict || '', district, province, postal_code || '', phone, user_id]
      );
    }

    const newAddress = {
      id: result.insertId,
      user_id,
      title: 'ที่อยู่จัดส่ง',
      name,
      email: '',
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
    const { id, user_id, name, address, subdistrict, district, province, postal_code, phone, is_default, action } = body;

    if (!id || !user_id) {
      return NextResponse.json({ success: false, error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    if (action === 'set_default') {
      // Set all other addresses to false
      await query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [user_id]);
      // Set this one to true
      await query('UPDATE addresses SET is_default = TRUE WHERE address_id = ? AND user_id = ?', [id, user_id]);

      // Get this address to update users table
      const addrRes = await query<any[]>(
        'SELECT recipient_name, address, subdistrict, district, province, postal_code, recipient_phone FROM addresses WHERE address_id = ?',
        [id]
      );
      if (addrRes.length > 0) {
        const a = addrRes[0];
        await query(
          `UPDATE users SET name = ?, address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, phone = ? WHERE user_id = ?`,
          [a.recipient_name, a.address, a.subdistrict, a.district, a.province, a.postal_code, a.recipient_phone, user_id]
        );
      }

      return NextResponse.json({ success: true, message: 'ตั้งเป็นที่อยู่เริ่มต้นสำเร็จ' });
    }

    // Normal update
    if (!name || !address || !district || !province || !phone) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 });
    }

    if (is_default) {
      // Set all other addresses to false
      await query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [user_id]);
    }

    await query(
      `UPDATE addresses 
       SET recipient_name = ?, recipient_phone = ?, address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, is_default = ?
       WHERE address_id = ? AND user_id = ?`,
      [name, phone, address, subdistrict || '', district, province, postal_code || '', is_default ? 1 : 0, id, user_id]
    );

    // If this address is default, also update the users table
    if (is_default) {
      await query(
        `UPDATE users SET name = ?, address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, phone = ? WHERE user_id = ?`,
        [name, address, subdistrict || '', district, province, postal_code || '', phone, user_id]
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
      'SELECT is_default FROM addresses WHERE address_id = ? AND user_id = ?',
      [parseInt(id), parseInt(userId)]
    );

    const wasDefault = checkDefault[0]?.is_default;

    await query('DELETE FROM addresses WHERE address_id = ? AND user_id = ?', [parseInt(id), parseInt(userId)]);

    if (wasDefault) {
      // Set another address as default
      const remaining = await query<any[]>(
        'SELECT address_id AS id, recipient_name AS name, address, subdistrict, district, province, postal_code, recipient_phone AS phone FROM addresses WHERE user_id = ? ORDER BY address_id DESC LIMIT 1',
        [parseInt(userId)]
      );

      if (remaining.length > 0) {
        const nextDefaultId = remaining[0].id;
        await query('UPDATE addresses SET is_default = TRUE WHERE address_id = ?', [nextDefaultId]);

        const r = remaining[0];
        await query(
          `UPDATE users SET name = ?, address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?, phone = ? WHERE user_id = ?`,
          [r.name, r.address, r.subdistrict, r.district, r.province, r.postal_code, r.phone, parseInt(userId)]
        );
      } else {
        // Clear address in users table
        await query(
          `UPDATE users SET address = NULL, subdistrict = NULL, district = NULL, province = NULL, postal_code = NULL WHERE user_id = ?`,
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
