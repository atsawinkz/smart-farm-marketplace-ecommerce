---  
name: Feature / Task Request  
about: Create a new feature or development task  
title: '[TASK] ระบบจัดการข้อมูลผู้ใช้งาน (User Management System)'  
labels: 'enhancement'  
assignees: ''  
---  

## User Story  
### สำหรับลูกค้า (Customer)
* **As a** ลูกค้า  
* **I want to** สามารถสมัครสมาชิก, ล็อกอินเข้าสู่ระบบ, แก้ไขโปรไฟล์ส่วนตัว และแก้ไขที่อยู่จัดส่งได้  
* **So that** ข้อมูลส่วนตัวของฉันถูกต้อง เป็นปัจจุบัน และสามารถใช้บริการระบบได้อย่างราบรื่น  

### สำหรับผู้ดูแลระบบ (Admin)
* **As a** ผู้ดูแลระบบ  
* **I want to** สามารถล็อกอินเข้าสู่ระบบจัดการข้อมูลผู้ใช้งานได้  
* **So that** สามารถเข้าถึงระบบเพื่อตรวจสอบหรือดูแลความปลอดภัยของบัญชีผู้ใช้ได้  

## Acceptance Criteria  
*These must be checked off before this task is considered done.* 
- [ ] **ระบบสมัครสมาชิก (Register):** ลูกค้าสามารถส่ง "ข้อมูลสมัครสมาชิก" เพื่อบันทึกลงในระบบฐานข้อมูลสมาชิก (D1) ได้สำเร็จ
- [ ] **ระบบล็อกอิน (Login):** 
  - ลูกค้าส่ง "ข้อมูลล็อกอิน" และได้รับ "ผลการล็อกอิน" กลับมาอย่างถูกต้อง
  - ผู้ดูแลระบบส่ง "ข้อมูลล็อกอิน" และได้รับ "ผลการล็อกอิน" กลับมาอย่างถูกต้อง
- [ ] **ระบบจัดการโปรไฟล์ (Profile Management):** ลูกค้าสามารถดึง "ข้อมูลโปรไฟล์ส่วนตัว" มาแสดงผล และสามารถส่ง "ข้อมูลแก้ไขโปรไฟล์" เพื่ออัปเดตระบบได้
- [ ] **ระบบจัดการที่อยู่ (Address Management):** ลูกค้าสามารถส่ง "ข้อมูลแก้ไขที่อยู่จัดส่ง" เพื่ออัปเดตที่อยู่สำหรับจัดส่งสินค้าได้
- [ ] **การเชื่อมต่อฐานข้อมูล (Data Store D1):** ระบบสามารถอ่าน (ดึงข้อมูลสมาชิก) และเขียน (บันทึกข้อมูลสมาชิก) ลงใน Table ข้อมูลสมาชิกได้อย่างถูกต้องแม่นยำ
- [ ] UI matches the Figma design (Link here: )  

## Technical Specifications (SAs to fill out)  
* **Target Next.js Route/Component:** 
  * `/pages/register` (หน้าสมัครสมาชิก)
  * `/pages/login` (หน้าล็อกอินลูกค้า/แอดมิน)
  * `/pages/profile` (หน้าจัดการข้อมูลส่วนตัวและที่อยู่)
* **API Endpoint Required:** 
  * `POST /api/auth/register`
  * `POST /api/auth/login`
  * `GET /api/user/profile`
  * `PUT /api/user/profile`
  * `PUT /api/user/address`
* **MySQL Tables Impacted:** `Members` (หรือ `Users` ตามโครงสร้าง D1 ในภาพ `image_78f3dc.png`)

## Additional Notes  
* 