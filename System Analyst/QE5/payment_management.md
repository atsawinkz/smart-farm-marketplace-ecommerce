---  
name: Feature / Task Request  
about: Create a new feature or development task  
title: '[TASK] ระบบจัดการการชำระเงิน (Payment Management System)'  
labels: 'enhancement'  
assignees: ''  
---  

## User Story  
### สำหรับลูกค้า (Customer)
* **As a** ลูกค้า  
* **I want to** สามารถชำระเงินสำหรับคำสั่งซื้อของฉัน และได้รับใบเสร็จชำระเงินจากระบบ  
* **So that** การสั่งซื้อเสร็จสมบูรณ์อย่างถูกต้องและฉันมีหลักฐานยืนยันการชำระเงิน  

### สำหรับระบบภายนอก (System) - ระบบชำระเงิน (Payment Gateway)
* **As a** ระบบชำระเงิน  
* **I want to** ส่งข้อมูลสถานะการชำระเงินกลับมาอัปเดตที่ระบบหลัก และรับข้อมูลยืนยันสถานะการชำระเงินสำเร็จ  
* **So that** สถานะทางการเงินของออร์เดอร์ในระบบตรงกันกับทาง Gateway  

## Acceptance Criteria  
*These must be checked off before this task is considered done.* 
- [ ] **ระบบชำระเงินสำหรับคำสั่งซื้อ (Customer):** ลูกค้าสามารถส่งข้อมูล "ชำระเงิน" โดยระบบต้องไปดึง "ข้อมูลคำสั่งซื้อ" จาก D4 ข้อมูลคำสั่งซื้อ เพื่อนำมาตรวจสอบและประมวลผลยอดเงิน
- [ ] **การเชื่อมต่อ Payment Gateway (System):** ระบบสามารถรับ "ข้อมูลสถานะการชำระเงิน" จากระบบชำระเงินภายนอก และตอบกลับ "ข้อมูลสถานะการชำระเงินสำเร็จ" ไปยังระบบชำระเงินนั้นได้ถูกต้อง
- [ ] **การบันทึกข้อมูลและออกใบเสร็จ (Data Store D5):** เมื่อการชำระเงินสำเร็จ ระบบต้องทำการ "บันทึกข้อมูลการชำระเงิน" ลงใน D5 ข้อมูลการชำระเงิน และส่ง "ใบเสร็จชำระเงิน" กลับไปแสดงผลหรือให้ลูกค้าดาวน์โหลดได้
- [ ] UI matches the Figma design (Link here: )  

## Technical Specifications (SAs to fill out)  
* **Target Next.js Route/Component:** 
  * `/pages/checkout/payment` (หน้าเลือกช่องทางและกดชำระเงินสำหรับลูกค้า)
  * `/pages/checkout/receipt/[id]` (หน้าแสดง/พิมพ์ใบเสร็จชำระเงิน)
* **API Endpoint Required:** 
  * `POST /api/payments/charge` (ส่งคำขอชำระเงินโดยอ้างอิงรหัสจาก D4)
  * `POST /api/payments/webhook` (Endpoint สำหรับรับ Callback/Webhook "ข้อมูลสถานะการชำระเงิน" จากภายนอก)
  * `GET /api/payments/receipt/[id]` (ดึงข้อมูล D5 มาออกใบเสร็จให้ลูกค้า)
* **MySQL Tables Impacted:** `Orders` (D4), `Payments` / `Invoices` (D5)

## Additional Notes  
* 