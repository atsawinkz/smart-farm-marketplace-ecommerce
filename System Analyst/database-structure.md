# โครงสร้างฐานข้อมูล Smart-Farm Marketplace E-commerce

> เอกสารนี้ใช้อธิบายโครงสร้างฐานข้อมูลทั้งหมดของระบบ Smart-Farm Marketplace สำหรับให้ทีมโปรแกรมเมอร์นำไปสร้าง Database จริง

---

## 1. ตาราง `users` (ระบบสมาชิกและสิทธิ์)

| Field          | Type                  | Constraint                        | คำอธิบาย                                  |
| -------------- | --------------------- | --------------------------------- | ----------------------------------------- |
| `id`           | INT                   | PK, Auto Increment                | รหัสผู้ใช้งาน                              |
| `username`     | VARCHAR(255)          | NOT NULL, UNIQUE                  | ชื่อผู้ใช้สำหรับล็อกอิน                      |
| `password`     | VARCHAR(255)          | NOT NULL                          | รหัสผ่าน (ที่ต้องเข้ารหัส/hash ก่อนบันทึก)   |
| `name`         | VARCHAR(255)          | NOT NULL                          | ชื่อ-นามสกุลจริง                           |
| `email`        | VARCHAR(255)          | NOT NULL, UNIQUE                  | อีเมล                                     |
| `phone`        | VARCHAR(20)           |                                   | เบอร์โทรศัพท์                               |
| `role`         | ENUM('admin','customer') | NOT NULL, DEFAULT 'customer'   | แยกสิทธิ์แอดมินและลูกค้า                    |

### ความสัมพันธ์
- เป็นตารางหลักที่ตาราง `orders` เชื่อมต่อผ่าน `user_id`

---

## 2. ตาราง `categories` (หมวดหมู่สินค้า)

| Field       | Type                          | Constraint             | คำอธิบาย                                                      |
| ----------- | ----------------------------- | ---------------------- | ------------------------------------------------------------- |
| `id`        | INT                           | PK, Auto Increment     | รหัสหมวดหมู่                                                   |
| `name`      | VARCHAR(255)                  | NOT NULL               | ชื่อหมวดหมู่ย่อย (เช่น ผักใบเขียว, ผักผลไม้ตระกูลเบอร์รี่)       |
| `main_type` | ENUM('vegetable','fruit')     | NOT NULL               | แยกกลุ่มใหญ่ "ผัก" หรือ "ผลไม้"                                  |

### ตัวอย่างข้อมูล
| id | name                      | main_type  |
|----|---------------------------|------------|
| 1  | ผักใบเขียว                 | vegetable  |
| 2  | ผัก/root                  | vegetable  |
| 3  | ผักฝัก/ฝัก                 | vegetable  |
| 4  | ผักผลไม้ตระกูลเบอร์รี่       | vegetable  |
| 5  | ผักหัว                     | vegetable  |
| 6  | ผักเครื่องเทศ/สมุนไพร       | vegetable  |
| 7  | ผลไม้ตระกูลเบอร์รี่          | fruit      |
| 8  | ผลไม้ตระกูลเมลอน             | fruit      |
| 9  | ผลไม้ตระกูลส้ม               | fruit      |
| 10 | ผลไม้เขตร้อน                 | fruit      |

### ความสัมพันธ์
- เป็นตารางแม่ที่ตาราง `products` เชื่อมต่อผ่าน `category_id`

---

## 3. ตาราง `products` (รายละเอียดสินค้าเกษตร)

| Field            | Type               | Constraint              | คำอธิบาย                                    |
| ---------------- | ------------------ | ----------------------- | ------------------------------------------- |
| `id`             | INT                | PK, Auto Increment      | รหัสสินค้า                                  |
| `category_id`    | INT                | FK → categories(id)     | เชื่อมไปตารางประเภทสินค้า                     |
| `name`           | VARCHAR(255)       | NOT NULL                | ชื่อสินค้า (เช่น ผักกาด, เมลอน)              |
| `description`    | TEXT               |                         | รายละเอียดสินค้า                              |
| `price`          | DECIMAL(10,2)      | NOT NULL                | ราคาสินค้า                                   |
| `stock_quantity` | INT                | NOT NULL, DEFAULT 0     | จำนวนสินค้าในสต๊อก (แอดมินแก้ไขเพิ่ม-ลดได้)    |
| `image_url`      | VARCHAR(500)       |                         | ลิงก์รูปภาพสินค้า                             |

### ความสัมพันธ์
- FK `category_id` → `categories.id` (Many-to-One)
- เป็นตารางแม่ที่ตาราง `order_details` เชื่อมต่อผ่าน `product_id`

---

## 4. ตาราง `orders` (ข้อมูลการซื้อขายรวม)

| Field         | Type                                       | Constraint            | คำอธิบาย                                                         |
| ------------- | ------------------------------------------ | --------------------- | ---------------------------------------------------------------- |
| `id`          | INT                                        | PK, Auto Increment    | รหัสใบสั่งซื้อ                                                    |
| `user_id`     | INT                                        | FK → users(id)        | ลูกค้าคนไหนเป็นคนซื้อ                                             |
| `total_price` | DECIMAL(10,2)                              | NOT NULL              | ยอดรวมเงินทั้งหมด (ดึงไปทำกราฟแดชบอร์ด)                            |
| `status`      | ENUM('pending','paid','shipped','cancelled') | NOT NULL, DEFAULT 'pending' | สถานะออเดอร์                                              |
| `order_date`  | DATETIME                                   | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันที่และเวลาที่เกิดการซื้อ (ใช้กรองยอดขายบนแดชบอร์ด เช่น ดูยอดวันนี้หรือเดือนนี้) |

### ความสัมพันธ์
- FK `user_id` → `users.id` (Many-to-One)
- เป็นตารางแม่ที่ตาราง `order_details` เชื่อมต่อผ่าน `order_id`

### สถานะออเดอร์ (Status Flow)
```
pending → paid → shipped
    └→ cancelled
```

---

## 5. ตาราง `order_details` (รายการสินค้าข้างในออเดอร์)

| Field            | Type            | Constraint              | คำอธิบาย                                          |
| ---------------- | --------------- | ----------------------- | ------------------------------------------------- |
| `id`             | INT             | PK, Auto Increment      | รหัสรายการ                                         |
| `order_id`       | INT             | FK → orders(id)         | เชื่อมกับตาราง orders                              |
| `product_id`     | INT             | FK → products(id)       | เชื่อมกับตาราง products                            |
| `quantity`       | INT             | NOT NULL                | จำนวนที่ซื้อ (ใช้บวกกันเพื่อหาว่าชิ้นไหนขายดีที่สุด)  |
| `price_per_unit` | DECIMAL(10,2)   | NOT NULL                | ราคาขาย ณ ตอนนั้น (เก็บsnapshot ราคาตอนสั่งซื้อ)      |

### ความสัมพันธ์
- FK `order_id` → `orders.id` (Many-to-One)
- FK `product_id` → `products.id` (Many-to-One)

### หมายเหตุ
- ตารางนี้เป็น **junction table** ระหว่าง `orders` กับ `products` (Many-to-Many)
- `price_per_unit` เก็บราคา ณ ตอนสั่งซื้อ เพื่อให้ย้อนดูราคา.history ได้即使ภายหลังสินค้าราคาเปลี่ยน

---

## 6. ตาราง `banners` (รูปโปรโมชั่นหน้าแรก)

| Field       | Type         | Constraint             | คำอธิบาย                                  |
| ----------- | ------------ | ---------------------- | ----------------------------------------- |
| `id`        | INT          | PK, Auto Increment     | รหัสแบนเนอร์                               |
| `title`     | VARCHAR(255) | NOT NULL               | หัวข้อโปรโมชั่น                             |
| `image_url` | VARCHAR(500) | NOT NULL               | ลิงก์รูปภาพแบนเนอร์                          |
| `is_active` | BOOLEAN      | NOT NULL, DEFAULT TRUE | เปิด/ปิดการแสดงผลแบนเนอร์                   |

### หมายเหตุ
- ใช้ `is_active` เพื่อควบคุมการแสดงผลแบนเนอร์บนหน้าแรกโดยไม่ต้องลบข้อมูล

---

## แผนภาพความสัมพันธ์ (ER Diagram)

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    users     │       │     orders       │       │  order_details   │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)      │◄──┐   │ id (PK)          │◄──┐   │ id (PK)          │
│ username     │   │   │ user_id (FK)     │───┘   │ order_id (FK)    │───┐
│ password     │   │   │ total_price      │       │ product_id (FK)  │───┼──┐
│ name         │   └───│ status           │       │ quantity         │   │  │
│ email        │       │ order_date       │       │ price_per_unit   │   │  │
│ phone        │       └──────────────────┘       └──────────────────┘   │  │
│ role         │                                                        │  │
└──────────────┘                                                        │  │
                                                                        │  │
┌──────────────┐       ┌──────────────────┐                             │  │
│  categories  │       │    products      │◄────────────────────────────┘  │
├──────────────┤       ├──────────────────┤                               │
│ id (PK)      │◄──┐   │ id (PK)          │◄──────────────────────────────┘
│ name         │   │   │ category_id (FK) │
│ main_type    │   │   │ name             │
└──────────────┘   │   │ description      │
                   │   │ price            │
                   └───│ stock_quantity   │
                       │ image_url        │
                       └──────────────────┘

┌──────────────┐
│   banners    │
├──────────────┤
│ id (PK)      │
│ title        │
│ image_url    │
│ is_active    │
└──────────────┘
```

---

## SQL สร้างตาราง (Reference)

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer'
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    main_type ENUM('vegetable', 'fruit') NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'pending',
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
```
