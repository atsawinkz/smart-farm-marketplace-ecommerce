---  
name: Feature / Task Request  
about: Create a new feature or development task  
title: '[TASK] ระบบจัดการสินค้า สต๊อก และคำสั่งซื้อ (Product, Stock, and Order Management)'  
labels: 'enhancement'  
assignees: ''  
---  

## User Story  
### สำหรับผู้ดูแลระบบ (Admin) - ระบบจัดการสินค้าและสต๊อก (Process 2.0)
* **As a** ผู้ดูแลระบบ  
* **I want to** เพิ่มข้อมูลสินค้าใหม่, กำหนดราคาสินค้า, และอัปเดตข้อมูลเพิ่ม/ลดสต๊อกในคลังสินค้า  
* **So that** ข้อมูลรายการสินค้าและจำนวนสต๊อกในระบบถูกต้อง เป็นปัจจุบัน และพร้อมสำหรับให้ลูกค้าเลือกซื้อ  

### สำหรับลูกค้า (Customer) - ระบบจัดการคำสั่งซื้อ (Process 3.0)
* **As a** ลูกค้า  
* **I want to** ดูรายการสินค้าและราคา, หยิบสินค้าใส่ตะกร้า, และยืนยันคำสั่งซื้อโดยระบุข้อมูลที่อยู่และตรวจสอบสรุปรายการคำสั่งซื้อ  
* **So that** ฉันสามารถสั่งซื้อสินค้าที่ต้องการได้อย่างถูกต้องและสะดวกรวดเร็ว  

## Acceptance Criteria  
*These must be checked off before this task is considered done.* 
- [ ] **ระบบจัดการสินค้าและราคา (Admin):** ผู้ดูแลระบบสามารถส่ง "ข้อมูลสินค้าใหม่" และ "ข้อมูลราคาสินค้า" เพื่อบันทึกเพิ่มรายการสินค้าและราคาลงในระบบฐานข้อมูลสินค้า (D2) ได้ พร้อมรับ "แจ้งเตือนสถานะการบันทึกข้อมูล"
- [ ] **ระบบจัดการสต๊อกสินค้า (Admin):** ผู้ดูแลระบบสามารถส่ง "ข้อมูลเพิ่มสต๊อก" และ "ข้อมูลลดสต๊อก" เพื่อบันทึกรับสินค้าเข้าคลังลงในฐานข้อมูลสต๊อก (D3) ได้สำเร็จ
- [ ] **ระบบแสดงรายการสินค้า (Customer):** ลูกค้าสามารถเข้าดู "รายการสินค้าและราคา" ที่ดึงมาจากฐานข้อมูลสินค้า (D2) ได้อย่างถูกต้อง

- [ ] UI matches the Figma design (Link here: )  

## Technical Specifications (SAs to fill out)  
* **Target Next.js Route/Component:** 
  * `/pages/admin/products` (หน้าจัดการสินค้าและสต๊อกสำหรับแอดมิน)
  * `/pages/products` (หน้าแสดงรายการสินค้าสำหรับลูกค้า)
  * `/pages/cart` และ `/pages/checkout` (หน้าตะกร้าสินค้าและการยืนยันคำสั่งซื้อ)
* **API Endpoint Required:** 
  * `POST /api/admin/products` (เพิ่มสินค้าและราคา)
  * `POST /api/admin/stock` (บันทึกรับสินค้าเข้าคลัง/ปรับสต๊อก)
  * `GET /api/products` (ดึงรายการสินค้าและราคา)
  * `POST /api/orders/checkout` (ประมวลผลและยืนยันคำสั่งซื้อ)
* **MySQL Tables Impacted:** `Members` (D1), `Products` (D2), `Stock` (D3), `Orders` (หากมีเพิ่มเติมสำหรับระบุสรุปคำสั่งซื้อ)

## Additional Notes  
* 