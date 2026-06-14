---  
name: Feature / Task Request  
about: Create a new feature or development task  
title: '[TASK] ระบบออกรายงานสรุปสำหรับผู้บริหาร (Report Generation System)'  
labels: 'enhancement'  
assignees: ''  
---  

## User Story  
**As a** ผู้ดูแลระบบ (Admin)  
**I want to** เรียกดูรายงานสรุปยอดขายสินค้าและรายงานสรุปสต๊อกสินค้าคงเหลือจากระบบ  
**So that** ฉันสามารถนำข้อมูลเหล่านั้นไปวิเคราะห์ทิศทางการขาย วางแผนการตลาด และบริหารจัดการเติมสินค้าเข้าสต๊อกได้อย่างมีประสิทธิภาพ  

## Acceptance Criteria  
*These must be checked off before this task is considered done.* 
- [ ] **ระบบประมวลผลข้อมูลรายงาน:** ระบบต้องสามารถดึงข้อมูลพร้อมกันจาก 3 แหล่งข้อมูล ได้แก่ "ข้อมูลสต๊อก" จาก D3, "ข้อมูลคำสั่งซื้อ" จาก D4 และ "ข้อมูลการชำระเงิน" จาก D5 นำมาคำนวณและประมวลผลร่วมกันได้อย่างถูกต้อง
- [ ] **ระบบแสดงผลสรุปยอดขาย (Admin):** ผู้ดูแลระบบต้องสามารถเข้าดูข้อมูล "สรุปยอดขาย" แยกตามช่วงเวลาที่ต้องการได้อย่างแม่นยำ
- [ ] **ระบบแสดงผลสรุปสต๊อกคงเหลือ (Admin):** ผู้ดูแลระบบต้องสามารถเข้าดู "ข้อมูลสรุปสต๊อกคงเหลือ" ของสินค้าแต่ละรายการเพื่อตรวจสอบสถานะสินค้าในคลังได้
- [ ] UI matches the Figma design (Link here: )  

## Technical Specifications (SAs to fill out)  
* **Target Next.js Route/Component:** 
  * `/pages/admin/reports/sales` (หน้าแดชบอร์ด/รายงานสรุปยอดขาย)
  * `/pages/admin/reports/inventory` (หน้าสรุปและตรวจสอบสต๊อกคงเหลือ)
* **API Endpoint Required:** 
  * `GET /api/admin/reports/sales-summary` (ดึงและประมวลผลข้อมูลจาก D4 และ D5)
  * `GET /api/admin/reports/stock-balance` (ดึงและประมวลผลข้อมูลจาก D3)
* **MySQL Tables Impacted:** `stocks` (D3), `orders` (D4), `payments` (D5)  

## Additional Notes  
* 