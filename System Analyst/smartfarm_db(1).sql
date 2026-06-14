-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2026 at 08:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `link_to_product_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `image_url`, `link_to_product_id`, `is_active`) VALUES
(1, 'เทศกาลผลไม้หน้าร้อน ลด 10%', 'https://placehold.co/1200x400?text=Summer+Fruit+Festival', NULL, 1),
(2, 'ผักสดจากชุมชน คัดพิเศษทุกวัน', 'https://placehold.co/1200x400?text=Fresh+Veggies+Daily', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `main_type` enum('vegetable','fruit') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `main_type`) VALUES
(1, 'ผักสด\r\n', 'vegetable'),
(2, 'ผลไม้', 'fruit');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','shipped','completed','cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` enum('unpaid','paid') NOT NULL DEFAULT 'unpaid',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
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
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `original_price` int(11) NOT NULL DEFAULT 0 COMMENT 'ราคาก่อนลด (บาทต่อหน่วยจำหน่าย, จำนวนเต็ม)',
  `promo_price` int(11) DEFAULT NULL COMMENT 'ราคาโปรโมชั่น (บาทต่อหน่วยจำหน่าย, จำนวนเต็ม) ถ้าไม่มีโปรเป็น NULL',
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `total_sales` int(11) NOT NULL DEFAULT 0 COMMENT 'จำนวนยอดขายสะสม (ชิ้น)',
  `lot_in_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `original_price`, `promo_price`, `stock_quantity`, `image_url`, `total_sales`, `lot_in_date`, `expiry_date`, `created_at`) VALUES
(101, 1, 'ผักคะน้า (Chinese Broccoli)', '1 กิโลกรัม/ถุง', 25, NULL, 48, '/images/products/คะน้า.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(102, 1, 'ผักบุ้งจีน (Water Spinach)', '1 กิโลกรัม/ถุง', 15, 14, 26, '/images/products/ผักบุ้งจีน.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(103, 1, 'ผักกวางตุ้ง (Choy Sum)', '1 กิโลกรัม/ถุง', 20, NULL, 90, '/images/products/ผักกวางตุ้ง .jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(104, 1, 'กะหล่ำปลี (Cabbage)', '1 กิโลกรัม/หัว', 18, 14, 82, '/images/products/กะหล่ำปลี.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(105, 1, 'ผักกาดหอม (Lettuce)', '1 แพ็ค/แพ็ค', 30, NULL, 55, '/images/products/ผักกาดหอม_ผักสลัด.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(106, 1, 'ผักชี (Coriander)', '1 กำ/กำ', 10, 9, 46, '/images/products/ผักชี.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(107, 1, 'ตั้งโอ๋ (Garland Chrysanthemum)', '1 กำ/กำ', 22, NULL, 42, '/images/products/ตั้งโอ๋.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(108, 1, 'ขึ้นฉ่าย (Celery)', '1 กำ/กำ', 20, 16, 128, '/images/products/ขึ้นฉ่าย.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(109, 1, 'ผักโขม (Spinach)', '1 กิโลกรัม/ถุง', 28, NULL, 27, '/images/products/ผักโขม.jpeg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(110, 1, 'ชะอม (Acacia)', '1 กำ/กำ', 25, 20, 43, '/images/products/ชะอม.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(111, 1, 'มะเขือเทศ (Tomato)', '1 กิโลกรัม/ถุง', 30, NULL, 79, '/images/products/มะเขือเทศ.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(112, 1, 'พริกขี้หนู (Chili)', '1 กิโลกรัม/ถุง', 60, 54, 149, '/images/products/พริกขี้หนู.png', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(113, 1, 'แตงกวา (Cucumber)', '1 กิโลกรัม/ถุง', 15, NULL, 26, '/images/products/แตงกวา.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(114, 1, 'ฟักทอง (Pumpkin)', '1 กิโลกรัม/ชิ้น', 25, 22, 70, '/images/products/ฟักทอง.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(115, 1, 'มะเขือเปราะ (Thai Eggplant)', '1 กิโลกรัม/ถุง', 20, NULL, 127, '/images/products/มะเขือเปราะ.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(116, 1, 'บวบเหลี่ยม (Angled Gourd)', '1 กิโลกรัม/ถุง', 18, 15, 76, '/images/products/บวบเหลี่ยม.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(117, 1, 'มะระขี้นก (Bitter Cucumber)', '1 กิโลกรัม/ถุง', 22, NULL, 91, '/images/products/มะระขี้นก.png', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(118, 1, 'ฟักเขียว (Winter Melon)', '1 กิโลกรัม/ชิ้น', 15, 12, 21, '/images/products/ฟักเขียว.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(119, 1, 'มะเขือยาว (Long Eggplant)', '1 กิโลกรัม/ถุง', 20, NULL, 128, '/images/products/มะเขือยาว.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(120, 1, 'พริกหยวก (Bell Pepper)', '1 กิโลกรัม/ถุง', 50, 42, 107, '/images/products/พริกหยวก.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(121, 1, 'บรอกโคลี (Broccoli)', '1 กิโลกรัม/หัว', 45, NULL, 59, '/images/products/บรอกโคลี.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(122, 1, 'กะหล่ำดอก (Cauliflower)', '1 กิโลกรัม/หัว', 40, 34, 75, '/images/products/กะหล่ำดอก.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(123, 1, 'ดอกแค (Agasta Flower)', '1 กำ/กำ', 35, NULL, 46, '/images/products/ดอกแค.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(124, 1, 'ดอกโสน (Sesbania Flower)', '1 กำ/กำ', 35, 30, 43, '/images/products/ดอกโสน.png', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(125, 1, 'ดอกขจร (Cowslip Creeper)', '1 กำ/กำ', 50, NULL, 44, '/images/products/ดอกขจร.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(126, 1, 'ดอกกุยช่าย (Chive Flower)', '1 กำ/กำ', 30, 26, 111, '/images/products/ดอกกุยช่าย.png', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(127, 1, 'ดอกหอม (Allium Onion Flower)', '1 กำ/กำ', 40, NULL, 87, '/images/products/ดอกหอม.png', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(128, 1, 'ดอกสะเดา (Neem Flower)', '1 กำ/กำ', 35, 32, 31, '/images/products/ดอกสะเดา.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(129, 1, 'ดอกผักกวางตุ้ง (Flowering Cabbage)', '1 กำ/กำ', 30, NULL, 137, '/images/products/ดอกผักกวางตุ้ง.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(130, 1, 'หัวปลี (Banana Blossom)', '1 หัว/หัว', 20, 17, 51, '/images/products/หัวปลี.jpg', 0, '2026-06-12', '2026-06-16', '2026-06-12 13:38:18'),
(131, 1, 'ถั่วฝักยาว (Yardlong Bean)', '1 กิโลกรัม/มัด', 25, NULL, 40, '/images/products/ถั่วฝักยาว.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(132, 1, 'ถั่วลันเตา (Pea)', '1 กิโลกรัม/ถุง', 60, 54, 95, '/images/products/ถั่วลันเตา.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(133, 1, 'ข้าวโพดฝักอ่อน (Baby Corn)', '10 ฝัก/แพ็ค', 35, NULL, 112, '/images/products/ข้าวโพดฝักอ่อน.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(134, 1, 'ข้าวโพดหวาน (Sweet Corn)', '3 ฝัก/มัด', 15, 14, 69, '/images/products/ข้าวโพดหวาน.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(135, 1, 'ถั่วพู (Winged Bean)', '1 กิโลกรัม/ถุง', 30, NULL, 37, '/images/products/ถั่วพู.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(136, 1, 'กระเจี๊ยบเขียว (Okra)', '1 กิโลกรัม/ถุง', 30, 27, 31, '/images/products/กระเจี๊ยบเขียว.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(137, 1, 'ถั่วแขก (Bush Bean)', '1 กิโลกรัม/ถุง', 35, NULL, 78, '/images/products/ถั่วแขก.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(138, 1, 'สะตอ (Bitter Bean)', '1 กิโลกรัม/ถุง', 80, 64, 94, '/images/products/สะตอ.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(139, 1, 'ถั่วแระญี่ปุ่น (Edamame)', '1 แพ็ค/แพ็ค', 60, NULL, 79, '/images/products/ถั่วแระญี่ปุ่น.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(140, 1, 'มะรุม (Drumstick Pod)', '1 กิโลกรัม/มัด', 25, 21, 45, '/images/products/มะรุม.jpg', 0, '2026-06-12', '2026-06-17', '2026-06-12 13:38:18'),
(141, 1, 'แครอต (Carrot)', '1 กิโลกรัม/ถุง', 30, NULL, 91, '/images/products/แครอต.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(142, 1, 'หัวไชเท้า (White Radish)', '1 กิโลกรัม/ถุง', 20, 18, 136, '/images/products/หัวไชเท้า.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(143, 1, 'มันฝรั่ง (Potato)', '1 กิโลกรัม/ถุง', 35, NULL, 113, '/images/products/มันฝรั่ง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(144, 1, 'มันเทศ (Sweet Potato)', '1 กิโลกรัม/ถุง', 30, 26, 61, '/images/products/มันเทศ.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(145, 1, 'เผือก (Taro)', '1 กิโลกรัม/ถุง', 40, NULL, 110, '/images/products/เผือก.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(146, 1, 'บีตรูต (Beetroot)', '1 กิโลกรัม/ถุง', 45, 40, 73, '/images/products/บีตรูต.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(147, 1, 'มันแกว (Jicama)', '1 กิโลกรัม/ถุง', 25, NULL, 88, '/images/products/มันแกว.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(148, 1, 'ขิง (Ginger)', '1 กิโลกรัม/ถุง', 50, 45, 38, '/images/products/ขิง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(149, 1, 'ข่า (Galangal)', '1 กิโลกรัม/ถุง', 40, NULL, 63, '/images/products/ข่า.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(150, 1, 'กระชาย (Fingerroot)', '1 กิโลกรัม/ถุง', 60, 48, 82, '/images/products/กระชาย.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(151, 1, 'หอมแดง (Shallot)', '1 กิโลกรัม/ถุง', 60, NULL, 138, '/images/products/หอมแดง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(152, 1, 'หอมหัวใหญ่ (Onion)', '1 กิโลกรัม/ถุง', 35, 30, 117, '/images/products/หอมหัวใหญ่.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(153, 1, 'กระเทียม (Garlic)', '1 กิโลกรัม/ถุง', 70, NULL, 76, '/images/products/กระเทียม.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(154, 1, 'ต้นหอม (Green Onion)', '5 ต้น/มัด', 10, 8, 103, '/images/products/ต้นหอม.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(155, 1, 'กุยช่ายขาว (White Chive)', '1 กำ/กำ', 25, NULL, 78, '/images/products/กุยช่ายขาว.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(156, 1, 'หอมแบ่ง (Bunching Onion)', '1 กำ/กำ', 20, 17, 28, '/images/products/หอมแบ่ง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(157, 1, 'กระเทียมต้น (Leek)', '1 กำ/กำ', 30, NULL, 122, '/images/products/กระเทียมต้น.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(158, 1, 'ต้นกระเทียมใบ (Garlic Chives)', '1 กำ/กำ', 25, 20, 88, '/images/products/ต้นกระเทียมใบ.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(159, 1, 'หน่อไม้ฝรั่ง (Asparagus)', '1 กิโลกรัม/ถุง', 90, NULL, 74, '/images/products/หน่อไม้ฝรั่ง - ส่วนโคน.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(160, 1, 'เซเลอรี - ส่วนก้านโคน', '1 กำ/กำ', 35, 28, 100, '/images/products/เซเลอรี.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(161, 2, 'มะม่วง (Mango)', '1 กิโลกรัม/ถุง', 60, NULL, 147, '/images/products/มะม่วง.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(162, 2, 'ทุเรียน (Durian)', '1 ลูก/ลูก', 250, 225, 121, '/images/products/ทุเรียน.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(163, 2, 'มังคุด (Mangosteen)', '1 กิโลกรัม/ถุง', 70, NULL, 137, '/images/products/มังคุด.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(164, 2, 'เงาะ (Rambutan)', '1 กิโลกรัม/ถุง', 50, 42, 56, '/images/products/เงาะ.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(165, 2, 'สับปะรด (Pineapple)', '1 ลูก/ลูก', 35, NULL, 55, '/images/products/สัปรด.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(166, 2, 'มะละกอ (Papaya)', '1 กิโลกรัม/ลูก', 30, 27, 83, '/images/products/มะละกอ.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(167, 2, 'กล้วยน้ำว้า (Cultivated Banana)', '1 หหวี้/หวี', 25, NULL, 87, '/images/products/กล้วยหอม.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(168, 2, 'ลำไย (Longan)', '1 กิโลกรัม/ถุง', 60, 54, 129, '/images/products/ลำไย.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(169, 2, 'ลิ้นจี่ (Lychee)', '1 กิโลกรัม/ถุง', 90, NULL, 122, '/images/products/ลิ้นจี่.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(170, 2, 'ฝรั่ง (Guava)', '1 กิโลกรัม/ถุง', 30, 24, 112, '/images/products/ฝรั่ง.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(171, 2, 'แอปเปิ้ล (Apple)', '1 กิโลกรัม/ถุง', 80, NULL, 55, '/images/products/แอปเปิ้ล.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(172, 2, 'สตรอว์เบอร์รี (Strawberry)', '1 แพ็ค/แพ็ค', 120, 102, 150, '/images/products/สตรอว์เบอร์รี.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(173, 2, 'องุ่น (Grape)', '1 กิโลกรัม/ถุง', 150, NULL, 43, '/images/products/องุ่น.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(174, 2, 'บลูเบอร์รี (Blueberry)', '1 แพ็ค/แพ็ค', 200, 160, 32, '/images/products/บลูเบอร์รี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(175, 2, 'เชอร์รี (Cherry)', '1 กิโลกรัม/ถุง', 250, NULL, 59, '/images/products/เชอรี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(176, 2, 'พีช (ลูกท้อ) (Peach)', '1 กิโลกรัม/ถุง', 100, 90, 60, '/images/products/ลูกพีช.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(177, 2, 'สาลี่ (Chinese Pear)', '1 กิโลกรัม/ถุง', 60, NULL, 128, '/images/products/สาลี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(178, 2, 'กีวี่ (Kiwi)', '1 กิโลกรัม/ถุง', 90, 76, 36, '/images/products/กีวี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(179, 2, 'ลูกพลับ (Persimmon)', '1 กิโลกรัม/ถุง', 70, NULL, 117, '/images/products/ลูกพลับ.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(180, 2, 'ราสเบอร์รี (Raspberry)', '1 แพ็ค/แพ็ค', 220, 198, 139, '/images/products/ราสเบอร์รี่.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 13:38:18'),
(181, 2, 'ส้มสายน้ำผึ้ง (Tangerine)', '1 กิโลกรัม/ถุง', 60, NULL, 84, '/images/products/ส้มสายน้ำผึ้ง.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(182, 2, 'ส้มโอ (Pomelo)', '1 ลูก/ลูก', 50, 45, 22, '/images/products/ส้มโอ.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(183, 2, 'มะนาว (Lime)', '1 กิโลกรัม/ถุง', 40, NULL, 49, '/images/products/มะนาว.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(184, 2, 'เลมอน (Lemon)', '1 กิโลกรัม/ถุง', 80, 72, 88, '/images/products/เลม่อน.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(185, 2, 'ส้มแมนดาริน (Mandarin Orange)', '1 กิโลกรัม/ถุง', 70, NULL, 107, '/images/products/ส้มแมนดาริน.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(186, 2, 'ส้มจี๊ด (Kumquat)', '1 กิโลกรัม/ถุง', 90, 76, 48, '/images/products/ส้มจี๊ด.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(187, 2, 'มะกรูด (Leech Lime)', '1 กิโลกรัม/ถุง', 50, NULL, 131, '/images/products/มะกรูด.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(188, 2, 'เกรปฟรุต (Grapefruit)', '1 ลูก/ลูก', 75, 64, 60, '/images/products/เครปฟรุต.jpg', 0, '2026-06-12', '2026-06-26', '2026-06-12 13:38:18'),
(191, 2, 'แตงโม (Watermelon)', '1 กิโลกรัม/ลูก', 20, NULL, 65, '/images/products/แตงโม.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(193, 2, 'เมลอนญี่ปุ่น (Japanese Melon)', '1 ลูก/ลูก', 199, NULL, 96, '/images/products/เมล่อน.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(194, 2, 'แตงไทย (Thai Melon)', '1 ลูก/ลูก', 25, 22, 149, '/images/products/แตงไทย.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(195, 2, 'แตงโมเหลือง (Yellow Watermelon)', '1 กิโลกรัม/ลูก', 30, NULL, 70, '/images/products/แตงโมเหลือง.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(199, 2, 'ฟักทอง (Squash)', '1 กิโลกรัม/ลูก', 45, NULL, 102, '/images/products/ฟักทอง.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(200, 2, 'แตงกวาญี่ปุ่น (Japanese Cucumber)', '1 กิโลกรัม/ถุง', 35, 28, 145, '/images/products/แตงกวา.jpg', 0, '2026-06-12', '2026-06-19', '2026-06-12 13:38:18'),
(201, 2, 'ทับทิม (Pomegranate)', '1 กิโลกรัม/ถุง', 85, NULL, 45, '/images/products/ทับทิม.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 14:01:13'),
(202, 2, 'เสาวรส (Passion Fruit)', '1 กิโลกรัม/ถุง', 65, 59, 60, '/images/products/เสาวรส.jpg', 0, '2026-06-12', '2026-06-22', '2026-06-12 14:01:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
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

INSERT INTO `users` (`id`, `username`, `password`, `name`, `email`, `phone`, `role`, `address`, `subdistrict`, `district`, `province`, `postal_code`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$MlsnCAbYCn/gh/d/tE3opOZHqhBK9303mbjICUpL5zNdWb8U3sVUS', 'ผู้ดูแลระบบ', 'admin@example.com', '0800000000', 'admin', '99/1 อาคาร Smartket-Farm', 'บางรัก', 'บางรัก', 'กรุงเทพมหานคร', '10500', '2026-06-12 12:23:06', '2026-06-12 12:23:06'),
(2, 'user1', '$2b$10$zZ8WzY4BOt2DwyG0uQSJBe703fyls.vWG7uwoh6nxUEbBNzBuYmXW', 'ผู้ใช้งานคนที่ 1', 'user1@example.com', '0811111111', 'customer', '12/5 หมู่ 3 ถนนสุขุมวิท', 'บางนา', 'บางนา', 'กรุงเทพมหานคร', '10260', '2026-06-12 12:23:06', '2026-06-12 12:23:06'),
(3, 'user2', '$2b$10$WlMzsAfxaBwpK4Yi24LrJOwHgbnUodEo9KgGLlpnb32fVTjZJ7SzK', 'ผู้ใช้งานคนที่ 2', 'user2@example.com', '0822222222', 'customer', '88/8 หมู่ 4 ถนนรามคำแหง', 'หัวหมาก', 'บางกะปิ', 'กรุงเทพมหานคร', '10240', '2026-06-12 12:23:06', '2026-06-12 12:23:06'),
(4, 'bowww', '$2b$10$i4gn262P8N.iX2bxTAbTUuzSdHMtRNpiU.rRcPKHjNvPRp2HYEpCe', 'Rattanaporn SIRIFONG', 'rattanaporn.sir@ku.th', '0961902874', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-06-12 12:43:59', '2026-06-12 12:43:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_banners_link_to_product_id` (`link_to_product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orders_user_id` (`user_id`),
  ADD KEY `idx_orders_created_at` (`created_at`),
  ADD KEY `idx_orders_status` (`status`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_details_order_id` (`order_id`),
  ADD KEY `idx_order_details_product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_category_id` (`category_id`),
  ADD KEY `idx_products_is_best_seller` (`total_sales`),
  ADD KEY `idx_products_expiry_date` (`expiry_date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_username` (`username`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `banners`
--
ALTER TABLE `banners`
  ADD CONSTRAINT `fk_banners_product` FOREIGN KEY (`link_to_product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `fk_order_details_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_details_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
