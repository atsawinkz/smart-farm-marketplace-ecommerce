-- โครงสร้างฐานข้อมูล Smart-Farm Marketplace E-commerce

-- 1. ตาราง users (ระบบสมาชิกและสิทธิ์)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer'
);

-- 2. ตาราง categories (หมวดหมู่สินค้า)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    main_type ENUM('vegetable', 'fruit') NOT NULL
);

-- 3. ตาราง products (รายละเอียดสินค้าเกษตร)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 4. ตาราง orders (ข้อมูลการซื้อขายรวม)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'pending',
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. ตาราง order_details (รายการสินค้าข้างในออเดอร์)
CREATE TABLE IF NOT EXISTS order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 6. ตาราง banners (รูปโปรโมชั่นหน้าแรก)
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Seed Data (ข้อมูลเริ่มต้นสำหรับการทดสอบ)
INSERT IGNORE INTO categories (id, name, main_type) VALUES
(1, 'ผักใบเขียว', 'vegetable'),
(2, 'ผักกินหัวหรือราก', 'vegetable'),
(3, 'ผักกินฝักและเมล็ด', 'vegetable'),
(4, 'ผักกินผล', 'vegetable'),
(5, 'ผักกินดอก', 'vegetable'),
(6, 'ผลไม้ตระกูลเบอร์รี่', 'fruit'),
(7, 'ผลไม้เมืองร้อน', 'fruit'),
(8, 'ผลไม้เมืองหนาว / นำเข้า', 'fruit'),
(9, 'ตระกูลส้มและมะนาว', 'fruit'),
(10, 'ตระกูลแตง', 'fruit');

INSERT IGNORE INTO products (id, category_id, name, description, price, stock_quantity, image_url) VALUES
(1, 2, 'แครอทออร์แกนิค (500g)', 'แครอทสดใหม่จากสวนเกษตรอินทรีย์ ปลอดภัยไร้สารเคมี', 45.00, 50, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKxj_O4Ii3B1pH-lKpdIhIojjXNi77FbrTSoFU78MU2CLQjedEzYi04cDpNKJ73AQ-DP4v2jZjjjkI9bcaDYWDuKELatvd4BB_oRyvd9JYHXf2yxGtEH3HJLn49XosKoMeLjgaFPnUbxeBVMjMz81dg4y5pCxqgReEOYiW2cYPU4CWzUaNkjjWIGu-xmmWtpU-aRbVcFZIugC_Ieaoq9Ut_GSf-4UJX89mhjq5PmdcudE5AcudyrzIzGwE9ryWhMufvxujSgKPDC71'),
(2, 4, 'มะเขือเทศเชอร์รี่ (250g)', 'มะเขือเทศเชอร์รี่รสหวานอมเปรี้ยว สดกรอบ อุดมด้วยวิตามินซี', 65.00, 30, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2F5eSsHpmqp_ZqzwaZbV3CrjREvmYD9PssxhI9A98bgeYHbNJ9k6nrIGoYWO0XVWibS3k9WYi-N_PFGm0flm-Lzhcqkc3yp1bKPS3G24YwtFe0TwjR1igkPI0CP8jxMB4P39xvvcsits33lQWACcr7N7K1qg3STKYozAmg24QiQ6kk1qg9KfKGncpfqq33fADuH9G1xxYXC49xqEpz2Kx36KWINn7EnVVl3dQVicMcl1YKK3xCM1VMV3HCNPcaPAUMo1RB_4ptLy0'),
(3, 1, 'บรอกโคลีพรีเมียม (1 หัว)', 'บรอกโคลีออร์แกนิคหัวใหญ่ ดอกแน่น กรอบอร่อย', 55.00, 25, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4obRn2UP7lbHZGum891fYJ0X0ThVq6V_dlBkTJtjO7biJlkKKr133g-AM-1ANN2qtRlaANVVlsZTl6yS-9udf9HjV5m0zFhR5CzE0zTqZBZjQjyFwtfb_WCBPKlGuse1KPh_kLfbE3cCuZqD6R1NCT52VfG2-EMDc93KsOuyGLFoTAsp0zx7pHlYSsRH7i_2ZJYoA7N6YvA96_ZAR4kC1Y-Pt0uedz7TH4br370YxAPy1w1wQ1hxQL2LPAIpViVUJ5T8oDX4hyzbG'),
(4, 8, 'แอปเปิ้ลฟูจิ (4 ผล)', 'แอปเปิ้ลฟูจินำเข้า รสหวานกรอบ อร่อยเต็มคำ', 120.00, 15, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDQIVvNMzIAvECEo3B1CKJ4bmveZ3rUy0KurX2geGEvFiLekKmSsU3JJ85evm3ajvjvzQsBTHx1y0VgdLdBRYR2JhnNVxwQSRrAxKRexrblOgFT9gCwOua96FCfhi4dTy85An7lTAYxv4GLiT4ZJbIGC13khMpcxKIr3FYbKE03MzRvwHEV4fSJxc8AGrcznVUyV_MUjkcd1R4acdeV7KYUgxMQFPHFobj4XYN7uVa_l5SlsWteKfLjRgvSfcx4tOKZzNXitfvvbFz');

INSERT IGNORE INTO banners (id, title, image_url, is_active) VALUES
(1, 'Organic Vegetables', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdEyFvY50vwZScc2ZUCyhwxU9gzZgcKJnSglEqWk3CSLKtLjkVzv6D9Gq2uyUqAEvIjfJ9vGfW0-Ht2Gh82V1tKXiunYJfUgEyPDxY7KyDFENqwo6kjX8zLkNF5Va4i_QJWVeU5EZcuYR45mJCw5QDVXuedp2fYeUYr-Rwbvg373vLd_vXDwE-y7VJyy6j0y9E5ratEnCSBjLueaIMlXmC9xUnl02HycAaOkbC1fH-h0LeOmI0SSGo_pP-e05Ehi0Jn4OgtdqowkCp', 1),
(2, 'Seasonal Fruits', 'https://lh3.googleusercontent.com/aida/AP1WRLtPj2-aCOiaTCWwL25YIX8XeMk8m1V5FPr54JCWgxj8Dc99SIvWX7c87M_RyAJIIpJ_QFiy699FNPJS9r4nW_dd8UeEB8kL40lOnqKIqhw_7oJ60mSS_Y-SmKVe2ct5lsv-TdMnaG5DmREcLk0TNEbNEYFg1JwqGZ6AG5nOVtd2ZWjkcF1YN26zlgqMw_DWHk64uxR_WfUchcv8sLyEL3q00RVypNDUcJqCN-rZQT52W33AWJjP320Y4uPX', 1),
(3, 'Farmer with Harvest', 'https://lh3.googleusercontent.com/aida/AP1WRLux-qgrv3qb4wxhBrlNjAX4BGWyuGlcgZTw-Gw_UNXA4KkDCLdm-oawjYwMidrWjuV2zmGSKpd8Hoq-h86EpdYlTcv2WwQVbPc0a6U8TUm_JecTCBa1CsgmUQCF4mYZWSWEs6GGcA3jg-l0ha2RmW_c-3e58tamn9kJbQoLFMOuLi1JhrAPLkz7aI7wPWbDwd0bptTJFkAOC2Dl-W9CD70ckFxXc9RHiYL-xnZTOrSsmZ_5dh7yCpC-RqTN', 1);
