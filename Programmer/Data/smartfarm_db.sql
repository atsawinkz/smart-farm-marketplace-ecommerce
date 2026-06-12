-- ============================================================
-- ฐานข้อมูลระบบขายสินค้าเกษตร (ผัก-ผลไม้) : smartfarm_db
-- Community Smart-Farm & Fresh Produce Marketplace
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- สร้างฐานข้อมูลและเลือกใช้งาน
-- ============================================================
CREATE DATABASE IF NOT EXISTS `smartfarm_db`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `smartfarm_db`;

-- ============================================================
-- 1. ตาราง users (ระบบสมาชิกและสิทธิ์) - เพิ่มฟิลด์ที่อยู่
-- ============================================================
CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `role` ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    `address` VARCHAR(255) DEFAULT NULL COMMENT 'ที่อยู่ (บ้านเลขที่ / หมู่บ้าน / ซอย / ถนน)',
    `subdistrict` VARCHAR(100) DEFAULT NULL COMMENT 'ตำบล/แขวง',
    `district` VARCHAR(100) DEFAULT NULL COMMENT 'อำเภอ/เขต',
    `province` VARCHAR(100) DEFAULT NULL COMMENT 'จังหวัด',
    `postal_code` VARCHAR(10) DEFAULT NULL COMMENT 'รหัสไปรษณีย์',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_users_username` (`username`),
    UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. ตาราง categories (หมวดหมู่สินค้า: ผัก 6 ประเภท / ผลไม้ 4 ประเภท)
-- ============================================================
CREATE TABLE `categories` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `main_type` ENUM('vegetable', 'fruit') NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. ตาราง products (รายละเอียดสินค้า)
-- ============================================================
CREATE TABLE `products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `original_price` INT NOT NULL DEFAULT 0 COMMENT 'ราคาก่อนลด (บาทต่อหน่วยจำหน่าย, จำนวนเต็ม)',
    `promo_price` INT DEFAULT NULL COMMENT 'ราคาโปรโมชั่น (บาทต่อหน่วยจำหน่าย, จำนวนเต็ม) ถ้าไม่มีโปรเป็น NULL',
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `image_url` VARCHAR(255) DEFAULT NULL,
    `is_best_seller` BOOLEAN NOT NULL DEFAULT FALSE,
    `lot_in_date` DATE DEFAULT NULL,
    `expiry_date` DATE DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_products_category_id` (`category_id`),
    KEY `idx_products_is_best_seller` (`is_best_seller`),
    KEY `idx_products_expiry_date` (`expiry_date`),
    CONSTRAINT `fk_products_category`
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. ตาราง orders (หัวเอกสารการสั่งซื้อ)
-- ============================================================
CREATE TABLE `orders` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `status` ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_orders_user_id` (`user_id`),
    KEY `idx_orders_created_at` (`created_at`),
    KEY `idx_orders_status` (`status`),
    CONSTRAINT `fk_orders_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. ตาราง order_details (รายการสินค้าในออเดอร์นั้นๆ)
-- ============================================================
CREATE TABLE `order_details` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `price_per_unit` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_order_details_order_id` (`order_id`),
    KEY `idx_order_details_product_id` (`product_id`),
    CONSTRAINT `fk_order_details_order`
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_order_details_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. ตาราง banners (ภาพแบนเนอร์โปรโมชั่นหน้าหลัก)
-- ============================================================
CREATE TABLE `banners` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `link_to_product_id` INT DEFAULT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`id`),
    KEY `idx_banners_link_to_product_id` (`link_to_product_id`),
    CONSTRAINT `fk_banners_product`
        FOREIGN KEY (`link_to_product_id`) REFERENCES `products` (`id`)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- ข้อมูลตัวอย่าง (Sample / Mock Data)
-- ============================================================

-- ----------------------------------------------------------
-- 2.1 หมวดหมู่ : ผัก 6 ประเภท + ผลไม้ 4 ประเภท (รวม 10 หมวดหมู่)
-- ----------------------------------------------------------
INSERT INTO `categories` (`name`, `main_type`) VALUES
('ผักกินใบและลำต้น', 'vegetable'),
('ผักกินผล', 'vegetable'),
('ผักกินดอก', 'vegetable'),
('ผักกินฝักและเมล็ด', 'vegetable'),
('ผักกินหัวหรือราก', 'vegetable'),
('ผักกินหัวที่เกิดจากกาบใบ', 'vegetable'),
('ผลไม้เมืองร้อน', 'fruit'),
('ผลไม้เมืองหนาว', 'fruit'),
('ผลไม้ตระกูลส้มและมะนาว', 'fruit'),
('ผลไม้ตระกูลแตง', 'fruit');

-- ----------------------------------------------------------
-- 2.2 ผู้ใช้ตัวอย่าง (admin / customer) พร้อมที่อยู่
-- ----------------------------------------------------------
INSERT INTO `users`
    (`username`, `password`, `name`, `email`, `phone`, `role`, `address`, `subdistrict`, `district`, `province`, `postal_code`) VALUES
('admin', '$2b$10$fkVgs8t1PHQfAxBg97eQxOGd5Tnl2/jEz69/gLuApb46h.FYfbK9y', 'ผู้ดูแลระบบ', 'admin@example.com', '0800000000', 'admin',
    '99/1 อาคาร Smartket-Farm', 'บางรัก', 'บางรัก', 'กรุงเทพมหานคร', '10500'),
('admin2', '$2b$10$tnjVRtHunvhLDnrBDYYZ5.NV014Izcguhj2QzihG.K6Jq0Z0EvMgq', 'ผู้ดูแลระบบ 2', 'admin2@example.com', '0822222222', 'admin',
    '99/2 อาคาร Smartket-Farm', 'บางรัก', 'บางรัก', 'กรุงเทพมหานคร', '10500'),
('customer1', '$2b$10$MvNjuIzS5fWr8YMRjzumPO1effWHsZnx86faQmYs8qxulK7io1MU2', 'สมชาย ใจดี', 'somchai@example.com', '0811111111', 'customer',
    '12/5 หมู่ 3 ถนนสุขุมวิท', 'บางนา', 'บางนา', 'กรุงเทพมหานคร', '10260'),
('customer2', '$2b$10$9aJQywlEu.fICisKu8eVuOfL91Z5XeiZXJx8LEap2jph2hxVIn7rG', 'สมหญิง สดใส', 'somying@example.com', '0833333333', 'customer',
    '88/8 หมู่ 4 ถนนรามคำแหง', 'หัวหมาก', 'บางกะปิ', 'กรุงเทพมหานคร', '10240');


-- ----------------------------------------------------------
-- 2.3 สินค้า : ผัก 6 ประเภท x 10 ชนิด + ผลไม้ 4 ประเภท x 10 ชนิด
--      (รวม 100 รายการ) - category_id อ้างอิงตามลำดับการ INSERT categories ด้านบน
--      1=ผักกินใบและลำต้น 2=ผักกินผล 3=ผักกินดอก 4=ผักกินฝักและเมล็ด
--      5=ผักกินหัวหรือราก 6=ผักกินหัวที่เกิดจากกาบใบ
--      7=ผลไม้เมืองร้อน 8=ผลไม้เมืองหนาว 9=ผลไม้ตระกูลส้มและมะนาว 10=ผลไม้ตระกูลแตง
--
--      description ใช้รูปแบบ:
--      "[ชื่อสินค้า] สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด
--       คัดสรรจากเกษตรกรในชุมชน จำหน่ายในราคา[หน่วย]ละ [ราคา] บาท"
--      โดยหน่วยขายปรับตามชนิดสินค้า:
--        - กิโลกรัม : ผักส่วนใหญ่ (คะน้า, กวางตุ้ง, ผักบุ้ง, กะหล่ำปลี ฯลฯ) และผลไม้ทั่วไป (มะม่วง, ส้ม, องุ่น, แตงโม ฯลฯ)
--        - กำ       : ผักชี, ต้นหอม, ตั้งโอ๋, ขึ้นฉ่าย, ชะอม, ดอกผัก ฯลฯ
--        - แพ็ค     : ผักสลัด, สตรอว์เบอร์รี่, บลูเบอร์รี่, ข้าวโพดฝักอ่อน, ถั่วแระญี่ปุ่น ฯลฯ
--        - ลูก      : ทุเรียน, สับปะรด, มะพร้าว(ส้มโอ/เกรปฟรุต/เมลอน/แคนตาลูปใช้แนวคิดเดียวกัน)
--        - หัว      : หัวปลี
-- ----------------------------------------------------------
INSERT INTO `products`
    (`category_id`, `name`, `description`, `original_price`, `promo_price`, `stock_quantity`, `image_url`, `lot_in_date`, `expiry_date`) VALUES
(1, 'ผักคะน้า (Chinese Broccoli)', 'ผักคะน้า (Chinese Broccoli) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 25, NULL, 48, 'https://placehold.co/400x300?text=Chinese+Broccoli', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(1, 'ผักบุ้งจีน (Water Spinach)', 'ผักบุ้งจีน (Water Spinach) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 15, 14, 26, 'https://placehold.co/400x300?text=Water+Spinach', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(1, 'ผักกวางตุ้ง (Choy Sum)', 'ผักกวางตุ้ง (Choy Sum) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 20, NULL, 90, 'https://placehold.co/400x300?text=Choy+Sum', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(1, 'กะหล่ำปลี (Cabbage)', 'กะหล่ำปลี (Cabbage) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/หัว', 18, 14, 82, 'https://placehold.co/400x300?text=Cabbage', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(1, 'ผักกาดหอม (Lettuce)', 'ผักกาดหอม (Lettuce) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 แพ็ค/แพ็ค', 30, NULL, 55, 'https://placehold.co/400x300?text=Lettuce', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(1, 'ผักชี (Coriander)', 'ผักชี (Coriander) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 10, 9, 46, 'https://placehold.co/400x300?text=Coriander', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(1, 'ตั้งโอ๋ (Garland Chrysanthemum)', 'ตั้งโอ๋ (Garland Chrysanthemum) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 22, NULL, 42, 'https://placehold.co/400x300?text=Garland+Chrysanthemum', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(1, 'ขึ้นฉ่าย (Celery)', 'ขึ้นฉ่าย (Celery) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 20, 16, 128, 'https://placehold.co/400x300?text=Celery', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(1, 'ผักโขม (Spinach)', 'ผักโขม (Spinach) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 28, NULL, 27, 'https://placehold.co/400x300?text=Spinach', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(1, 'ชะอม (Acacia)', 'ชะอม (Acacia) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 25, 20, 43, 'https://placehold.co/400x300?text=Acacia', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(2, 'มะเขือเทศ (Tomato)', 'มะเขือเทศ (Tomato) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 30, NULL, 79, 'https://placehold.co/400x300?text=Tomato', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'พริกขี้หนู (Chili)', 'พริกขี้หนู (Chili) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 60, 54, 149, 'https://placehold.co/400x300?text=Chili', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'แตงกวา (Cucumber)', 'แตงกวา (Cucumber) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 15, NULL, 26, 'https://placehold.co/400x300?text=Cucumber', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'ฟักทอง (Pumpkin)', 'ฟักทอง (Pumpkin) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ชิ้น', 25, 22, 70, 'https://placehold.co/400x300?text=Pumpkin', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'มะเขือเปราะ (Thai Eggplant)', 'มะเขือเปราะ (Thai Eggplant) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 20, NULL, 127, 'https://placehold.co/400x300?text=Thai+Eggplant', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'บวบเหลี่ยม (Angled Gourd)', 'บวบเหลี่ยม (Angled Gourd) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 18, 15, 76, 'https://placehold.co/400x300?text=Angled+Gourd', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'มะระขี้นก (Bitter Cucumber)', 'มะระขี้นก (Bitter Cucumber) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 22, NULL, 91, 'https://placehold.co/400x300?text=Bitter+Cucumber', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'ฟักเขียว (Winter Melon)', 'ฟักเขียว (Winter Melon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ชิ้น', 15, 12, 21, 'https://placehold.co/400x300?text=Winter+Melon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'มะเขือยาว (Long Eggplant)', 'มะเขือยาว (Long Eggplant) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 20, NULL, 128, 'https://placehold.co/400x300?text=Long+Eggplant', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'พริกหยวก (Bell Pepper)', 'พริกหยวก (Bell Pepper) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 50, 42, 107, 'https://placehold.co/400x300?text=Bell+Pepper', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(3, 'บรอกโคลี (Broccoli)', 'บรอกโคลี (Broccoli) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/หัว', 45, NULL, 59, 'https://placehold.co/400x300?text=Broccoli', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(3, 'กะหล่ำดอก (Cauliflower)', 'กะหล่ำดอก (Cauliflower) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/หัว', 40, 34, 75, 'https://placehold.co/400x300?text=Cauliflower', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(3, 'ดอกแค (Agasta Flower)', 'ดอกแค (Agasta Flower) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 35, NULL, 46, 'https://placehold.co/400x300?text=Agasta+Flower', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(3, 'ดอกโสน (Sesbania Flower)', 'ดอกโสน (Sesbania Flower) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 35, 30, 43, 'https://placehold.co/400x300?text=Sesbania+Flower', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(3, 'ดอกขจร (Cowslip Creeper)', 'ดอกขจร (Cowslip Creeper) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 50, NULL, 44, 'https://placehold.co/400x300?text=Cowslip+Creeper', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(3, 'ดอกกุยช่าย (Chive Flower)', 'ดอกกุยช่าย (Chive Flower) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 30, 26, 111, 'https://placehold.co/400x300?text=Chive+Flower', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(3, 'ดอกหอม (Allium Onion Flower)', 'ดอกหอม (Allium Onion Flower) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 40, NULL, 87, 'https://placehold.co/400x300?text=Allium+Onion+Flower', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(3, 'ดอกสะเดา (Neem Flower)', 'ดอกสะเดา (Neem Flower) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 35, 32, 31, 'https://placehold.co/400x300?text=Neem+Flower', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(3, 'ดอกผักกวางตุ้ง (Flowering Cabbage)', 'ดอกผักกวางตุ้ง (Flowering Cabbage) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 30, NULL, 137, 'https://placehold.co/400x300?text=Flowering+Cabbage', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(3, 'หัวปลี (Banana Blossom)', 'หัวปลี (Banana Blossom) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 หัว/หัว', 20, 17, 51, 'https://placehold.co/400x300?text=Banana+Blossom', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY)),
(4, 'ถั่วฝักยาว (Yardlong Bean)', 'ถั่วฝักยาว (Yardlong Bean) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/มัด', 25, NULL, 40, 'https://placehold.co/400x300?text=Yardlong+Bean', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(4, 'ถั่วลันเตา (Pea)', 'ถั่วลันเตา (Pea) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 60, 54, 95, 'https://placehold.co/400x300?text=Pea', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(4, 'ข้าวโพดฝักอ่อน (Baby Corn)', 'ข้าวโพดฝักอ่อน (Baby Corn) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 10 ฝัก/แพ็ค', 35, NULL, 112, 'https://placehold.co/400x300?text=Baby+Corn', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(4, 'ข้าวโพดหวาน (Sweet Corn)', 'ข้าวโพดหวาน (Sweet Corn) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 3 ฝัก/มัด', 15, 14, 69, 'https://placehold.co/400x300?text=Sweet+Corn', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(4, 'ถั่วพู (Winged Bean)', 'ถั่วพู (Winged Bean) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 30, NULL, 37, 'https://placehold.co/400x300?text=Winged+Bean', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(4, 'กระเจี๊ยบเขียว (Okra)', 'กระเจี๊ยบเขียว (Okra) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 30, 27, 31, 'https://placehold.co/400x300?text=Okra', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(4, 'ถั่วแขก (Bush Bean)', 'ถั่วแขก (Bush Bean) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 35, NULL, 78, 'https://placehold.co/400x300?text=Bush+Bean', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(4, 'สะตอ (Bitter Bean)', 'สะตอ (Bitter Bean) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 80, 64, 94, 'https://placehold.co/400x300?text=Bitter+Bean', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(4, 'ถั่วแระญี่ปุ่น (Edamame)', 'ถั่วแระญี่ปุ่น (Edamame) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 แพ็ค/แพ็ค', 60, NULL, 79, 'https://placehold.co/400x300?text=Edamame', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(4, 'มะรุม (Drumstick Pod)', 'มะรุม (Drumstick Pod) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/มัด', 25, 21, 45, 'https://placehold.co/400x300?text=Drumstick+Pod', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(5, 'แครอต (Carrot)', 'แครอต (Carrot) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 30, NULL, 91, 'https://placehold.co/400x300?text=Carrot', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(5, 'หัวไชเท้า (White Radish)', 'หัวไชเท้า (White Radish) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 20, 18, 136, 'https://placehold.co/400x300?text=White+Radish', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(5, 'มันฝรั่ง (Potato)', 'มันฝรั่ง (Potato) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 35, NULL, 113, 'https://placehold.co/400x300?text=Potato', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(5, 'มันเทศ (Sweet Potato)', 'มันเทศ (Sweet Potato) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 30, 26, 61, 'https://placehold.co/400x300?text=Sweet+Potato', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(5, 'เผือก (Taro)', 'เผือก (Taro) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 40, NULL, 110, 'https://placehold.co/400x300?text=Taro', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(5, 'บีตรูต (Beetroot)', 'บีตรูต (Beetroot) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 45, 40, 73, 'https://placehold.co/400x300?text=Beetroot', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(5, 'มันแกว (Jicama)', 'มันแกว (Jicama) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 25, NULL, 88, 'https://placehold.co/400x300?text=Jicama', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(5, 'ขิง (Ginger)', 'ขิง (Ginger) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 50, 45, 38, 'https://placehold.co/400x300?text=Ginger', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(5, 'ข่า (Galangal)', 'ข่า (Galangal) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 40, NULL, 63, 'https://placehold.co/400x300?text=Galangal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(5, 'กระชาย (Fingerroot)', 'กระชาย (Fingerroot) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 60, 48, 82, 'https://placehold.co/400x300?text=Fingerroot', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'หอมแดง (Shallot)', 'หอมแดง (Shallot) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 60, NULL, 138, 'https://placehold.co/400x300?text=Shallot', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'หอมหัวใหญ่ (Onion)', 'หอมหัวใหญ่ (Onion) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 35, 30, 117, 'https://placehold.co/400x300?text=Onion', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'กระเทียม (Garlic)', 'กระเทียม (Garlic) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 70, NULL, 76, 'https://placehold.co/400x300?text=Garlic', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'ต้นหอม (Green Onion)', 'ต้นหอม (Green Onion) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 5 ต้น/มัด', 10, 8, 103, 'https://placehold.co/400x300?text=Green+Onion', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'กุยช่ายขาว (White Chive)', 'กุยช่ายขาว (White Chive) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 25, NULL, 78, 'https://placehold.co/400x300?text=White+Chive', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'หอมแบ่ง (Bunching Onion)', 'หอมแบ่ง (Bunching Onion) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 20, 17, 28, 'https://placehold.co/400x300?text=Bunching+Onion', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'กระเทียมต้น (Leek)', 'กระเทียมต้น (Leek) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 30, NULL, 122, 'https://placehold.co/400x300?text=Leek', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'ต้นกระเทียมใบ (Garlic Chives)', 'ต้นกระเทียมใบ (Garlic Chives) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 25, 20, 88, 'https://placehold.co/400x300?text=Garlic+Chives', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'หน่อไม้ฝรั่ง (Asparagus)', 'หน่อไม้ฝรั่ง (Asparagus) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 90, NULL, 74, 'https://placehold.co/400x300?text=Asparagus', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(6, 'เซเลอรี (ก้านโคน) (Bulb Celery)', 'เซเลอรี (ก้านโคน) (Bulb Celery) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กำ/กำ', 35, 28, 100, 'https://placehold.co/400x300?text=Bulb+Celery', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(7, 'มะม่วง (Mango)', 'มะม่วง (Mango) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 60, NULL, 147, 'https://placehold.co/400x300?text=Mango', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(7, 'ทุเรียน (Durian)', 'ทุเรียน (Durian) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 ลูก/ลูก', 250, 225, 121, 'https://placehold.co/400x300?text=Durian', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(7, 'มังคุด (Mangosteen)', 'มังคุด (Mangosteen) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 70, NULL, 137, 'https://placehold.co/400x300?text=Mangosteen', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(7, 'เงาะ (Rambutan)', 'เงาะ (Rambutan) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 50, 42, 56, 'https://placehold.co/400x300?text=Rambutan', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(7, 'สับปะรด (Pineapple)', 'สับปะรด (Pineapple) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 ลูก/ลูก', 35, NULL, 55, 'https://placehold.co/400x300?text=Pineapple', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(7, 'มะละกอ (Papaya)', 'มะละกอ (Papaya) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ลูก', 30, 27, 83, 'https://placehold.co/400x300?text=Papaya', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(7, 'กล้วยน้ำว้า (Cultivated Banana)', 'กล้วยน้ำว้า (Cultivated Banana) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 หวี/หวี', 25, NULL, 87, 'https://placehold.co/400x300?text=Cultivated+Banana', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(7, 'ลำไย (Longan)', 'ลำไย (Longan) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 60, 54, 129, 'https://placehold.co/400x300?text=Longan', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(7, 'ลิ้นจี่ (Lychee)', 'ลิ้นจี่ (Lychee) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 90, NULL, 122, 'https://placehold.co/400x300?text=Lychee', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(7, 'ฝรั่ง (Guava)', 'ฝรั่ง (Guava) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 30, 24, 112, 'https://placehold.co/400x300?text=Guava', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(8, 'แอปเปิ้ล (Apple)', 'แอปเปิ้ล (Apple) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 80, NULL, 55, 'https://placehold.co/400x300?text=Apple', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'สตรอว์เบอร์รี (Strawberry)', 'สตรอว์เบอร์รี (Strawberry) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 แพ็ค/แพ็ค', 120, 102, 150, 'https://placehold.co/400x300?text=Strawberry', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'องุ่น (Grape)', 'องุ่น (Grape) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 150, NULL, 43, 'https://placehold.co/400x300?text=Grape', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'บลูเบอร์รี (Blueberry)', 'บลูเบอร์รี (Blueberry) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 แพ็ค/แพ็ค', 200, 160, 32, 'https://placehold.co/400x300?text=Blueberry', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'เชอร์รี (Cherry)', 'เชอร์รี (Cherry) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 250, NULL, 59, 'https://placehold.co/400x300?text=Cherry', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'พีช (ลูกท้อ) (Peach)', 'พีช (ลูกท้อ) (Peach) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 100, 90, 60, 'https://placehold.co/400x300?text=Peach', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'สาลี่ (Chinese Pear)', 'สาลี่ (Chinese Pear) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 60, NULL, 128, 'https://placehold.co/400x300?text=Chinese+Pear', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'กีวี่ (Kiwi)', 'กีวี่ (Kiwi) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 90, 76, 36, 'https://placehold.co/400x300?text=Kiwi', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'ลูกพลับ (Persimmon)', 'ลูกพลับ (Persimmon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 70, NULL, 117, 'https://placehold.co/400x300?text=Persimmon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(8, 'ราสเบอร์รี (Raspberry)', 'ราสเบอร์รี (Raspberry) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 แพ็ค/แพ็ค', 220, 198, 139, 'https://placehold.co/400x300?text=Raspberry', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(9, 'ส้มสายน้ำผึ้ง (Tangerine)', 'ส้มสายน้ำผึ้ง (Tangerine) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 60, NULL, 84, 'https://placehold.co/400x300?text=Tangerine', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(9, 'ส้มโอ (Pomelo)', 'ส้มโอ (Pomelo) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 ลูก/ลูก', 50, 45, 22, 'https://placehold.co/400x300?text=Pomelo', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(9, 'มะนาว (Lime)', 'มะนาว (Lime) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 40, NULL, 49, 'https://placehold.co/400x300?text=Lime', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(9, 'เลมอน (Lemon)', 'เลมอน (Lemon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 80, 72, 88, 'https://placehold.co/400x300?text=Lemon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(9, 'ส้มแมนดาริน (Mandarin Orange)', 'ส้มแมนดาริน (Mandarin Orange) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 70, NULL, 107, 'https://placehold.co/400x300?text=Mandarin+Orange', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(9, 'ส้มจี๊ด (Kumquat)', 'ส้มจี๊ด (Kumquat) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 90, 76, 48, 'https://placehold.co/400x300?text=Kumquat', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(9, 'มะกรูด (Leech Lime)', 'มะกรูด (Leech Lime) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 50, NULL, 131, 'https://placehold.co/400x300?text=Leech+Lime', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(9, 'เกรปฟรุต (Grapefruit)', 'เกรปฟรุต (Grapefruit) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 ลูก/ลูก', 75, 64, 60, 'https://placehold.co/400x300?text=Grapefruit', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(9, 'ส้มเช้ง (Sweet Orange)', 'ส้มเช้ง (Sweet Orange) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 65, NULL, 20, 'https://placehold.co/400x300?text=Sweet+Orange', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(9, 'ส้มยูสุ (Yuzu)', 'ส้มยูสุ (Yuzu) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 180, 162, 87, 'https://placehold.co/400x300?text=Yuzu', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(10, 'แตงโม (Watermelon)', 'แตงโม (Watermelon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ลูก', 20, NULL, 65, 'https://placehold.co/400x300?text=Watermelon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(10, 'แคนตาลูป (Cantaloupe)', 'แคนตาลูป (Cantaloupe) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 ลูก/ลูก', 45, 36, 149, 'https://placehold.co/400x300?text=Cantaloupe', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(10, 'เมลอนญี่ปุ่น (Japanese Melon)', 'เมลอนญี่ปุ่น (Japanese Melon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 ลูก/ลูก', 199, NULL, 96, 'https://placehold.co/400x300?text=Japanese+Melon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(10, 'แตงไทย (Thai Melon)', 'แตงไทย (Thai Melon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 ลูก/ลูก', 25, 22, 149, 'https://placehold.co/400x300?text=Thai+Melon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(10, 'แตงโมเหลือง (Yellow Watermelon)', 'แตงโมเหลือง (Yellow Watermelon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ลูก', 30, NULL, 70, 'https://placehold.co/400x300?text=Yellow+Watermelon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(10, 'แตงธิเบต (แตงฮามี่) (Hami Melon)', 'แตงธิเบต (แตงฮามี่) (Hami Melon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 ลูก/ลูก', 80, 68, 59, 'https://placehold.co/400x300?text=Hami+Melon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(10, 'เมลอนฮันนีดิว (Honeydew Melon)', 'เมลอนฮันนีดิว (Honeydew Melon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 ลูก/ลูก', 70, NULL, 61, 'https://placehold.co/400x300?text=Honeydew+Melon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(10, 'แตงกวาเม็กซิกัน (Cucamelon)', 'แตงกวาเม็กซิกัน (Cucamelon) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 แพ็ค/แพ็ค', 150, 135, 20, 'https://placehold.co/400x300?text=Cucamelon', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(10, 'ฟักทองบัตเตอร์นัท (Butternut Squash)', 'ฟักทองบัตเตอร์นัท (Butternut Squash) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ลูก', 45, NULL, 102, 'https://placehold.co/400x300?text=Butternut+Squash', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(10, 'แตงกวาญี่ปุ่น (Japanese Cucumber)', 'แตงกวาญี่ปุ่น (Japanese Cucumber) สดคุณภาพดีจาก Smartket-Farm ร้านค้าปลีกผักและผลไม้สด คัดสรรจากเกษตรกรในชุมชน จำหน่าย 1 กิโลกรัม/ถุง', 35, 28, 145, 'https://placehold.co/400x300?text=Japanese+Cucumber', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY));

-- ----------------------------------------------------------
-- 2.4 ตั้งค่าสินค้าขายดี (is_best_seller) ตัวอย่าง
-- ----------------------------------------------------------
UPDATE `products` SET `is_best_seller` = TRUE
WHERE `name` IN (
    'ผักคะน้า (Chinese Broccoli)',
    'มะเขือเทศ (Tomato)',
    'แครอต (Carrot)',
    'มะม่วง (Mango)',
    'แตงโม (Watermelon)',
    'สตรอว์เบอร์รี (Strawberry)'
);

-- ----------------------------------------------------------
-- 2.5 แบนเนอร์ตัวอย่าง
-- ----------------------------------------------------------
INSERT INTO `banners` (`title`, `image_url`, `link_to_product_id`, `is_active`) VALUES
('เทศกาลผลไม้หน้าร้อน ลด 10%', 'https://placehold.co/1200x400?text=Summer+Fruit+Festival', (SELECT id FROM products WHERE name = 'มะม่วง (Mango)'), TRUE),
('ผักสดจากชุมชน คัดพิเศษทุกวัน', 'https://placehold.co/1200x400?text=Fresh+Veggies+Daily', (SELECT id FROM products WHERE name = 'ผักคะน้า (Chinese Broccoli)'), TRUE);
