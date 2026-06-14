-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 13, 2026 at 07:54 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartfarm_db`
--
CREATE DATABASE IF NOT EXISTS `smartfarm_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smartfarm_db`;

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'เจ้าของบัญชีที่เพิ่มที่อยู่นี้',
  `recipient_name` varchar(100) NOT NULL COMMENT 'ชื่อผู้รับสินค้า',
  `recipient_phone` varchar(20) NOT NULL COMMENT 'เบอร์โทรผู้รับ',
  `address` varchar(255) NOT NULL COMMENT 'บ้านเลขที่ / หมู่บ้าน / ซอย / ถนน',
  `subdistrict` varchar(100) DEFAULT NULL COMMENT 'ตำบล/แขวง',
  `district` varchar(100) DEFAULT NULL COMMENT 'อำเภอ/เขต',
  `province` varchar(100) DEFAULT NULL COMMENT 'จังหวัด',
  `postal_code` varchar(10) DEFAULT NULL COMMENT 'รหัสไปรษณีย์',
  `is_default` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'ที่อยู่หลักของ user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`address_id`, `user_id`, `recipient_name`, `recipient_phone`, `address`, `subdistrict`, `district`, `province`, `postal_code`, `is_default`) VALUES
(1, 1, 'ผู้ดูแลระบบ', '0800000000', '99/1 อาคาร Smartket-Farm', 'บางรัก', 'บางรัก', 'กรุงเทพมหานคร', '10500', 1),
(2, 2, 'ทดสอบ ใจดี', '0812345678', 't', 'สมเด็จเจ้าพระยา', 'เขตคลองสาน', 'กรุงเทพมหานคร', '10600', 1),
(3, 3, 'ผู้ใช้งานคนที่ 2', '0822222222', '88/8 หมู่ 4 ถนนรามคำแหง', 'หัวหมาก', 'บางกะปิ', 'กรุงเทพมหานคร', '10240', 1),
(4, 5, 'test', '0912345678', 'home', 'home', 'home', 'กรุงเทพมหานคร', '1234', 1),
(5, 7, 'สมคิด ใจดี', '0987654321', 't', 't', 't', 'ชัยนาท', '123', 1);

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `banner_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `link_to_product_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`banner_id`, `title`, `image_url`, `link_to_product_id`, `is_active`) VALUES
(1, 'เทศกาลผลไม้หน้าร้อน ลด 10%', 'https://placehold.co/1200x400?text=Summer+Fruit+Festival', NULL, 1),
(2, 'ผักสดจากชุมชน คัดพิเศษทุกวัน', 'https://placehold.co/1200x400?text=Fresh+Veggies+Daily', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `main_type` enum('vegetable','fruit') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `main_type`) VALUES
(1, 'ผักสด\r\n', 'vegetable'),
(2, 'ผลไม้', 'fruit');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address_id` int(11) DEFAULT NULL COMMENT 'อ้างอิงที่อยู่จัดส่งที่เลือกตอน checkout',
  `shipping_recipient_name` varchar(100) DEFAULT NULL COMMENT 'ชื่อผู้รับ (snapshot ตอนสั่งซื้อ)',
  `shipping_recipient_phone` varchar(20) DEFAULT NULL COMMENT 'เบอร์ผู้รับ (snapshot ตอนสั่งซื้อ)',
  `shipping_address` varchar(255) DEFAULT NULL COMMENT 'ที่อยู่ (snapshot ตอนสั่งซื้อ)',
  `shipping_subdistrict` varchar(100) DEFAULT NULL,
  `shipping_district` varchar(100) DEFAULT NULL,
  `shipping_province` varchar(100) DEFAULT NULL,
  `shipping_postal_code` varchar(10) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','paid','shipped','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `order_detail_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price_per_unit` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `original_price` int(11) NOT NULL DEFAULT 0 COMMENT 'ราคาก่อนลด (บาทต่อหน่วยจำหน่าย, จำนวนเต็ม)',
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `total_sale` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'จำนวนที่ขายไปแล้วทั้งหมด (ใช้คำนวณสินค้าขายดี)',
  `lot_in_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `name`, `description`, `original_price`, `stock_quantity`, `image_url`, `total_sale`, `lot_in_date`, `expiry_date`, `created_at`) VALUES
(101, 1, 'ผักคะน้า (Chinese Broccoli)', '1 กิโลกรัม/ถุง', 25, 48, '/images/products/คะน้า.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(102, 1, 'ผักบุ้งจีน (Water Spinach)', '1 กิโลกรัม/ถุง', 15, 26, '/images/products/ผักบุ้งจีน.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(103, 1, 'ผักกวางตุ้ง (Choy Sum)', '1 กิโลกรัม/ถุง', 20, 90, '/images/products/ผักกวางตุ้ง .jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(104, 1, 'กะหล่ำปลี (Cabbage)', '1 กิโลกรัม/หัว', 18, 82, '/images/products/กะหล่ำปลี.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(105, 1, 'ผักกาดหอม (Lettuce)', '1 แพ็ค/แพ็ค', 30, 55, '/images/products/ผักกาดหอม_ผักสลัด.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(106, 1, 'ผักชี (Coriander)', '1 กำ/กำ', 10, 46, '/images/products/ผักชี.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(107, 1, 'ตั้งโอ๋ (Garland Chrysanthemum)', '1 กำ/กำ', 22, 42, '/images/products/ตั้งโอ๋.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(108, 1, 'ขึ้นฉ่าย (Celery)', '1 กำ/กำ', 20, 128, '/images/products/ขึ้นฉ่าย.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(109, 1, 'ผักโขม (Spinach)', '1 กิโลกรัม/ถุง', 28, 27, '/images/products/ผักโขม.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(110, 1, 'ชะอม (Acacia)', '1 กำ/กำ', 25, 43, '/images/products/ชะอม.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(111, 1, 'มะเขือเทศ (Tomato)', '1 กิโลกรัม/ถุง', 30, 79, '/images/products/มะเขือเทศ.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(112, 1, 'พริกขี้หนู (Chili)', '1 กิโลกรัม/ถุง', 60, 149, '/images/products/พริกขี้หนู.png', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(113, 1, 'แตงกวา (Cucumber)', '1 กิโลกรัม/ถุง', 15, 26, '/images/products/แตงกวา.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(114, 1, 'ฟักทอง (Pumpkin)', '1 กิโลกรัม/ลูก', 25, 70, '/images/products/ฟักทอง.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(115, 1, 'มะเขือเปราะ (Thai Eggplant)', '1 กิโลกรัม/ถุง', 20, 127, '/images/products/มะเขือเปราะ.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(116, 1, 'บวบเหลี่ยม (Angled Gourd)', '1 กิโลกรัม/ถุง', 18, 76, '/images/products/บวบเหลี่ยม.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(117, 1, 'มะระขี้นก (Bitter Cucumber)', '1 กิโลกรัม/ถุง', 22, 91, '/images/products/มะระขี้นก.png', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(118, 1, 'ฟักเขียว (Winter Melon)', '1 กิโลกรัม/ลูก', 15, 21, '/images/products/ฟักเขียว.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(119, 1, 'มะเขือยาว (Long Eggplant)', '1 กิโลกรัม/ถุง', 20, 128, '/images/products/มะเขือยาว.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(120, 1, 'พริกหยวก (Bell Pepper)', '1 กิโลกรัม/ถุง', 50, 107, '/images/products/พริกหยวก.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(121, 1, 'บรอกโคลี (Broccoli)', '1 กิโลกรัม/หัว', 45, 59, '/images/products/บรอกโคลี.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(122, 1, 'กะหล่ำดอก (Cauliflower)', '1 กิโลกรัม/หัว', 40, 75, '/images/products/กะหล่ำดอก.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(123, 1, 'ดอกแค (Agasta Flower)', '1 กำ/กำ', 35, 46, '/images/products/ดอกแค.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(124, 1, 'ดอกโสน (Sesbania Flower)', '1 กำ/กำ', 35, 43, '/images/products/ดอกโสน.png', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(125, 1, 'ดอกขจร (Cowslip Creeper)', '1 กำ/กำ', 50, 44, '/images/products/ดอกขจร.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(126, 1, 'ดอกกุยช่าย (Chive Flower)', '1 กำ/กำ', 30, 111, '/images/products/ดอกกุยช่าย.png', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(127, 1, 'ดอกหอม (Allium Onion Flower)', '1 กำ/กำ', 40, 87, '/images/products/ดอกหอม.png', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(128, 1, 'ดอกสะเดา (Neem Flower)', '1 กำ/กำ', 35, 31, '/images/products/ดอกสะเดา.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(129, 1, 'ดอกผักกวางตุ้ง (Flowering Cabbage)', '1 กำ/กำ', 30, 137, '/images/products/ดอกผักกวางตุ้ง.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(130, 1, 'หัวปลี (Banana Blossom)', '1 หัว/หัว', 20, 51, '/images/products/หัวปลี.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(131, 1, 'ถั่วฝักยาว (Yardlong Bean)', '1 กิโลกรัม/มัด', 25, 40, '/images/products/ถั่วฝักยาว.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(132, 1, 'ถั่วลันเตา (Pea)', '1 กิโลกรัม/ถุง', 60, 95, '/images/products/ถั่วลันเตา.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(133, 1, 'ข้าวโพดฝักอ่อน (Baby Corn)', '10 ฝัก/แพ็ค', 35, 112, '/images/products/ข้าวโพดฝักอ่อน.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(134, 1, 'ข้าวโพดหวาน (Sweet Corn)', '3 ฝัก/มัด', 15, 69, '/images/products/ข้าวโพดหวาน.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(135, 1, 'ถั่วพู (Winged Bean)', '1 กิโลกรัม/ถุง', 30, 37, '/images/products/ถั่วพู.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(136, 1, 'กระเจี๊ยบเขียว (Okra)', '1 กิโลกรัม/ถุง', 30, 31, '/images/products/กระเจี๊ยบเขียว.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(137, 1, 'ถั่วแขก (Bush Bean)', '1 กิโลกรัม/ถุง', 35, 78, '/images/products/ถั่วแขก.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(138, 1, 'สะตอ (Bitter Bean)', '1 กิโลกรัม/ถุง', 80, 94, '/images/products/สะตอ.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(139, 1, 'ถั่วแระญี่ปุ่น (Edamame)', '1 แพ็ค/แพ็ค', 60, 79, '/images/products/ถั่วแระญี่ปุ่น.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(140, 1, 'มะรุม (Drumstick Pod)', '1 กิโลกรัม/มัด', 25, 45, '/images/products/มะรุม.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(141, 1, 'แครอต (Carrot)', '1 กิโลกรัม/ถุง', 30, 91, '/images/products/แครอต.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(142, 1, 'หัวไชเท้า (White Radish)', '1 กิโลกรัม/ถุง', 20, 136, '/images/products/หัวไชเท้า.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(143, 1, 'มันฝรั่ง (Potato)', '1 กิโลกรัม/ถุง', 35, 113, '/images/products/มันฝรั่ง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(144, 1, 'มันเทศ (Sweet Potato)', '1 กิโลกรัม/ถุง', 30, 61, '/images/products/มันเทศ.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(145, 1, 'เผือก (Taro)', '1 กิโลกรัม/ถุง', 40, 110, '/images/products/เผือก.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(146, 1, 'บีตรูต (Beetroot)', '1 กิโลกรัม/ถุง', 45, 73, '/images/products/บีตรูต.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(147, 1, 'มันแกว (Jicama)', '1 กิโลกรัม/ถุง', 25, 88, '/images/products/มันแกว.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(148, 1, 'ขิง (Ginger)', '1 กิโลกรัม/ถุง', 50, 38, '/images/products/ขิง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(149, 1, 'ข่า (Galangal)', '1 กิโลกรัม/ถุง', 40, 63, '/images/products/ข่า.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(150, 1, 'กระชาย (Fingerroot)', '1 กิโลกรัม/ถุง', 60, 82, '/images/products/กระชาย.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(151, 1, 'หอมแดง (Shallot)', '1 กิโลกรัม/ถุง', 60, 138, '/images/products/หอมแดง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(152, 1, 'หอมหัวใหญ่ (Onion)', '1 กิโลกรัม/ถุง', 35, 117, '/images/products/หอมหัวใหญ่.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(153, 1, 'กระเทียม (Garlic)', '1 กิโลกรัม/ถุง', 70, 76, '/images/products/กระเทียม.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(154, 1, 'ต้นหอม (Green Onion)', '5 ต้น/มัด', 10, 103, '/images/products/ต้นหอม.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(155, 1, 'กุยช่ายขาว (White Chive)', '1 กำ/กำ', 25, 78, '/images/products/กุยช่ายขาว.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(156, 1, 'หอมแบ่ง (Bunching Onion)', '1 กำ/กำ', 20, 28, '/images/products/หอมแบ่ง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(157, 1, 'กระเทียมต้น (Leek)', '1 กำ/กำ', 30, 122, '/images/products/กระเทียมต้น.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(158, 1, 'ต้นกระเทียมใบ (Garlic Chives)', '1 กำ/กำ', 25, 88, '/images/products/ต้นกระเทียมใบ.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(159, 1, 'หน่อไม้ฝรั่ง (Asparagus)', '1 กิโลกรัม/ถุง', 90, 74, '/images/products/หน่อไม้ฝรั่ง - ส่วนโคน.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(160, 1, 'เซเลอรี - ส่วนก้านโคน', '1 กำ/กำ', 35, 100, '/images/products/เซเลอรี.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(161, 2, 'มะม่วง (Mango)', '1 กิโลกรัม/ถุง', 60, 147, '/images/products/มะม่วง.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(162, 2, 'ทุเรียน (Durian)', '1 ลูก/ลูก', 250, 121, '/images/products/ทุเรียน.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(163, 2, 'มังคุด (Mangosteen)', '1 กิโลกรัม/ถุง', 70, 137, '/images/products/มังคุด.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(164, 2, 'เงาะ (Rambutan)', '1 กิโลกรัม/ถุง', 50, 56, '/images/products/เงาะ.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(165, 2, 'สับปะรด (Pineapple)', '1 ลูก/ลูก', 35, 55, '/images/products/สัปรด.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(166, 2, 'มะละกอ (Papaya)', '1 กิโลกรัม/ลูก', 30, 83, '/images/products/มะละกอ.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(167, 2, 'กล้วยน้ำว้า (Cultivated Banana)', '1 หวี้/หวี', 25, 87, '/images/products/กล้วยหอม.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(168, 2, 'ลำไย (Longan)', '1 กิโลกรัม/ถุง', 60, 129, '/images/products/ลำไย.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(169, 2, 'ลิ้นจี่ (Lychee)', '1 กิโลกรัม/ถุง', 90, 122, '/images/products/ลิ้นจี่.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(170, 2, 'ฝรั่ง (Guava)', '1 กิโลกรัม/ถุง', 30, 112, '/images/products/ฝรั่ง.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(171, 2, 'แอปเปิ้ล (Apple)', '1 กิโลกรัม/ถุง', 80, 55, '/images/products/แอปเปิ้ล.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(172, 2, 'สตรอว์เบอร์รี (Strawberry)', '1 แพ็ค/แพ็ค', 120, 150, '/images/products/สตรอว์เบอร์รี.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(173, 2, 'องุ่น (Grape)', '1 กิโลกรัม/ถุง', 150, 43, '/images/products/องุ่น.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(174, 2, 'บลูเบอร์รี (Blueberry)', '1 แพ็ค/แพ็ค', 200, 32, '/images/products/บลูเบอร์รี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(175, 2, 'เชอร์รี (Cherry)', '1 กิโลกรัม/ถุง', 250, 59, '/images/products/เชอรี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(176, 2, 'พีช (ลูกท้อ) (Peach)', '1 กิโลกรัม/ถุง', 100, 60, '/images/products/ลูกพีช.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(177, 2, 'สาลี่ (Chinese Pear)', '1 กิโลกรัม/ถุง', 60, 128, '/images/products/สาลี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(178, 2, 'กีวี่ (Kiwi)', '1 กิโลกรัม/ถุง', 90, 36, '/images/products/กีวี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(179, 2, 'ลูกพลับ (Persimmon)', '1 กิโลกรัม/ถุง', 70, 117, '/images/products/ลูกพลับ.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(180, 2, 'ราสเบอร์รี (Raspberry)', '1 แพ็ค/แพ็ค', 220, 139, '/images/products/ราสเบอร์รี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(181, 2, 'ส้มสายน้ำผึ้ง (Tangerine)', '1 กิโลกรัม/ถุง', 60, 84, '/images/products/ส้มสายน้ำผึ้ง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(182, 2, 'ส้มโอ (Pomelo)', '1 ลูก/ลูก', 50, 22, '/images/products/ส้มโอ.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(183, 2, 'มะนาว (Lime)', '1 กิโลกรัม/ถุง', 40, 49, '/images/products/มะนาว.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(184, 2, 'เลมอน (Lemon)', '1 กิโลกรัม/ถุง', 80, 88, '/images/products/เลม่อน.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(185, 2, 'ส้มแมนดาริน (Mandarin Orange)', '1 กิโลกรัม/ถุง', 70, 107, '/images/products/ส้มแมนดาริน.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(186, 2, 'ส้มจี๊ด (Kumquat)', '1 กิโลกรัม/ถุง', 90, 48, '/images/products/ส้มจี๊ด.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(187, 2, 'มะกรูด (Leech Lime)', '1 กิโลกรัม/ถุง', 50, 131, '/images/products/มะกรูด.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(188, 2, 'เกรปฟรุต (Grapefruit)', '1 ลูก/ลูก', 75, 60, '/images/products/เครปฟรุต.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(191, 2, 'แตงโม (Watermelon)', '1 กิโลกรัม/ลูก', 20, 65, '/images/products/แตงโม.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(193, 2, 'เมลอนญี่ปุ่น (Japanese Melon)', '1 ลูก/ลูก', 199, 96, '/images/products/เมล่อน.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(194, 2, 'แตงไทย (Thai Melon)', '1 ลูก/ลูก', 25, 149, '/images/products/แตงไทย.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(195, 2, 'แตงโมเหลือง (Yellow Watermelon)', '1 กิโลกรัม/ลูก', 30, 70, '/images/products/แตงโมเหลือง.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(199, 2, 'ฟักทอง (Squash)', '1 กิโลกรัม/ลูก', 45, 102, '/images/products/ฟักทอง.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(200, 2, 'แตงกวาญี่ปุ่น (Japanese Cucumber)', '1 กิโลกรัม/ถุง', 35, 145, '/images/products/แตงกวา.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(201, 2, 'ทับทิม (Pomegranate)', '1 กิโลกรัม/ถุง', 85, 45, '/images/products/ทับทิม.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 14:01:13'),
(202, 2, 'เสาวรส (Passion Fruit)', '1 กิโลกรัม/ถุง', 65, 60, '/images/products/เสาวรส.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 14:01:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `address` varchar(255) DEFAULT NULL COMMENT 'ที่อยู่ (บ้านเลขที่ / หมู่บ้าน / ซอย / ถนน)',
  `subdistrict` varchar(100) DEFAULT NULL COMMENT 'ตำบล/แขวง',
  `district` varchar(100) DEFAULT NULL COMMENT 'อำเภอ/เขต',
  `province` varchar(100) DEFAULT NULL COMMENT 'จังหวัด',
  `postal_code` varchar(10) DEFAULT NULL COMMENT 'รหัสไปรษณีย์',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `name`, `email`, `phone`, `role`, `address`, `subdistrict`, `district`, `province`, `postal_code`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$MlsnCAbYCn/gh/d/tE3opOZHqhBK9303mbjICUpL5zNdWb8U3sVUS', 'ผู้ดูแลระบบ', 'admin@example.com', '0800000000', 'admin', '99/1 อาคาร Smartket-Farm', 'บางรัก', 'บางรัก', 'กรุงเทพมหานคร', '10500', '2026-06-12 12:23:06', '2026-06-12 12:23:06'),
(2, 'user1', '$2b$10$zZ8WzY4BOt2DwyG0uQSJBe703fyls.vWG7uwoh6nxUEbBNzBuYmXW', 'ทดสอบ ใจดี', 'user1@example.com', '0812345678', 'customer', 't', 'สมเด็จเจ้าพระยา', 'เขตคลองสาน', 'กรุงเทพมหานคร', '10600', '2026-06-12 12:23:06', '2026-06-13 14:00:36'),
(3, 'user2', '$2b$10$WlMzsAfxaBwpK4Yi24LrJOwHgbnUodEo9KgGLlpnb32fVTjZJ7SzK', 'ผู้ใช้งานคนที่ 2', 'user2@example.com', '0822222222', 'customer', '88/8 หมู่ 4 ถนนรามคำแหง', 'หัวหมาก', 'บางกะปิ', 'กรุงเทพมหานคร', '10240', '2026-06-12 12:23:06', '2026-06-12 12:23:06'),
(4, 'bowww', '$2b$10$i4gn262P8N.iX2bxTAbTUuzSdHMtRNpiU.rRcPKHjNvPRp2HYEpCe', 'Rattanaporn SIRIFONG', 'rattanaporn.sir@ku.th', '0961902874', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-06-12 12:43:59', '2026-06-12 12:43:59'),
(5, 'test1', '$2b$10$lpkzu.Txz3PXyDsXREIvLeDjjlaGN6MNE8bPTaNJGYklDNhQjtJEG', 'test', 'test@gmail.com', '0912345678', 'customer', 'home', 'home', 'home', 'กรุงเทพมหานคร', '1234', '2026-06-13 04:19:28', '2026-06-13 04:20:44'),
(6, 'user22', '$2b$10$w3tOxwYtUIvKzGyA9XZNv.JCso7k./oaB6nlZNp9KUov/MQx6qqNa', 'ทดสอบ ใจดี', 'suphinya.k@ku.th', '0912345678', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-06-13 05:11:50', '2026-06-13 05:11:50'),
(7, 'test20', '$2b$10$wMDeu2uSSckrkNbPjZdpDOz5GSYsdZgO0ZUhE.ZJFWhTzqbdcips.', 'สมคิด ใจดี', 'somkidjaidee@gmail.com', '0987654321', 'customer', 't', 't', 't', 'ชัยนาท', '123', '2026-06-13 08:07:25', '2026-06-13 08:08:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `idx_addresses_user_id` (`user_id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`banner_id`),
  ADD KEY `idx_banners_link_to_product_id` (`link_to_product_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD UNIQUE KEY `uq_cart_user_product` (`user_id`,`product_id`),
  ADD KEY `idx_cart_user_id` (`user_id`),
  ADD KEY `idx_cart_product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `idx_orders_user_id` (`user_id`),
  ADD KEY `idx_orders_created_at` (`created_at`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_address_id` (`address_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`order_detail_id`),
  ADD KEY `idx_order_details_order_id` (`order_id`),
  ADD KEY `idx_order_details_product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `idx_products_category_id` (`category_id`),
  ADD KEY `idx_products_expiry_date` (`expiry_date`),
  ADD KEY `idx_products_total_sale` (`total_sale`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `uq_users_username` (`username`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `banner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `order_detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `banners`
--
ALTER TABLE `banners`
  ADD CONSTRAINT `fk_banners_product` FOREIGN KEY (`link_to_product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `fk_order_details_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_details_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
