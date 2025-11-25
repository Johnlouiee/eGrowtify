-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2025 at 02:34 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `garden_id` int(11) NOT NULL,
  `space_id` int(11) DEFAULT NULL,
  `plant_id` int(11) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `action_date` datetime NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `garden_id`, `space_id`, `plant_id`, `action`, `action_date`, `notes`, `created_at`) VALUES
(14, 0, 9, 90, 48, 'water', '2025-11-16 00:00:00', 'Completed watering for Sunflower', '2025-11-16 02:01:08'),
(15, 0, 9, 94, 50, 'fertilize', '2025-11-16 00:00:00', 'Completed fertilizeing for Pumpkin', '2025-11-16 02:09:07'),
(16, 0, 9, 94, 50, 'prune', '2025-11-16 00:00:00', 'Completed pruneing for Pumpkin', '2025-11-16 02:09:18'),
(17, 0, 9, 94, 50, 'water', '2025-11-16 00:00:00', 'Completed watering for Pumpkin', '2025-11-16 02:09:48'),
(18, 0, 9, 94, 50, 'fertilize', '2025-11-16 00:00:00', 'Completed fertilizeing for Pumpkin', '2025-11-16 02:10:20'),
(19, 0, 9, 96, 54, 'water', '2025-11-16 00:00:00', 'Completed watering for Grape', '2025-11-16 10:32:59'),
(20, 0, 9, 96, 54, 'prune', '2025-11-16 00:00:00', 'Completed pruneing for Grape', '2025-11-16 10:33:51'),
(21, 0, 9, 93, 47, 'prune', '2025-11-16 00:00:00', 'Completed pruneing for Eggplant', '2025-11-16 10:39:20'),
(22, 0, 9, 90, 48, 'prune', '2025-11-16 00:00:00', 'Completed pruneing for Sunflower', '2025-11-16 10:41:15'),
(23, 0, 10, 106, 55, 'prune', '2025-11-16 00:00:00', 'Completed pruneing for Grape', '2025-11-16 10:45:38'),
(24, 0, 10, 106, 55, 'water', '2025-11-16 00:00:00', 'Completed watering for Grape', '2025-11-16 10:45:53'),
(25, 0, 10, 103, 58, 'prune', '2025-11-16 00:00:00', 'Completed pruneing for Garden strawberry', '2025-11-16 10:56:43'),
(26, 0, 11, 111, 60, 'prune', '2025-11-16 00:00:00', 'Completed pruneing for Sunflower', '2025-11-16 11:58:51'),
(27, 0, 9, 90, 48, 'prune', '2025-11-17 00:00:00', 'Completed pruneing for Sunflower', '2025-11-17 14:05:38'),
(28, 0, 11, 111, 60, 'prune', '2025-11-17 00:00:00', 'Completed pruneing for Sunflower', '2025-11-17 14:06:58'),
(29, 0, 10, 106, 55, 'water', '2025-11-17 00:00:00', 'Completed watering for Grape', '2025-11-17 14:07:07'),
(30, 0, 11, 113, 61, 'water', '2025-11-20 00:00:00', 'Completed watering for Sunflower', '2025-11-20 12:35:48'),
(31, 0, 11, 113, 61, 'prune', '2025-11-20 00:00:00', 'Completed pruneing for Sunflower', '2025-11-20 12:36:08'),
(61, 18, 19, 210, 85, 'water', '2025-11-24 00:00:00', 'Completed watering for Grape', '2025-11-24 10:30:06'),
(62, 18, 19, 210, 85, 'prune', '2025-11-24 00:00:00', 'Completed pruneing for Grape', '2025-11-24 10:30:07'),
(63, 21, 20, 219, 86, 'water', '2025-11-24 00:00:00', 'Completed watering for Grape', '2025-11-24 11:29:37'),
(64, 21, 20, 219, 86, 'prune', '2025-11-24 00:00:00', 'Completed pruneing for Grape', '2025-11-24 11:29:38'),
(65, 21, 20, 220, 87, 'water', '2025-11-24 00:00:00', 'Completed watering for Strawberry', '2025-11-24 11:41:14'),
(66, 21, 20, 220, 87, 'prune', '2025-11-24 00:00:00', 'Completed pruneing for Strawberry', '2025-11-24 11:41:16'),
(67, 21, 20, 227, 88, 'prune', '2025-11-24 00:00:00', 'Completed pruneing for Sunflower', '2025-11-24 11:47:29'),
(68, 21, 20, 222, 89, 'water', '2025-11-24 00:00:00', 'Completed watering for Sunflower', '2025-11-24 12:55:54'),
(69, 21, 20, 222, 89, 'prune', '2025-11-24 00:00:00', 'Completed pruneing for Sunflower', '2025-11-24 12:55:58'),
(70, 21, 20, 227, 88, 'fertilize', '2025-11-24 00:00:00', 'Completed fertilizeing for Sunflower', '2025-11-24 13:19:22'),
(71, 21, 20, 314, 93, 'water', '2025-11-24 00:00:00', 'Completed watering for Grape', '2025-11-24 13:24:16'),
(72, 21, 21, 351, 96, 'prune', '2025-11-24 00:00:00', 'Completed pruneing for Strawberry', '2025-11-24 13:31:49');

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
-- Table structure for table `ai_analysis_usage`
--

CREATE TABLE `ai_analysis_usage` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `free_analyses_used` int(11) DEFAULT NULL,
  `purchased_credits` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_analysis_usage`
--

INSERT INTO `ai_analysis_usage` (`id`, `user_id`, `free_analyses_used`, `purchased_credits`, `created_at`, `updated_at`) VALUES
(95, 21, 4, 0, '2025-11-24 12:36:39', '2025-11-24 13:31:03');

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
(9, 21, 'plant_analysis', NULL, 'Carrot', 0.00, 1, '2025-11-24 12:37:02'),
(10, 21, 'plant_analysis', NULL, 'Tomato', 0.00, 1, '2025-11-24 12:37:43'),
(11, 21, 'plant_analysis', NULL, 'tipa', 0.00, 1, '2025-11-24 12:38:22'),
(12, 21, 'plant_analysis', NULL, 'Sunflower', 20.00, 0, '2025-11-24 12:39:19'),
(13, 21, 'plant_analysis', NULL, 'Grape', 20.00, 0, '2025-11-24 12:40:20'),
(14, 21, 'plant_analysis', NULL, 'Pumpkin', 0.00, 1, '2025-11-24 12:46:45'),
(15, 21, 'soil_analysis', NULL, 'The soil appears dry, indicated by its light color and crumbly texture.', 0.00, 1, '2025-11-24 12:53:11'),
(16, 21, 'plant_analysis', NULL, 'Pumpkin', 0.00, 1, '2025-11-24 13:11:55'),
(17, 21, 'soil_analysis', NULL, 'The soil appears moderately moist, indicated by its dark color and slight sheen, suggesting adequate water content.', 0.00, 1, '2025-11-24 13:12:36'),
(18, 21, 'plant_analysis', NULL, 'water-lily tulip', 20.00, 0, '2025-11-24 13:14:50'),
(19, 21, 'plant_analysis', NULL, 'Eggplant', 20.00, 0, '2025-11-24 13:17:05'),
(20, 21, 'plant_analysis', NULL, 'Grape', 0.00, 1, '2025-11-24 13:23:35'),
(21, 21, 'plant_analysis', NULL, 'Pumpkin', 0.00, 1, '2025-11-24 13:29:02'),
(22, 21, 'plant_analysis', NULL, 'Banana', 0.00, 1, '2025-11-24 13:30:06'),
(23, 21, 'plant_analysis', NULL, 'Strawberry', 0.00, 1, '2025-11-24 13:31:03');

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
(1, NULL, 'Great AI Recognition Feature', 'The plant recognition feature is incredibly accurate and helpful for identifying unknown plants in my garden.', 5, 'feature', 'resolved', NULL, '2025-10-09 18:03:33'),
(2, NULL, 'Smart Alerts Working Perfectly', 'The notification system reminds me exactly when to water and fertilize my plants. Very reliable!', 5, 'feature', 'resolved', NULL, '2025-10-09 18:03:33'),
(3, NULL, 'User Interface Suggestion', 'Would love to see a dark mode option for the mobile app. Otherwise, everything works great.', 4, 'ui', 'pending', NULL, '2025-10-09 18:03:33'),
(4, NULL, 'Update plants', 'improve UI/UX', 4, 'general', 'pending', NULL, '2025-11-20 13:41:32'),
(5, NULL, 'UI/UX ', 'improve the UI/UX', 4, 'general', 'in_progress', NULL, '2025-11-20 14:40:53'),
(6, NULL, 'sdfasd', 'sdafasdfsa', 5, 'general', 'pending', NULL, '2025-11-22 08:52:34');

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
(19, 18, 'rizada', 'mixed', 'Manila', 'Philippines', '2025-11-24 10:21:30', '3x3', 9, 0, 0),
(20, 21, 'rizada', 'vegetable', 'Cebu City', 'Philippines', '2025-11-24 11:05:44', '6x6', 36, 0, 3),
(21, 21, 'purisima', 'mixed', 'Manila', 'Philippines', '2025-11-24 13:29:40', '6x6', 36, 0, 0);

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
(210, 19, '1,1', 85, '2025-11-24', '2025-11-24', NULL, '2025-11-24', 'Placed via drag and drop', 1, '2025-11-24 10:21:30', 'uploads/plants/space_210_1763980189.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.85, \"reasoning\": \"Shriveled and dehydrated grapes indicating water stress; presence of damaged grapes that need pruning.\"}', '2025-11-24 10:30:07'),
(211, 19, '1,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(212, 19, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(213, 19, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(214, 19, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(215, 19, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(216, 19, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(217, 19, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(218, 19, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(219, 20, '1,1', 86, '2025-11-24', '2025-11-24', NULL, '2025-11-24', 'Placed via drag and drop', 1, '2025-11-24 11:05:44', 'uploads/plants/space_219_1763983751.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.9, \"reasoning\": \"The grapes appear shriveled, suggesting dehydration. Some leaves look healthy, but the presence of shriveled grapes indicates that the plant may require pruning to remove affected parts.\"}', '2025-11-24 11:29:38'),
(220, 20, '1,2', 87, '2025-11-24', '2025-11-24', NULL, '2025-11-24', 'Placed via drag and drop', 1, '2025-11-24 11:05:44', 'uploads/plants/space_220_1763984436.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.9, \"reasoning\": \"URGENT: Health issues detected (damaged fruit) - One of the strawberries appears to be decaying, indicating the presence of a dead or damaged fruit that needs pruning.\"}', '2025-11-24 11:41:16'),
(221, 20, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 11:05:44', NULL, NULL, '2025-11-24 11:05:44'),
(222, 20, '1,4', 89, '2025-11-24', '2025-11-24', NULL, '2025-11-24', 'Placed via drag and drop', 1, '2025-11-24 11:05:44', 'uploads/plants/space_222_1763988912.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.8, \"reasoning\": \"The sunflower has wilting petals and damaged leaves, indicating dehydration and the need for pruning.\"}', '2025-11-24 12:55:58'),
(223, 20, '1,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 11:05:44', NULL, NULL, '2025-11-24 11:05:44'),
(224, 20, '1,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 11:05:44', NULL, NULL, '2025-11-24 11:05:44'),
(225, 20, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 11:05:44', NULL, NULL, '2025-11-24 11:05:44'),
(226, 20, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 11:05:44', NULL, NULL, '2025-11-24 11:05:44'),
(227, 20, '2,3', 88, '2025-11-24', NULL, '2025-11-24', '2025-11-24', 'Placed via drag and drop', 1, '2025-11-24 11:05:44', 'uploads/plants/space_227_1763990337.jpeg', '{\"needs_water\": false, \"needs_fertilize\": true, \"needs_prune\": true, \"confidence\": 0.8, \"reasoning\": \"The sunflower head appears to have missing seeds, and the petals show some brown edges indicating possible nutrient deficiency. There are also damaged or drying parts of the flower head and petals that suggest pruning is needed.\"}', '2025-11-24 13:19:22'),
(309, 20, '2,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(310, 20, '2,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(311, 20, '2,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(312, 20, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(313, 20, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(314, 20, '3,3', 93, '2025-11-24', '2025-11-24', NULL, NULL, 'Placed via drag and drop', 1, '2025-11-24 13:22:05', 'uploads/plants/space_314_1763990635.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.8, \"reasoning\": \"The grapes are shriveled and appear dehydrated, indicating signs of underwatering.\"}', '2025-11-24 13:24:16'),
(315, 20, '3,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(316, 20, '3,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(317, 20, '3,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(318, 20, '4,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(319, 20, '4,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(320, 20, '4,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(321, 20, '4,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(322, 20, '4,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(323, 20, '4,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(324, 20, '5,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(325, 20, '5,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(326, 20, '5,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(327, 20, '5,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(328, 20, '5,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(329, 20, '5,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(330, 20, '6,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(331, 20, '6,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(332, 20, '6,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(333, 20, '6,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(334, 20, '6,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(335, 20, '6,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:22:05', NULL, NULL, '2025-11-24 13:22:05'),
(336, 21, '1,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:40', NULL, NULL, '2025-11-24 13:29:40'),
(337, 21, '1,2', 95, '2025-11-24', NULL, NULL, NULL, 'Placed via drag and drop', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(338, 21, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(339, 21, '1,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(340, 21, '1,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(341, 21, '1,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(342, 21, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(343, 21, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(344, 21, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(345, 21, '2,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(346, 21, '2,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(347, 21, '2,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(348, 21, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(349, 21, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(350, 21, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(351, 21, '3,4', 96, '2025-11-24', NULL, NULL, '2025-11-24', 'Placed via drag and drop', 1, '2025-11-24 13:29:41', 'uploads/plants/space_351_1763991093.jpeg', '{\"needs_water\": false, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.85, \"reasoning\": \"Presence of a decayed fruit suggests need for pruning.\"}', '2025-11-24 13:31:49'),
(352, 21, '3,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(353, 21, '3,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(354, 21, '4,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(355, 21, '4,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(356, 21, '4,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(357, 21, '4,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(358, 21, '4,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(359, 21, '4,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(360, 21, '5,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(361, 21, '5,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(362, 21, '5,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(363, 21, '5,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(364, 21, '5,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(365, 21, '5,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(366, 21, '6,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(367, 21, '6,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(368, 21, '6,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(369, 21, '6,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(370, 21, '6,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41'),
(371, 21, '6,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 13:29:41', NULL, NULL, '2025-11-24 13:29:41');

-- --------------------------------------------------------

--
-- Table structure for table `learning_path_content`
--

CREATE TABLE `learning_path_content` (
  `id` int(11) NOT NULL,
  `path_difficulty` varchar(20) NOT NULL,
  `module_id` varchar(50) NOT NULL,
  `content_type` varchar(20) NOT NULL,
  `content_id` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `media_type` varchar(20) DEFAULT NULL,
  `media_url` varchar(500) DEFAULT NULL,
  `media_description` text DEFAULT NULL,
  `question_number` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'Update',
  `priority` varchar(20) DEFAULT 'Medium',
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(40, 'water-lily tulip', 'flower', 'indoor', '💧 Watering: Moderate during growth; dry summer dormancy\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑drained; avoid waterlogged bulbs\r\n\r\n📈 Growth Stage: Bulb (cool season)\r\n\r\n⚠️ Common Issues: Bulb rot, Aphids, Deer/rabbit browsing', '', NULL, NULL, NULL, 'uploads/plants/plant_1760145773_tulip.jpg', '2025-10-11 01:22:53'),
(41, 'Indian chrysanthemum', 'flower', 'indoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1761308419_flowers.jpg.jpeg', '2025-10-24 12:20:19'),
(42, 'herb', 'herb', 'indoor', 'asdasd', '', NULL, NULL, NULL, NULL, '2025-10-24 16:06:50'),
(43, 'kiwi', 'flower', 'indoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1761478821_kiwi.jpg.jpeg', '2025-10-26 11:40:21'),
(44, 'sour orange', 'fruit', 'indoor', '💧 Watering: Deep, infrequent; let top 3–5 cm dry\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining, slightly acidic; avoid wet feet\r\n\r\n📈 Growth Stage: Evergreen fruit tree\r\n\r\n⚠️ Common Issues: Scale, Leaf miner, Nutrient chlorosis', '', NULL, NULL, NULL, 'uploads/plants/plant_1761479333_orange.jpg.jpeg', '2025-10-26 11:48:53'),
(45, 'Tree Tomato', 'vegetable', 'outdoor', '💧 Watering: Deeply 1–2x/week; keep evenly moist, avoid wet foliage\r\n\r\n☀️ Sunlight: Full sun (6–8+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained soil with compost; pH 6.0–6.8\r\n\r\n📈 Growth Stage: Vegetative/fruiting (warm-season annual)\r\n\r\n⚠️ Common Issues: Blossom end rot, Early blight, Aphids, Split fruit', '', NULL, NULL, NULL, 'uploads/plants/plant_1761479536_apple.jpg.jpeg', '2025-10-26 11:52:16'),
(46, 'Mango', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1762094188_mango.jpg.jpeg', '2025-11-02 14:36:28'),
(47, 'Eggplant', 'vegetable', 'outdoor', '💧 Watering: Deeply 1–2x/week; keep evenly moist, avoid wet foliage\r\n\r\n☀️ Sunlight: Full sun (6–8+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained soil with compost; pH 6.0–6.8\r\n\r\n📈 Growth Stage: Vegetative/fruiting (warm-season annual)\r\n\r\n⚠️ Common Issues: Blossom end rot, Early blight, Aphids, Split fruit', '', NULL, NULL, NULL, 'uploads/plants/plant_1763254470_eggplant2.jpg.jpeg', '2025-11-16 00:54:30'),
(48, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Prefers well-drained, nutrient-rich soil. Ensure the soil remains loose and not compacted.', 7, 30, 60, 'uploads/plants/plant_1763254529_sunflower.jpg.jpeg', '2025-11-16 00:55:29'),
(49, 'sour orange', 'fruit', 'outdoor', '💧 Watering: Deep, infrequent; let top 3–5 cm dry\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining, slightly acidic; avoid wet feet\r\n\r\n📈 Growth Stage: Evergreen fruit tree\r\n\r\n⚠️ Common Issues: Scale, Leaf miner, Nutrient chlorosis', 'Use well-draining soil, preferably sandy loam with a slightly acidic to neutral pH.', 7, 30, 60, 'uploads/plants/plant_1763255233_orange3.jpg.jpeg', '2025-11-16 01:07:13'),
(50, 'Pumpkin', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Use well-draining, nutrient-rich soil. Consider adding compost to improve soil health.', 7, 30, 60, 'uploads/plants/plant_1763255563_pumpkin.jpg.jpeg', '2025-11-16 01:12:43'),
(51, 'Garden strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Ensure well-draining, slightly acidic soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1763255868_strawberry.jpg.jpeg', '2025-11-16 01:17:48'),
(53, 'Tomato', 'vegetable', 'outdoor', '💧 Watering: Deeply 1–2x/week; keep evenly moist, avoid wet foliage\r\n\r\n☀️ Sunlight: Full sun (6–8+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained soil with compost; pH 6.0–6.8\r\n\r\n📈 Growth Stage: Vegetative/fruiting (warm-season annual)\r\n\r\n⚠️ Common Issues: Blossom end rot, Early blight, Aphids, Split fruit', '', NULL, NULL, NULL, 'uploads/plants/plant_1763258421_tomato.webp.webp', '2025-11-16 02:00:21'),
(54, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Maintain well-draining soil with a slightly acidic to neutral pH.', 7, 30, 60, 'uploads/plants/plant_1763289108_grape.jpg.jpeg', '2025-11-16 10:31:48'),
(55, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1763289888_grape.jpg.jpeg', '2025-11-16 10:44:48'),
(56, 'Apple', 'fruit', 'outdoor', '💧 Watering: Deep weekly for young trees; adjust by rainfall\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining loam; mulch to conserve moisture\r\n\r\n📈 Growth Stage: Deciduous fruit tree\r\n\r\n⚠️ Common Issues: Scab, Codling moth, Fire blight', '', NULL, NULL, NULL, 'uploads/plants/plant_1763290251_apple.jpg.jpeg', '2025-11-16 10:50:51'),
(57, 'edible banana', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1763290418_banana2.webp.webp', '2025-11-16 10:53:38'),
(58, 'Garden strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1763290548_strawberry.jpg.jpeg', '2025-11-16 10:55:48'),
(59, 'Eggplant', 'vegetable', 'outdoor', '💧 Watering: Deeply 1–2x/week; keep evenly moist, avoid wet foliage\r\n\r\n☀️ Sunlight: Full sun (6–8+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained soil with compost; pH 6.0–6.8\r\n\r\n📈 Growth Stage: Vegetative/fruiting (warm-season annual)\r\n\r\n⚠️ Common Issues: Blossom end rot, Early blight, Aphids, Split fruit', '', NULL, NULL, NULL, 'uploads/plants/plant_1763290905_eggplant2.jpg.jpeg', '2025-11-16 11:01:45'),
(60, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1763294159_sunflower.jpg.jpeg', '2025-11-16 11:55:59'),
(61, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Prefers well-draining, nutrient-rich soil.', 7, 30, 60, 'uploads/plants/plant_1763295144_sunflower.jpg.jpeg', '2025-11-16 12:12:24'),
(62, 'Garden strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Maintain well-drained, sandy loam soil with a slightly acidic to neutral pH.', 7, 30, 60, 'uploads/plants/plant_1763388210_strawberry.jpg.jpeg', '2025-11-17 14:03:30'),
(63, 'edible banana', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Use well-draining, rich soil to support healthy growth.', 7, 30, 60, 'uploads/plants/plant_1763642036_banana.jpg.jpeg', '2025-11-20 12:33:56'),
(64, 'Garden strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1763643870_strawberry.jpg.jpeg', '2025-11-20 13:04:30'),
(65, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Well-drained, nutrient-rich soil is best. Consider adding compost to improve soil quality.', 7, 30, 60, 'uploads/plants/plant_1763644092_sunflower.jpg.jpeg', '2025-11-20 13:08:12'),
(66, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1763646742_sunflower.jpg.jpeg', '2025-11-20 13:52:22'),
(67, 'Eggplant', 'vegetable', 'outdoor', '💧 Watering: Deeply 1–2x/week; keep evenly moist, avoid wet foliage\r\n\r\n☀️ Sunlight: Full sun (6–8+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained soil with compost; pH 6.0–6.8\r\n\r\n📈 Growth Stage: Vegetative/fruiting (warm-season annual)\r\n\r\n⚠️ Common Issues: Blossom end rot, Early blight, Aphids, Split fruit', 'Use well-draining soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1763646887_eggplant2.jpg.jpeg', '2025-11-20 13:54:47'),
(68, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1763650105_sunflower.jpg.jpeg', '2025-11-20 14:48:25'),
(69, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Well-drained, fertile soil is essential. Consider mulching to retain moisture.', 7, 30, 60, 'uploads/plants/plant_1763650161_grape.jpg.jpeg', '2025-11-20 14:49:21'),
(70, 'Garden strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Maintain well-draining, slightly acidic soil enriched with organic matter.', 7, 30, 60, 'uploads/plants/plant_1763745151_strawberry.jpg.jpeg', '2025-11-21 17:12:31'),
(71, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1763746090_strawberry.jpg.jpeg', '2025-11-21 17:28:10'),
(72, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1763746569_sunflower.jpg.jpeg', '2025-11-21 17:36:09'),
(73, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1763747726_grape.jpg.jpeg', '2025-11-21 17:55:26'),
(74, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Maintain well-drained, slightly acidic soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1763747760_strawberry.jpg.jpeg', '2025-11-21 17:56:00'),
(75, 'water-lily tulip', 'flower', 'outdoor', '💧 Watering: Moderate during growth; dry summer dormancy\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑drained; avoid waterlogged bulbs\r\n\r\n📈 Growth Stage: Bulb (cool season)\r\n\r\n⚠️ Common Issues: Bulb rot, Aphids, Deer/rabbit browsing', '', NULL, NULL, NULL, 'uploads/plants/plant_1763780905_tulip.jpg.jpeg', '2025-11-22 03:08:25'),
(76, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1763780946_sunflower.jpg.jpeg', '2025-11-22 03:09:06'),
(77, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Well-draining soil with a slightly acidic to neutral pH is ideal. Mulch to retain moisture and regul', 7, 30, 60, 'uploads/plants/plant_1763781029_grape.jpg.jpeg', '2025-11-22 03:10:29'),
(78, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1763782322_sunflower.jpg.jpeg', '2025-11-22 03:32:02'),
(79, 'Apple', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Prefers well-drained, loamy soil with good organic content.', 7, 30, 60, 'uploads/plants/plant_1763782443_apple.jpg.jpeg', '2025-11-22 03:34:03'),
(80, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1763782789_strawberry.jpg.jpeg', '2025-11-22 03:39:49'),
(81, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1763783313_strawberry.jpg.jpeg', '2025-11-22 03:48:33'),
(82, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Well-draining, loamy soil with good organic content is recommended.', 7, 30, 60, 'uploads/plants/plant_1763783389_grape.jpg.jpeg', '2025-11-22 03:49:49'),
(83, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Maintain well-drained, slightly acidic soil with good organic content.', 7, 30, 60, 'uploads/plants/plant_1763798117_strawberry.jpg.jpeg', '2025-11-22 07:55:17'),
(84, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1763801468_strawberry.jpg.jpeg', '2025-11-22 08:51:08'),
(85, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1763980176_grape.jpg.jpeg', '2025-11-24 10:29:36'),
(86, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1763982419_grape.jpg.jpeg', '2025-11-24 11:06:59'),
(87, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1763982451_strawberry.jpg.jpeg', '2025-11-24 11:07:31'),
(88, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1763984392_sunflower.jpg.jpeg', '2025-11-24 11:39:52'),
(89, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Prefers well-drained, nutrient-rich soil.', 7, 30, 60, 'uploads/plants/plant_1763984906_sunflower.jpg.jpeg', '2025-11-24 11:48:26'),
(90, 'water-lily tulip', 'flower', 'outdoor', '💧 Watering: Moderate during growth; dry summer dormancy\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑drained; avoid waterlogged bulbs\r\n\r\n📈 Growth Stage: Bulb (cool season)\r\n\r\n⚠️ Common Issues: Bulb rot, Aphids, Deer/rabbit browsing', 'Well-drained, sandy or loamy soil is ideal.', 7, 30, 60, 'uploads/plants/plant_1763984951_tulip.jpg.jpeg', '2025-11-24 11:49:11'),
(91, 'Banana', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Maintain well-draining, fertile soil. Consider adding organic matter to improve soil quality.', 7, 30, 60, 'uploads/plants/plant_1763984984_banana3.jpg.jpeg', '2025-11-24 11:49:44'),
(92, 'Carrot', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Loose, sandy soil that is well-drained is best for carrot growth.', 7, 30, 60, 'uploads/plants/plant_1763987836_carrots.jpg.jpeg', '2025-11-24 12:37:16'),
(93, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Well-drained, loamy soil with good organic content is best.', 7, 30, 60, 'uploads/plants/plant_1763990622_grape.jpg.jpeg', '2025-11-24 13:23:42'),
(94, 'Pumpkin', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1763990965_pumpkin.jpg.jpeg', '2025-11-24 13:29:25'),
(95, 'Banana', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1763991009_banana3.jpg.jpeg', '2025-11-24 13:30:09'),
(96, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Use well-draining, slightly acidic soil enriched with organic matter.', 7, 30, 60, 'uploads/plants/plant_1763991075_strawberry.jpg.jpeg', '2025-11-24 13:31:15');

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
(76, 19, 85, '2025-11-24', NULL, NULL, NULL, NULL),
(77, 20, 86, '2025-11-24', NULL, NULL, NULL, NULL),
(78, 20, 87, '2025-11-24', NULL, NULL, NULL, NULL),
(79, 20, 88, '2025-11-24', NULL, NULL, NULL, NULL),
(80, 20, 89, '2025-11-24', NULL, NULL, NULL, NULL),
(81, 20, 90, '2025-11-24', NULL, NULL, NULL, NULL),
(82, 20, 91, '2025-11-24', NULL, NULL, NULL, NULL),
(83, 20, 92, '2025-11-24', NULL, NULL, NULL, NULL),
(84, 20, 93, '2025-11-24', NULL, NULL, NULL, NULL),
(85, 20, 94, '2025-11-24', NULL, NULL, NULL, NULL),
(86, 21, 95, '2025-11-24', NULL, NULL, NULL, NULL),
(87, 21, 96, '2025-11-24', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `seasonal_content`
--

CREATE TABLE `seasonal_content` (
  `id` int(11) NOT NULL,
  `season_type` varchar(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `months` varchar(100) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `planting_guide` text DEFAULT NULL,
  `care_tips` text DEFAULT NULL,
  `recommended_plants` text DEFAULT NULL,
  `weather_tips` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(6, 'admin@egrowtify.com', 'Admin', 'User', '1234567890', 'pbkdf2:sha256:600000$Dbsx1m6WRozIdWwX$609302e10c362b12ac748f8525d9a9b82e0281fe88853121f91ffbfc95a99504', 'admin', 1, 1, 'basic', 1, 'expert', '2025-10-11 03:11:41', '2025-10-11 03:11:41', 1, NULL, NULL),
(18, 'jarizada@yahoo.com', 'jan', 'rizada', '09213412341', 'pbkdf2:sha256:600000$8Qm253hzK0wLbZAG$f514c5a0e1b189c16f547e8298717103fc7621ec12ffc4ac171087b8992a6dda', 'user', 1, 0, 'basic', 1, 'beginner', '2025-11-24 10:16:27', '2025-11-24 10:21:03', 1, NULL, NULL),
(19, 'rizadajohn5@gmail.com', 'john', 'rizada', '09213412431', 'pbkdf2:sha256:600000$6JTgPflprTpzuHx5$3498de3157008a129967147118f4272436801ffab3c5babcfb3ddd8d06a6315f', 'user', 1, 0, 'basic', 1, 'beginner', '2025-11-24 10:51:27', '2025-11-24 10:52:10', 1, NULL, NULL),
(20, 'johnlouie3211@gmail.com', 'john louie', 'purisima', '09123412342', 'pbkdf2:sha256:600000$uPCAXob9GEHTCmtv$7385e49a9d0a70c40c4e150800b6f8cb34bf57ec92d261b3daca97a6c5e4d0a8', 'user', 1, 0, 'basic', 1, 'beginner', '2025-11-24 10:54:11', '2025-11-24 10:54:24', 1, NULL, NULL),
(21, 'canamalicht@yahoo.com', 'licht', 'canama', '09213412412', 'pbkdf2:sha256:600000$zJFwNNws8xgF6Oyc$d30d1f3864e90471e77039e1a974f2f57b6ab8a92d3eb47889e7299ba89aefd4', 'user', 1, 1, 'basic', 1, 'beginner', '2025-11-24 10:57:05', '2025-11-24 13:22:05', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_plant_update_usage`
--

CREATE TABLE `user_plant_update_usage` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `free_updates_used` int(11) DEFAULT NULL,
  `purchased_credits` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_shared_concepts`
--

CREATE TABLE `user_shared_concepts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `technique_steps` text DEFAULT NULL,
  `tips` text DEFAULT NULL,
  `tags` varchar(200) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT NULL,
  `source` varchar(50) DEFAULT NULL,
  `imported_from` varchar(150) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(11, 21, 1, '2025-11-24 20:42:55', '2025-12-24 20:42:55', 'cancelled', 'paid', 150.00, '2025-11-24 12:42:55', '2025-11-24 12:46:56'),
(12, 21, 1, '2025-11-24 20:51:59', '2025-12-24 20:51:59', 'cancelled', 'paid', 150.00, '2025-11-24 12:51:59', '2025-11-24 12:52:23'),
(13, 21, 1, '2025-11-24 21:22:05', '2025-12-24 21:22:05', 'active', 'paid', 150.00, '2025-11-24 13:22:05', '2025-11-24 13:22:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_garden_id` (`garden_id`),
  ADD KEY `idx_space_id` (`space_id`),
  ADD KEY `idx_plant_id` (`plant_id`),
  ADD KEY `idx_action_date` (`action_date`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `ai_analysis_usage`
--
ALTER TABLE `ai_analysis_usage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

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
-- Indexes for table `learning_path_content`
--
ALTER TABLE `learning_path_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_path_difficulty` (`path_difficulty`),
  ADD KEY `idx_module_id` (`module_id`),
  ADD KEY `idx_content_type` (`content_type`),
  ADD KEY `idx_question_number` (`question_number`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plant_id` (`plant_id`),
  ADD KEY `garden_id` (`garden_id`),
  ADD KEY `idx_notifications_user_id` (`user_id`),
  ADD KEY `idx_notifications_due_date` (`due_date`);

ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

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
-- Indexes for table `seasonal_content`
--
ALTER TABLE `seasonal_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

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
-- Indexes for table `user_plant_update_usage`
--
ALTER TABLE `user_plant_update_usage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `user_shared_concepts`
--
ALTER TABLE `user_shared_concepts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ai_analysis_usage`
--
ALTER TABLE `ai_analysis_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `ai_usage_tracking`
--
ALTER TABLE `ai_usage_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `garden`
--
ALTER TABLE `garden`
  MODIFY `GARDEN_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `grid_spaces`
--
ALTER TABLE `grid_spaces`
  MODIFY `SPACE_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=372;

--
-- AUTO_INCREMENT for table `learning_path_content`
--
ALTER TABLE `learning_path_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `plant`
--
ALTER TABLE `plant`
  MODIFY `PLANT_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `planttracking`
--
ALTER TABLE `planttracking`
  MODIFY `TRACKING_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `seasonal_content`
--
ALTER TABLE `seasonal_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `user_plant_update_usage`
--
ALTER TABLE `user_plant_update_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_shared_concepts`
--
ALTER TABLE `user_shared_concepts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_analysis_usage`
--
ALTER TABLE `ai_analysis_usage`
  ADD CONSTRAINT `ai_analysis_usage_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD CONSTRAINT `admin_notifications_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `planttracking`
--
ALTER TABLE `planttracking`
  ADD CONSTRAINT `planttracking_ibfk_1` FOREIGN KEY (`GARDEN_ID`) REFERENCES `garden` (`GARDEN_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `planttracking_ibfk_2` FOREIGN KEY (`PLANT_ID`) REFERENCES `plant` (`PLANT_ID`);

--
-- Constraints for table `seasonal_content`
--
ALTER TABLE `seasonal_content`
  ADD CONSTRAINT `seasonal_content_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_plant_update_usage`
--
ALTER TABLE `user_plant_update_usage`
  ADD CONSTRAINT `user_plant_update_usage_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_shared_concepts`
--
ALTER TABLE `user_shared_concepts`
  ADD CONSTRAINT `user_shared_concepts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
