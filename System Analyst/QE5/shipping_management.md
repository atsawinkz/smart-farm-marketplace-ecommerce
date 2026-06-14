---  
name: Feature / Task Request  
about: Create a new feature or development task  
title: '[TASK] ระบบจัดการการจัดส่ง (Shipping Management System)'  
labels: 'enhancement'  
assignees: ''  
---  

## User Story  
**As a** ผู้ดูแลระบบ (Admin)  
**I want to** อัปเดตสถานะการจัดส่งพัสดุและเลขแทร็กกิ้งของคำสั่งซื้อเข้ามาในระบบ  
**So that** ข้อมูลสถานะการจัดส่งถูกอัปเดตไปยังฐานข้อมูลและส่งแจ้งเตือนให้ลูกค้าทราบได้ทันที  

**As a** ลูกค้า (Customer)  
**I want to** ได้รับแจ้งเตือนสถานะพัสดุและสามารถกดกดยืนยันเมื่อได้รับสินค้าเรียบร้อยแล้ว  
**So that** ฉันสามารถติดตามการจัดส่งได้แบบเรียลไทม์และปิดงานคำสั่งซื้อของฉันได้อย่างสมบูรณ์  

## Acceptance Criteria  
*These must be checked off before this task is considered done.* - [ ] **ระบบอัปเดตสถานะการจัดส่ง (Admin):** ผู้ดูแลระบบสามารถส่ง "ข้อมูลอัปเดตสถานะการจัดส่ง" (เช่น เลขพัสดุ, สถานะกำลังจัดส่ง) เพื่อนำไป "อัปเดตสถานะ" ลงในฐานข้อมูล D4 ข้อมูลคำสั่งซื้อ ได้สำเร็จ
- [ ] **ระบบแจ้งเตือนสถานะพัสดุ (Customer):** เมื่อระบบทำการอัปเดตสถานะใน D4 แล้ว ระบบจะต้องส่ง "แจ้งเตือนสถานะการจัดส่งพัสดุ" ไปยังหน้าจอหรือบัญชีของลูกค้าผู้สั่งซื้อโดยตรง
- [ ] **ระบบยืนยันรับสินค้า (Customer):** ลูกค้าสามารถส่งข้อมูล "ยืนยันได้รับสินค้าสำเร็จ" กลับมายังระบบ เพื่อทำรายการปรับเปลี่ยนสถานะคำสั่งซื้อในฐานข้อมูล D4 ให้เป็นสถานะเสร็จสิ้น (Completed)
- [ ] UI matches the Figma design (Link here: )  

## Technical Specifications (SAs to fill out)  
* **Target Next.js Route/Component:** * `/pages/admin/shipping/index.tsx` (หน้าจอสำหรับแอดมินอัปเดตสถานะพัสดุและคำสั่งซื้อ)
  * `/pages/orders/tracking/[id].tsx` (หน้าจอติดตามสถานะพัสดุและปุ่มยืนยันรับสินค้าสำหรับลูกค้า)
* **API Endpoint Required:** * `PUT /api/admin/shipping/update` (ส่งข้อมูลอัปเดตสถานะจัดส่งไปยัง D4)
  * `POST /api/orders/[id]/confirm-receipt` (รับข้อมูลการยืนยันได้รับสินค้าสำเร็จจากลูกค้าเพื่ออัปเดต D4)
* **MySQL Tables Impacted:** `orders` (D4 ข้อมูลคำสั่งซื้อ)

## Additional Notes  
* 