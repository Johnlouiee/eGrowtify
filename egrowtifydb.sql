-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 11, 2025 at 05:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `egrowtifydb`
--

CREATE DATABASE IF NOT EXISTS `egrowtifydb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `egrowtifydb`;
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(80) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `is_super_admin` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password_hash`, `full_name`, `is_super_admin`, `is_active`, `created_at`, `last_login`) VALUES
(1, 'admin', 'admin@egrowtify.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G', 'System Administrator', 1, 1, '2025-10-09 18:03:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ai_usage_tracking`
--

CREATE TABLE `ai_usage_tracking` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `usage_type` varchar(20) NOT NULL,
  `image_path` varchar(500) DEFAULT NULL,
  `analysis_result` text DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT 0.00,
  `is_free_usage` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ai_usage_tracking`
--

INSERT INTO `ai_usage_tracking` (`id`, `user_id`, `usage_type`, `image_path`, `analysis_result`, `cost`, `is_free_usage`, `created_at`) VALUES
(1, 1, 'plant_analysis', '/uploads/plants/tomato_1.jpg', 'Tomato plant - healthy, needs watering', 0.00, 1, '2025-10-09 18:03:33'),
(2, 1, 'plant_analysis', '/uploads/plants/basil_1.jpg', 'Basil plant - ready for harvest', 0.00, 1, '2025-10-09 18:03:33'),
(3, 1, 'soil_analysis', '/uploads/soil/garden_soil_1.jpg', 'Well-draining soil, pH 6.5', 0.00, 1, '2025-10-09 18:03:33'),
(4, 2, 'plant_analysis', '/uploads/plants/lettuce_1.jpg', 'Lettuce plant - good growth', 0.00, 1, '2025-10-09 18:03:33'),
(5, 2, 'plant_analysis', '/uploads/plants/mint_1.jpg', 'Mint plant - needs pruning', 0.00, 1, '2025-10-09 18:03:33'),
(6, 2, 'plant_analysis', '/uploads/plants/pepper_1.jpg', 'Pepper plant - flowering stage', 25.00, 0, '2025-10-09 18:03:33'),
(7, 3, 'plant_analysis', '/uploads/plants/carrot_1.jpg', 'Carrot plant - root development', 0.00, 1, '2025-10-09 18:03:33'),
(8, 3, 'soil_analysis', '/uploads/soil/balcony_soil_1.jpg', 'Sandy soil, needs nutrients', 0.00, 1, '2025-10-09 18:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `rating` int(11) DEFAULT 5,
  `category` varchar(50) DEFAULT 'general',
  `status` varchar(20) DEFAULT 'pending',
  `admin_response` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `user_id`, `subject`, `message`, `rating`, `category`, `status`, `admin_response`, `created_at`) VALUES
(1, 1, 'Great AI Recognition Feature', 'The plant recognition feature is incredibly accurate and helpful for identifying unknown plants in my garden.', 5, 'feature', 'resolved', NULL, '2025-10-09 18:03:33'),
(2, 2, 'Smart Alerts Working Perfectly', 'The notification system reminds me exactly when to water and fertilize my plants. Very reliable!', 5, 'feature', 'resolved', NULL, '2025-10-09 18:03:33'),
(3, 3, 'User Interface Suggestion', 'Would love to see a dark mode option for the mobile app. Otherwise, everything works great.', 4, 'ui', 'pending', NULL, '2025-10-09 18:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `garden`
--

CREATE TABLE `garden` (
  `GARDEN_ID` int(11) NOT NULL,
  `USER_ID` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `GARDEN_TYPE` varchar(20) NOT NULL,
  `LOCATION_CITY` varchar(100) DEFAULT NULL,
  `LOCATION_COUNTRY` varchar(100) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT current_timestamp(),
  `GRID_SIZE` varchar(10) DEFAULT '3x3' COMMENT 'Current grid size (3x3 for basic, 6x6 for premium)',
  `BASE_GRID_SPACES` int(11) DEFAULT 9 COMMENT 'Base grid spaces from subscription plan (9 for basic, 36 for premium)',
  `ADDITIONAL_SPACES_PURCHASED` int(11) DEFAULT 0 COMMENT 'Additional spaces purchased beyond plan',
  `USED_GRID_SPACES` int(11) DEFAULT 0 COMMENT 'Currently used grid spaces (updated by triggers)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `garden`
--

INSERT INTO `garden` (`GARDEN_ID`, `USER_ID`, `NAME`, `GARDEN_TYPE`, `LOCATION_CITY`, `LOCATION_COUNTRY`, `CREATED_AT`, `GRID_SIZE`, `BASE_GRID_SPACES`, `ADDITIONAL_SPACES_PURCHASED`, `USED_GRID_SPACES`) VALUES
(1, 1, 'Backyard Vegetable Garden', 'Outdoor', 'New York', 'USA', '2025-10-09 18:03:33', '3x3', 9, 0, 0),
(2, 1, 'Kitchen Herb Garden', 'Indoor', 'New York', 'USA', '2025-10-09 18:03:33', '3x3', 9, 0, 0),
(3, 2, 'Balcony Garden', 'Outdoor', 'Los Angeles', 'USA', '2025-10-09 18:03:33', '3x3', 9, 0, 0),
(4, 3, 'Greenhouse Garden', 'Indoor', 'Chicago', 'USA', '2025-10-09 18:03:33', '3x3', 9, 0, 0),
(5, 5, 'outdoor', 'mixed', 'Cebu City', 'Philippines', '2025-10-10 03:26:18', '3x3', 9, 0, 0),
(6, 5, 'hobby', 'fruit', 'Cebu City', 'Philippines', '2025-10-10 03:26:47', '3x3', 9, 0, 0),
(7, 5, 'rizada', 'mixed', 'Cebu City', 'Philippines', '2025-10-10 12:06:54', '3x3', 9, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `grid_spaces`
--

CREATE TABLE `grid_spaces` (
  `SPACE_ID` int(11) NOT NULL,
  `GARDEN_ID` int(11) NOT NULL,
  `GRID_POSITION` varchar(10) NOT NULL,
  `PLANT_ID` int(11) DEFAULT NULL,
  `PLANTING_DATE` date DEFAULT NULL,
  `LAST_WATERED` date DEFAULT NULL,
  `LAST_FERTILIZED` date DEFAULT NULL,
  `LAST_PRUNED` date DEFAULT NULL,
  `NOTES` text DEFAULT NULL,
  `IS_ACTIVE` tinyint(1) DEFAULT 1,
  `CREATED_AT` datetime DEFAULT current_timestamp(),
  `IMAGE_PATH` varchar(255) DEFAULT NULL,
  `CARE_SUGGESTIONS` text DEFAULT NULL,
  `LAST_UPDATED` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `grid_spaces`
--

INSERT INTO `grid_spaces` (`SPACE_ID`, `GARDEN_ID`, `GRID_POSITION`, `PLANT_ID`, `PLANTING_DATE`, `LAST_WATERED`, `LAST_FERTILIZED`, `LAST_PRUNED`, `NOTES`, `IS_ACTIVE`, `CREATED_AT`, `IMAGE_PATH`, `CARE_SUGGESTIONS`, `LAST_UPDATED`) VALUES
(1, 1, '1,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(2, 1, '1,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(3, 1, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(4, 1, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(5, 1, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(6, 1, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(7, 1, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(8, 1, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(9, 1, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(10, 2, '1,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(11, 2, '1,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(12, 2, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(13, 2, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(14, 2, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(15, 2, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(16, 2, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(17, 2, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(18, 2, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(19, 3, '1,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(20, 3, '1,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(21, 3, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(22, 3, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(23, 3, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(24, 3, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(25, 3, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(26, 3, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(27, 3, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(28, 4, '1,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(29, 4, '1,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(30, 4, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(31, 4, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(32, 4, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(33, 4, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(34, 4, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(35, 4, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(36, 4, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(37, 5, '1,1', 40, '2025-10-11', NULL, NULL, NULL, 'Placed via drag and drop', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(38, 5, '1,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(39, 5, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(40, 5, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(41, 5, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(42, 5, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(43, 5, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(44, 5, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(45, 5, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(46, 6, '1,1', 39, '2025-10-11', NULL, NULL, NULL, 'Placed via drag and drop', 1, '2025-10-10 07:40:37', NULL, NULL, NULL),
(47, 6, '1,2', 37, '2025-10-10', NULL, NULL, NULL, 'Placed via drag and drop', 1, '2025-10-10 07:40:37', NULL, NULL, NULL),
(48, 6, '1,3', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-10-10 07:40:37', NULL, NULL, NULL),
(49, 6, '2,1', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-10-10 07:40:37', NULL, NULL, NULL),
(50, 6, '2,2', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-10-10 07:40:37', NULL, NULL, NULL),
(51, 6, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(52, 6, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(53, 6, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(54, 6, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 07:40:37', NULL, NULL, '2025-10-10 16:50:04'),
(55, 7, '1,1', 36, '2025-10-10', NULL, NULL, NULL, '', 1, '2025-10-10 12:06:54', 'uploads/plants/space_55_1760145849.jpg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.8, \"reasoning\": \"The sunflower head shows signs of mold or rot with dark patches, indicating potential health issues.\"}', '2025-10-11 01:24:16'),
(56, 7, '1,2', 34, '2025-10-10', NULL, NULL, NULL, 'Placed via drag and drop', 1, '2025-10-10 12:06:54', 'uploads/plants/space_56_1760099026.jpg', '{\"needs_water\": false, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.9, \"reasoning\": \"The sour oranges appear healthy, with vibrant color and no visible signs of mold, rot, or spoilage.\"}', '2025-10-10 12:23:52'),
(57, 7, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 12:06:54', NULL, NULL, '2025-10-10 12:06:54'),
(58, 7, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 12:06:54', NULL, NULL, '2025-10-10 12:06:54'),
(59, 7, '2,2', 35, '2025-10-10', NULL, NULL, NULL, 'Placed via drag and drop', 1, '2025-10-10 12:06:54', 'uploads/plants/space_59_1760098967.jpg', '{\"needs_water\": false, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.9, \"reasoning\": \"The grape clusters and leaves appear healthy with no visible mold, rot, or spoilage. The grapes are plump and vibrant.\"}', '2025-10-10 12:22:52'),
(60, 7, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 12:06:54', NULL, NULL, '2025-10-10 12:06:54'),
(61, 7, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 12:06:54', NULL, NULL, '2025-10-10 12:06:54'),
(62, 7, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 12:06:54', NULL, NULL, '2025-10-10 12:06:54'),
(63, 7, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-10-10 12:06:54', NULL, NULL, '2025-10-10 12:06:54');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `plant_id` int(11) DEFAULT NULL,
  `garden_id` int(11) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `priority` varchar(20) DEFAULT 'medium',
  `status` varchar(20) DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `plant_id`, `garden_id`, `due_date`, `priority`, `status`, `created_at`) VALUES
(1, 1, 'watering', 'Water Your Tomatoes', 'Your tomatoes in Backyard Garden need watering today.', 1, 1, '2024-03-21 09:00:00', 'high', 'pending', '2025-10-09 18:03:33'),
(2, 1, 'fertilizing', 'Fertilize Your Basil', 'Time to fertilize your basil plants in Kitchen Herb Garden.', 2, 2, '2024-03-22 10:00:00', 'medium', 'pending', '2025-10-09 18:03:33'),
(3, 2, 'pruning', 'Prune Your Mint', 'Your mint plants need pruning to encourage new growth.', 5, 2, '2024-03-23 14:00:00', 'low', 'pending', '2025-10-09 18:03:33'),
(4, 3, 'watering', 'Water Your Lettuce', 'Your lettuce in Balcony Garden needs watering.', 3, 3, '2024-03-21 08:00:00', 'high', 'pending', '2025-10-09 18:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `method_name` varchar(50) NOT NULL,
  `method_type` varchar(30) NOT NULL,
  `is_priority` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `processing_fee` decimal(10,2) DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `method_name`, `method_type`, `is_priority`, `is_active`, `processing_fee`, `description`, `created_at`) VALUES
(1, 'GCash', 'digital_wallet', 1, 1, 0.00, 'GCash - Priority payment method for fast and secure transactions', '2025-10-09 18:03:33'),
(2, 'PayMaya', 'digital_wallet', 0, 1, 0.00, 'PayMaya - Digital wallet payment option', '2025-10-09 18:03:33'),
(3, 'Credit Card', 'card', 0, 1, 5.00, 'Credit/Debit Card - Traditional card payment with processing fee', '2025-10-09 18:03:33'),
(4, 'Debit Card', 'card', 0, 1, 3.00, 'Debit Card - Direct bank account payment with processing fee', '2025-10-09 18:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `plant`
--

CREATE TABLE `plant` (
  `PLANT_ID` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `TYPE` varchar(20) NOT NULL,
  `ENVIRONMENT` varchar(20) NOT NULL,
  `CARE_GUIDE` text NOT NULL,
  `IDEAL_SOIL_TYPE` varchar(100) DEFAULT NULL,
  `WATERING_FREQUENCY` int(11) DEFAULT NULL,
  `FERTILIZING_FREQUENCY` int(11) DEFAULT NULL,
  `PRUNING_FREQUENCY` int(11) DEFAULT NULL,
  `IMAGE_PATH` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plant`
--

INSERT INTO `plant` (`PLANT_ID`, `NAME`, `TYPE`, `ENVIRONMENT`, `CARE_GUIDE`, `IDEAL_SOIL_TYPE`, `WATERING_FREQUENCY`, `FERTILIZING_FREQUENCY`, `PRUNING_FREQUENCY`, `IMAGE_PATH`, `CREATED_AT`) VALUES
(1, 'Tomato', 'Vegetable', 'Outdoor', 'Water regularly, full sun, well-draining soil. Stake plants for support. Remove suckers for better fruit production.', 'Well-draining', 2, 14, 7, NULL, '2025-10-10 17:26:21'),
(2, 'Basil', 'Herb', 'Indoor', 'Keep soil moist, partial sun, rich soil. Pinch off flower buds to encourage leaf growth. Harvest regularly.', 'Rich soil', 1, 7, 3, NULL, '2025-10-10 17:26:21'),
(3, 'Lettuce', 'Vegetable', 'Indoor', 'Keep cool, regular watering, loamy soil. Harvest outer leaves first. Plant in succession for continuous harvest.', 'Loamy soil', 1, 10, 5, NULL, '2025-10-10 17:26:21'),
(4, 'Pepper', 'Vegetable', 'Outdoor', 'Full sun, regular watering, well-draining soil. Support heavy fruit with stakes. Harvest when fully colored.', 'Well-draining', 2, 14, 7, NULL, '2025-10-10 17:26:21'),
(5, 'Mint', 'Herb', 'Indoor', 'Keep moist, partial shade, rich soil. Plant in containers to prevent spreading. Harvest leaves as needed.', 'Rich soil', 1, 7, 3, NULL, '2025-10-10 17:26:21'),
(6, 'Carrot', 'Vegetable', 'Outdoor', 'Loose soil, regular watering, full sun. Thin seedlings for better root development. Harvest when roots are mature.', 'Sandy loam', 2, 21, 0, NULL, '2025-10-10 17:26:21'),
(7, 'Spinach', 'Vegetable', 'Indoor', 'Cool temperature, regular watering, rich soil. Harvest outer leaves first. Plant in cool weather.', 'Rich soil', 1, 10, 0, NULL, '2025-10-10 17:26:21'),
(8, 'Rosemary', 'Herb', 'Outdoor', 'Well-draining soil, full sun, moderate watering. Prune regularly to maintain shape. Drought tolerant once established.', 'Well-draining', 3, 21, 14, NULL, '2025-10-10 17:26:21'),
(9, 'Cucumber', 'Vegetable', 'Outdoor', 'Full sun, regular watering, rich soil. Provide trellis for climbing. Harvest when young for best flavor.', 'Rich soil', 2, 14, 0, NULL, '2025-10-10 17:26:21'),
(10, 'Parsley', 'Herb', 'Indoor', 'Partial sun, regular watering, rich soil. Harvest outer stems first. Biennial plant.', 'Rich soil', 1, 7, 0, NULL, '2025-10-10 17:26:21'),
(11, 'Strawberry', 'Fruit', 'Outdoor', 'Full sun, regular watering, well-draining soil. Mulch to keep fruit clean. Remove runners for better fruit production.', 'Well-draining', 2, 14, 7, NULL, '2025-10-10 17:26:21'),
(12, 'Lavender', 'Herb', 'Outdoor', 'Full sun, well-draining soil, moderate watering. Prune after flowering. Drought tolerant.', 'Well-draining', 3, 21, 14, NULL, '2025-10-10 17:26:21'),
(13, 'Green Bean', 'Vegetable', 'Outdoor', 'Full sun, regular watering, well-draining soil. Support climbing varieties. Harvest when pods are young.', 'Well-draining', 2, 14, 0, NULL, '2025-10-10 17:26:21'),
(14, 'Oregano', 'Herb', 'Outdoor', 'Full sun, well-draining soil, moderate watering. Prune regularly to prevent woody growth. Drought tolerant.', 'Well-draining', 3, 21, 7, NULL, '2025-10-10 17:26:21'),
(15, 'Radish', 'Vegetable', 'Outdoor', 'Full sun, regular watering, loose soil. Quick growing crop. Harvest when roots are mature.', 'Loose soil', 1, 7, 0, NULL, '2025-10-10 17:26:21'),
(16, 'Fruit', 'fruit', 'outdoor', 'fsdasdf', '', 3, 3, 3, NULL, '2025-10-10 17:26:21'),
(17, 'Fruit', 'fruit', 'outdoor', 'sddfas', '', 3, 3, 3, NULL, '2025-10-10 17:26:21'),
(19, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\n\n☀️ Sunlight: Full sun\n\n🌱 Soil: Well‑draining; stake tall varieties\n\n📈 Growth Stage: Annual flowering\n\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, NULL, '2025-10-10 17:26:21'),
(22, 'Apple', 'fruit', 'outdoor', '💧 Watering: Deep weekly for young trees; adjust by rainfall\n\n☀️ Sunlight: Full sun\n\n🌱 Soil: Well‑draining loam; mulch to conserve moisture\n\n📈 Growth Stage: Deciduous fruit tree\n\n⚠️ Common Issues: Scab, Codling moth, Fire blight', '', NULL, NULL, NULL, NULL, '2025-10-10 17:26:21'),
(23, 'water-lily tulip', 'flower', 'outdoor', '💧 Watering: Moderate during growth; dry summer dormancy\n\n☀️ Sunlight: Full sun\n\n🌱 Soil: Well‑drained; avoid waterlogged bulbs\n\n📈 Growth Stage: Bulb (cool season)\n\n⚠️ Common Issues: Bulb rot, Aphids, Deer/rabbit browsing', '', NULL, NULL, NULL, NULL, '2025-10-10 17:26:21'),
(34, 'sour orange', 'fruit', 'outdoor', '💧 Watering: Deep, infrequent; let top 3–5 cm dry\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining, slightly acidic; avoid wet feet\r\n\r\n📈 Growth Stage: Evergreen fruit tree\r\n\r\n⚠️ Common Issues: Scale, Leaf miner, Nutrient chlorosis', '', NULL, NULL, NULL, 'uploads/plants/plant_1760098401_orange.jpg', '2025-10-10 12:13:21'),
(35, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1760098713_grape.jpg', '2025-10-10 12:18:33'),
(36, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1760099079_sunflower.jpg', '2025-10-10 12:24:39'),
(37, 'Carrot', 'vegetable', 'indoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1760099176_carrots.jpg', '2025-10-10 12:26:16'),
(38, 'water-lily tulip', 'flower', 'outdoor', '💧 Watering: Moderate during growth; dry summer dormancy\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑drained; avoid waterlogged bulbs\r\n\r\n📈 Growth Stage: Bulb (cool season)\r\n\r\n⚠️ Common Issues: Bulb rot, Aphids, Deer/rabbit browsing', '', NULL, NULL, NULL, 'uploads/plants/plant_1760101175_tulip.jpg', '2025-10-10 12:59:35'),
(39, 'Garden strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1760144898_strawberry.jpg', '2025-10-11 01:08:18'),
(40, 'water-lily tulip', 'flower', 'indoor', '💧 Watering: Moderate during growth; dry summer dormancy\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑drained; avoid waterlogged bulbs\r\n\r\n📈 Growth Stage: Bulb (cool season)\r\n\r\n⚠️ Common Issues: Bulb rot, Aphids, Deer/rabbit browsing', '', NULL, NULL, NULL, 'uploads/plants/plant_1760145773_tulip.jpg', '2025-10-11 01:22:53');

-- --------------------------------------------------------

--
-- Table structure for table `planttracking`
--

CREATE TABLE `planttracking` (
  `TRACKING_ID` int(11) NOT NULL,
  `GARDEN_ID` int(11) NOT NULL,
  `PLANT_ID` int(11) NOT NULL,
  `PLANTING_DATE` date NOT NULL,
  `LAST_WATERED` date DEFAULT NULL,
  `LAST_FERTILIZED` date DEFAULT NULL,
  `LAST_PRUNED` date DEFAULT NULL,
  `NOTES` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `planttracking`
--

INSERT INTO `planttracking` (`TRACKING_ID`, `GARDEN_ID`, `PLANT_ID`, `PLANTING_DATE`, `LAST_WATERED`, `LAST_FERTILIZED`, `LAST_PRUNED`, `NOTES`) VALUES
(1, 1, 1, '2024-03-15', '2024-03-20', '2024-03-15', '2024-03-18', 'Tomatoes growing well, need staking soon'),
(2, 1, 4, '2024-03-10', '2024-03-19', '2024-03-10', '2024-03-17', 'Peppers showing good growth'),
(3, 2, 2, '2024-02-28', '2024-03-20', '2024-03-13', '2024-03-15', 'Basil ready for first harvest'),
(4, 2, 5, '2024-03-01', '2024-03-19', '2024-03-08', '2024-03-12', 'Mint spreading nicely'),
(5, 3, 3, '2024-03-05', '2024-03-20', '2024-03-12', '2024-03-15', 'Lettuce ready for harvest'),
(6, 4, 8, '2024-02-15', '2024-03-18', '2024-03-01', '2024-03-10', 'Rosemary established well'),
(25, 7, 34, '2025-10-10', NULL, NULL, NULL, NULL),
(26, 7, 35, '2025-10-10', NULL, NULL, NULL, NULL),
(27, 7, 36, '2025-10-10', NULL, NULL, NULL, NULL),
(28, 6, 37, '2025-10-10', NULL, NULL, NULL, NULL),
(29, 5, 38, '2025-10-10', NULL, NULL, NULL, NULL),
(30, 6, 39, '2025-10-11', NULL, NULL, NULL, NULL),
(31, 5, 40, '2025-10-11', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` int(11) NOT NULL,
  `plan_name` varchar(50) NOT NULL,
  `plan_type` varchar(20) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'PHP',
  `grid_planner_size` varchar(10) NOT NULL,
  `free_ai_analyses` int(11) NOT NULL,
  `free_plant_analyses` int(11) NOT NULL,
  `free_soil_analyses` int(11) NOT NULL,
  `additional_grid_cost` decimal(10,2) DEFAULT 20.00,
  `additional_ai_cost` decimal(10,2) DEFAULT 25.00,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscription_plans`
--

INSERT INTO `subscription_plans` (`id`, `plan_name`, `plan_type`, `price`, `currency`, `grid_planner_size`, `free_ai_analyses`, `free_plant_analyses`, `free_soil_analyses`, `additional_grid_cost`, `additional_ai_cost`, `is_active`, `created_at`) VALUES
(1, 'Premium Plan', 'premium', 150.00, 'PHP', '6x6', 20, 10, 10, 20.00, 25.00, 1, '2025-10-09 18:03:33'),
(2, 'Basic Plan', 'basic', 0.00, 'PHP', '3x3', 4, 2, 2, 20.00, 25.00, 1, '2025-10-09 18:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(120) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `subscribed` tinyint(1) DEFAULT 0,
  `subscription_plan` varchar(20) DEFAULT 'basic',
  `email_notifications` tinyint(1) DEFAULT 1,
  `learning_level` varchar(20) DEFAULT 'beginner',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_verified` tinyint(1) DEFAULT 0,
  `email_verification_token` varchar(100) DEFAULT NULL,
  `email_verification_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `firstname`, `lastname`, `contact`, `password_hash`, `role`, `is_active`, `subscribed`, `subscription_plan`, `email_notifications`, `learning_level`, `created_at`, `updated_at`, `email_verified`, `email_verification_token`, `email_verification_expires`) VALUES
(1, 'john.doe@example.com', 'John', 'Doe', '1234567890', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G', 'user', 1, 1, 'premium', 1, 'beginner', '2025-10-09 18:03:33', '2025-10-09 18:03:33', 0, NULL, NULL),
(2, 'jane.smith@example.com', 'Jane', 'Smith', '0987654321', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G', 'user', 1, 0, 'basic', 1, 'beginner', '2025-10-09 18:03:33', '2025-10-09 18:03:33', 0, NULL, NULL),
(3, 'mike.wilson@example.com', 'Mike', 'Wilson', '5551234567', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G', 'user', 1, 0, 'basic', 1, 'beginner', '2025-10-09 18:03:33', '2025-10-09 18:03:33', 0, NULL, NULL),
(4, 'test@example.com', 'Test', 'User', '12345678901', 'pbkdf2:sha256:600000$vvDhwBUrov47Qeln$3a9f898da2805c9c4fedbb6e14d84174e08984110182423fcaf63c516f3d1cdf', 'user', 0, 0, 'basic', 1, 'beginner', '2025-10-09 10:08:20', '2025-10-09 10:08:20', 0, 'tyTWuqr8TZiEHKRC87fQDuDxZ02kUqMIK7t1H8c0Azk', '2025-10-10 10:08:20'),
(5, 'rizadajohn5@gmail.com', 'john', 'rizada', '09123412341', 'pbkdf2:sha256:600000$rZjkS9c3wLM0EQRL$4d26a8d30bd30d52e6f245b72072829cfa1d6b4e596d83322a4ea560a2a3f0e4', 'user', 1, 0, 'basic', 1, 'beginner', '2025-10-09 10:08:57', '2025-10-11 03:16:34', 1, NULL, NULL),
(6, 'admin@egrowtify.com', 'Admin', 'User', '1234567890', 'pbkdf2:sha256:600000$Dbsx1m6WRozIdWwX$609302e10c362b12ac748f8525d9a9b82e0281fe88853121f91ffbfc95a99504', 'admin', 1, 1, 'basic', 1, 'expert', '2025-10-11 03:11:41', '2025-10-11 03:11:41', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_subscriptions`
--

CREATE TABLE `user_subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  `payment_status` varchar(20) DEFAULT 'pending',
  `total_paid` decimal(10,2) DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_subscriptions`
--

INSERT INTO `user_subscriptions` (`id`, `user_id`, `plan_id`, `start_date`, `end_date`, `status`, `payment_status`, `total_paid`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2024-03-01 00:00:00', '2024-04-01 00:00:00', 'active', 'paid', 150.00, '2025-10-09 18:03:33', '2025-10-09 18:03:33'),
(2, 2, 2, '2024-03-15 00:00:00', NULL, 'active', 'free', 0.00, '2025-10-09 18:03:33', '2025-10-09 18:03:33'),
(3, 3, 2, '2024-03-10 00:00:00', NULL, 'active', 'free', 0.00, '2025-10-09 18:03:33', '2025-10-09 18:03:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `ai_usage_tracking`
--
ALTER TABLE `ai_usage_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ai_usage_tracking_user_id` (`user_id`),
  ADD KEY `idx_ai_usage_tracking_usage_type` (`usage_type`),
  ADD KEY `idx_ai_usage_tracking_created_at` (`created_at`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_feedback_user_id` (`user_id`),
  ADD KEY `idx_feedback_status` (`status`);

--
-- Indexes for table `garden`
--
ALTER TABLE `garden`
  ADD PRIMARY KEY (`GARDEN_ID`),
  ADD KEY `idx_garden_user_id` (`USER_ID`);

--
-- Indexes for table `grid_spaces`
--
ALTER TABLE `grid_spaces`
  ADD PRIMARY KEY (`SPACE_ID`),
  ADD UNIQUE KEY `unique_garden_position` (`GARDEN_ID`,`GRID_POSITION`),
  ADD KEY `PLANT_ID` (`PLANT_ID`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plant_id` (`plant_id`),
  ADD KEY `garden_id` (`garden_id`),
  ADD KEY `idx_notifications_user_id` (`user_id`),
  ADD KEY `idx_notifications_due_date` (`due_date`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `method_name` (`method_name`),
  ADD KEY `idx_payment_methods_is_priority` (`is_priority`),
  ADD KEY `idx_payment_methods_is_active` (`is_active`);

--
-- Indexes for table `plant`
--
ALTER TABLE `plant`
  ADD PRIMARY KEY (`PLANT_ID`);

--
-- Indexes for table `planttracking`
--
ALTER TABLE `planttracking`
  ADD PRIMARY KEY (`TRACKING_ID`),
  ADD KEY `idx_planttracking_garden_id` (`GARDEN_ID`),
  ADD KEY `idx_planttracking_plant_id` (`PLANT_ID`);

--
-- Indexes for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plan_name` (`plan_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_verification_token` (`email_verification_token`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_subscription_plan` (`subscription_plan`);

--
-- Indexes for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_subscriptions_user_id` (`user_id`),
  ADD KEY `idx_user_subscriptions_plan_id` (`plan_id`),
  ADD KEY `idx_user_subscriptions_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ai_usage_tracking`
--
ALTER TABLE `ai_usage_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `garden`
--
ALTER TABLE `garden`
  MODIFY `GARDEN_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `grid_spaces`
--
ALTER TABLE `grid_spaces`
  MODIFY `SPACE_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `plant`
--
ALTER TABLE `plant`
  MODIFY `PLANT_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `planttracking`
--
ALTER TABLE `planttracking`
  MODIFY `TRACKING_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_usage_tracking`
--
ALTER TABLE `ai_usage_tracking`
  ADD CONSTRAINT `ai_usage_tracking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `garden`
--
ALTER TABLE `garden`
  ADD CONSTRAINT `garden_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `grid_spaces`
--
ALTER TABLE `grid_spaces`
  ADD CONSTRAINT `grid_spaces_ibfk_1` FOREIGN KEY (`GARDEN_ID`) REFERENCES `garden` (`GARDEN_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `grid_spaces_ibfk_2` FOREIGN KEY (`PLANT_ID`) REFERENCES `plant` (`PLANT_ID`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`plant_id`) REFERENCES `plant` (`PLANT_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`garden_id`) REFERENCES `garden` (`GARDEN_ID`) ON DELETE SET NULL;

--
-- Constraints for table `planttracking`
--
ALTER TABLE `planttracking`
  ADD CONSTRAINT `planttracking_ibfk_1` FOREIGN KEY (`GARDEN_ID`) REFERENCES `garden` (`GARDEN_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `planttracking_ibfk_2` FOREIGN KEY (`PLANT_ID`) REFERENCES `plant` (`PLANT_ID`);

--
-- Constraints for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD CONSTRAINT `user_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
