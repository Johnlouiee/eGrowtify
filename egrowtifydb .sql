-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2025 at 06:45 AM
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
(73, 18, 19, 210, 85, 'water', '2025-11-28 00:00:00', 'Completed watering for Grape', '2025-11-28 11:08:15'),
(74, 18, 19, 212, 97, 'water', '2025-11-28 00:00:00', 'Completed watering for Strawberry', '2025-11-28 11:08:16'),
(75, 18, 19, 210, 85, 'prune', '2025-11-28 00:00:00', 'Completed pruneing for Grape', '2025-11-28 11:08:19'),
(76, 18, 19, 212, 97, 'prune', '2025-11-28 00:00:00', 'Completed pruneing for Strawberry', '2025-11-28 11:08:21'),
(77, 18, 19, 214, 98, 'prune', '2025-11-28 00:00:00', 'Completed pruneing for Sunflower', '2025-11-28 11:33:13'),
(78, 18, 19, 210, 85, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Healthy to Unhealthy: The grapes appear shriveled and dehydrated, indicating water needs. Additionally, there are some dam', '2025-11-28 12:05:45'),
(79, 18, 19, 210, 85, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Unhealthy to Unknown: The leaves and grapes appear healthy and vibrant with no clear signs of wilt, yellowing, or damage.', '2025-11-28 12:06:18'),
(80, 18, 24, 434, 102, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Needs Care to Unhealthy: The leaves appear healthy and green, and the strawberries are ripe and abundant. There are no visible signs of dehydration, nutrient deficiency, or da', '2025-11-28 12:14:05'),
(81, 18, 24, 434, 102, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Healthy to Needs Care: Presence of a rotting strawberry indicates need for pruning.', '2025-11-28 12:18:30'),
(82, 18, 24, 434, 102, 'prune', '2025-11-28 00:00:00', 'Completed pruneing for Strawberry', '2025-11-28 12:19:10'),
(83, 18, 24, 434, 102, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Needs Care to Healthy: The strawberry plant shows healthy green leaves and vibrant fruit, indicating proper hydration and nutrition. There are no visible signs of wilting, n', '2025-11-28 12:19:35'),
(84, 18, 24, 444, 103, 'prune', '2025-11-28 00:00:00', 'Completed pruneing for Grape', '2025-11-28 12:23:04'),
(85, 18, 24, 444, 103, 'water', '2025-11-28 00:00:00', 'Completed watering for Grape', '2025-11-28 12:23:07'),
(86, 18, 24, 444, 103, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Unhealthy to Unknown: AI analysis completed but response format unclear: I\'m unable to analyze images of grape plants. The image provided contains strawberries. Can you pro', '2025-11-28 12:23:32'),
(87, 18, 24, 444, 103, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Unhealthy to Unknown: AI analysis completed but response format unclear: I\'m sorry, I can\'t assist with that....', '2025-11-28 12:24:41'),
(88, 18, 24, 434, 102, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Healthy to Unhealthy: The image shows a fruiting strawberry plant with one healthy berry and one shriveled, possibly indicating dehydration or inconsistent watering. Shrive', '2025-11-28 12:26:08'),
(89, 18, 24, 434, 102, 'water', '2025-11-28 00:00:00', 'Completed watering for Strawberry', '2025-11-28 12:26:21'),
(90, 18, 24, 434, 102, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Unhealthy to Healthy: The strawberry plant shows healthy, vibrant foliage and ripe fruit, with no visible signs of water stress, nutrient deficiency, or the need for prunin', '2025-11-28 12:26:40'),
(91, 18, 24, 434, 102, 'health_change', '2025-11-28 00:00:00', 'Health status remains Healthy: The strawberry plant has healthy, lush green leaves and vibrant red fruit, indicating it is well-watered, adequately fertilized, and does not require ', '2025-11-28 12:29:17'),
(92, 18, 24, 434, 102, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Healthy to Unhealthy: The image shows one strawberry with signs of dehydration and wilting. There is also a decaying strawberry present, indicating a need for pruning.', '2025-11-28 12:29:34'),
(93, 18, 24, 437, 105, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Healthy to Unhealthy: The grapes appear shriveled and dehydrated, which indicates a need for water. Some grapes are damaged, suggesting a need for pruning.', '2025-11-28 12:50:08'),
(94, 18, 24, 437, 105, 'water', '2025-11-28 00:00:00', 'Completed watering for Grape', '2025-11-28 12:50:39'),
(95, 18, 24, 437, 105, 'prune', '2025-11-28 00:00:00', 'Completed pruneing for Grape', '2025-11-28 12:50:41'),
(96, 18, 24, 437, 105, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Unhealthy to Healthy: The leaves appear healthy and green without signs of wilting, yellowing, or overgrowth.', '2025-11-28 12:51:17'),
(97, 18, 24, 447, 106, 'prune', '2025-11-28 00:00:00', 'Completed pruneing for Sunflower', '2025-11-28 12:53:04'),
(98, 18, 24, 447, 106, 'water', '2025-11-28 00:00:00', 'Completed watering for Sunflower', '2025-11-28 12:53:06'),
(99, 18, 24, 447, 106, 'health_change', '2025-11-28 00:00:00', 'Health status changed from Unhealthy to Healthy: The sunflower appears healthy with vibrant green leaves and no visible signs of wilting, yellowing, or damaged leaves.', '2025-11-28 12:53:23'),
(171, 24, 32, 896, 134, 'health_change', '2025-12-06 00:00:00', 'Initial health status: Healthy: The strawberry plant shows healthy, green leaves and vibrant, red fruit. No signs of dehydration, nutrient deficiency, or overgrowth are visible.', '2025-12-06 04:39:25'),
(172, 24, 32, 896, 134, 'health_change', '2025-12-07 00:00:00', 'Health status changed from Healthy to Unhealthy: The image shows wilted leaves and a dried, brownish strawberry indicating dehydration. Additionally, there is evidence of damaged and possibly disease', '2025-12-07 04:41:26'),
(173, 24, 32, 896, 134, 'water', '2025-12-07 00:00:00', 'Completed watering for Strawberry', '2025-12-07 04:41:37'),
(174, 24, 32, 896, 134, 'prune', '2025-12-07 00:00:00', 'Completed pruneing for Strawberry', '2025-12-07 04:41:39'),
(175, 24, 32, 896, 134, 'prune', '2025-12-06 00:00:00', 'Completed pruneing for Strawberry', '2025-12-06 04:43:19'),
(176, 24, 32, 897, 135, 'health_change', '2025-12-06 00:00:00', 'Initial health status: Unhealthy: The grapes appear shriveled, indicating underwatering, and some fruit is damaged, suggesting pruning is needed.', '2025-12-06 04:43:42'),
(177, 24, 32, 897, 135, 'water', '2025-12-06 00:00:00', 'Completed watering for Grape', '2025-12-06 04:44:07'),
(178, 24, 32, 897, 135, 'prune', '2025-12-06 00:00:00', 'Completed pruneing for Grape', '2025-12-06 04:44:08'),
(233, 29, 41, 1520, 164, 'health_change', '2025-12-10 00:00:00', 'Initial health status: Healthy: The Aloe Vera plant shows healthy green leaves without signs of wilting, drooping, or damage. The soil is not visibly dry, and there are no signs of n', '2025-12-10 05:25:08'),
(234, 29, 41, 1522, 163, 'health_change', '2025-12-10 00:00:00', 'Initial health status: Needs Care: One strawberry is moldy and there\'s potential dead plant material present, indicating a need for pruning.', '2025-12-10 05:25:46'),
(235, 29, 41, 1522, 163, 'prune', '2025-12-10 00:00:00', 'Completed pruneing for Strawberry', '2025-12-10 05:26:07'),
(236, 29, 41, 1524, 165, 'health_change', '2025-12-10 00:00:00', 'Initial health status: Unhealthy: The grapes appear shriveled, indicating possible dehydration. Some leaves are damaged, suggesting a need for pruning.', '2025-12-10 05:28:56'),
(237, 29, 41, 1524, 165, 'water', '2025-12-10 00:00:00', 'Completed watering for Grape', '2025-12-10 05:29:27'),
(238, 29, 41, 1524, 165, 'prune', '2025-12-10 00:00:00', 'Completed pruneing for Grape', '2025-12-10 05:29:29'),
(239, 29, 41, 1522, 163, 'health_change', '2025-12-11 00:00:00', 'Health status changed from Needs Care to Healthy: The strawberry plant has vibrant, healthy green leaves and ripe strawberries. There are no visible signs of wilted leaves, browning, or stunted growth', '2025-12-11 05:37:36');

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
(1, 'admin', 'admin@egrowtify.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G', 'System Administrator', 1, 1, '2025-10-09 18:03:33', NULL),
(3, 'louie', 'johnlouie3211@gmail.com', 'pbkdf2:sha256:600000$E2oLvNfHQbJCeA7r$3da9b4f74912c923b5ca326a0a9a04fd8950db110d448d81c332b423efecfce4', 'louie purisima', 0, 1, '2025-12-09 16:51:10', '2025-12-10 00:51:38');

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `priority` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_notifications`
--

INSERT INTO `admin_notifications` (`id`, `title`, `message`, `type`, `priority`, `is_active`, `created_by`, `created_at`, `updated_at`, `expires_at`) VALUES
(19, 'Maintenance', 'Do not log in at 2:00 PM', 'Maintenance', 'Medium', 1, 20, '2025-12-10 05:14:48', '2025-12-10 05:14:48', NULL),
(20, 'update', 'new update, please don\'t log in at 2:00 PM', 'Update', 'High', 1, 20, '2025-12-10 05:35:47', '2025-12-10 05:35:47', NULL);

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
(101, 18, 3, 0, '2025-11-28 11:06:40', '2025-11-28 12:52:04'),
(121, 24, 0, 0, '2025-12-06 04:37:24', '2025-12-06 12:48:19'),
(139, 29, 5, 0, '2025-12-10 05:22:00', '2025-12-11 05:37:36');

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
(24, 18, 'plant_analysis', NULL, 'Strawberry', 0.00, 1, '2025-11-28 11:06:44'),
(25, 18, 'soil_analysis', NULL, 'The soil appears dry, as indicated by its crumbly texture and light color.', 0.00, 1, '2025-11-28 11:19:40'),
(26, 18, 'plant_analysis', NULL, 'Sunflower', 0.00, 1, '2025-11-28 11:32:16'),
(27, 18, 'plant_analysis', NULL, 'Pumpkin', 0.00, 1, '2025-11-28 11:35:06'),
(28, 18, 'plant_analysis', NULL, 'water-lily tulip', 0.00, 1, '2025-11-28 11:36:22'),
(29, 18, 'plant_analysis', NULL, 'Tomato', 20.00, 0, '2025-11-28 11:37:00'),
(30, 18, 'plant_analysis', NULL, 'Strawberry', 20.00, 0, '2025-11-28 12:12:32'),
(31, 18, 'plant_analysis', NULL, 'Grape', 20.00, 0, '2025-11-28 12:20:58'),
(32, 18, 'plant_analysis', NULL, 'Banana', 20.00, 0, '2025-11-28 12:34:55'),
(33, 18, 'plant_analysis', NULL, 'Grape', 20.00, 0, '2025-11-28 12:49:02'),
(34, 18, 'plant_analysis', NULL, 'Sunflower', 20.00, 0, '2025-11-28 12:52:04'),
(119, 24, 'plant_analysis', NULL, 'Aloe Vera', 0.00, 1, '2025-12-06 04:37:27'),
(120, 24, 'plant_analysis', NULL, 'Strawberry', 0.00, 1, '2025-12-06 04:38:22'),
(121, 24, 'plant_analysis', 'uploads/plants/space_896_1764995960.jpeg', 'The strawberry plant shows healthy, green leaves and vibrant, red fruit. No signs of dehydration, nutrient deficiency, or overgrowth are visible.', 0.00, 1, '2025-12-06 04:39:25'),
(122, 24, 'plant_analysis', 'uploads/plants/space_896_1765082480.jpeg', 'The image shows wilted leaves and a dried, brownish strawberry indicating dehydration. Additionally, there is evidence of damaged and possibly diseased fruit that needs pruning.', 20.00, 0, '2025-12-07 04:41:26'),
(123, 24, 'plant_analysis', NULL, 'Grape', 20.00, 0, '2025-12-07 04:42:14'),
(124, 24, 'plant_analysis', 'uploads/plants/space_897_1764996216.jpeg', 'The grapes appear shriveled, indicating underwatering, and some fruit is damaged, suggesting pruning is needed.', 20.00, 0, '2025-12-06 04:43:42'),
(125, 24, 'soil_analysis', NULL, 'The soil appears moderately moist, indicated by its dark color and slight sheen, suggesting good water retention.', 0.00, 1, '2025-12-06 04:48:11'),
(196, 29, 'plant_analysis', NULL, 'Strawberry', 0.00, 1, '2025-12-10 05:22:02'),
(197, 29, 'plant_analysis', NULL, 'Aloe Vera', 0.00, 1, '2025-12-10 05:22:39'),
(198, 29, 'plant_analysis', 'uploads/plants/space_1520_1765344299.jpeg', 'The Aloe Vera plant shows healthy green leaves without signs of wilting, drooping, or damage. The soil is not visibly dry, and there are no signs of nutrient deficiency or overgrowth.', 0.00, 1, '2025-12-10 05:25:08'),
(199, 29, 'plant_analysis', 'uploads/plants/space_1522_1765344342.jpeg', 'One strawberry is moldy and there\'s potential dead plant material present, indicating a need for pruning.', 0.00, 1, '2025-12-10 05:25:46'),
(200, 29, 'plant_analysis', NULL, 'Grape', 0.00, 1, '2025-12-10 05:26:54'),
(201, 29, 'soil_analysis', NULL, 'The soil appears to have a moderate moisture level, indicated by its dark color and crumbly texture, suggesting it is neither too dry nor too wet.', 0.00, 1, '2025-12-10 05:27:50'),
(202, 29, 'plant_analysis', 'uploads/plants/space_1524_1765344531.jpeg', 'The grapes appear shriveled, indicating possible dehydration. Some leaves are damaged, suggesting a need for pruning.', 0.00, 1, '2025-12-10 05:28:56'),
(203, 29, 'plant_analysis', 'uploads/plants/space_1522_1765431452.jpeg', 'The strawberry plant has vibrant, healthy green leaves and ripe strawberries. There are no visible signs of wilted leaves, browning, or stunted growth.', 0.00, 1, '2025-12-11 05:37:36');

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
(6, NULL, 'sdfasd', 'sdafasdfsa', 5, 'general', 'pending', NULL, '2025-11-22 08:52:34'),
(7, NULL, 'bug', 'Please fix this bug', 5, 'general', 'resolved', 'okay po', '2025-12-03 17:07:27'),
(8, NULL, 'very nicw', 'very user friendly', 5, 'general', 'resolved', 'thank you', '2025-12-10 05:13:51');

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
(19, 18, 'rizada', 'mixed', 'Manila', 'Philippines', '2025-11-24 10:21:30', '3x3', 9, 0, 2),
(24, 18, 'purisima', 'mixed', 'Cebu City', 'Philippines', '2025-11-28 12:10:44', '3x3', 9, 0, 0),
(32, 24, 'Rizada', 'mixed', 'Cebu City', 'Philippines', '2025-12-06 04:35:50', '3x3', 9, 0, 2),
(41, 29, 'riziada', 'mixed', NULL, 'Philippines', '2025-12-10 05:21:41', '6x6', 36, 0, 0);

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
(210, 19, '1,1', 85, '2025-11-24', '2025-11-28', NULL, '2025-11-28', 'Placed via drag and drop', 1, '2025-11-24 10:21:30', 'uploads/plants/space_210_1764331714.jpeg', '{\"needs_water\": false, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.3, \"reasoning\": \"AI analysis completed but response format unclear: I\'m sorry, I can\'t assist with that....\"}', '2025-11-28 12:08:39'),
(211, 19, '1,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(212, 19, '1,3', 97, '2025-11-28', '2025-11-28', NULL, '2025-11-28', 'Placed via drag and drop', 1, '2025-11-24 10:21:30', 'uploads/plants/space_212_1764328063.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.8, \"reasoning\": \"The soil appears dry, and there is a presence of a moldy or decayed strawberry, indicating potential overgrowth or damaged areas that need pruning.\"}', '2025-11-28 11:08:21'),
(213, 19, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(214, 19, '2,2', 98, '2025-11-28', NULL, NULL, '2025-11-28', 'Placed via drag and drop', 1, '2025-11-24 10:21:30', 'uploads/plants/space_214_1764329563.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.8, \"reasoning\": \"The sunflower has wilted and drooping petals, indicating dehydration. There are also some damaged and shriveled areas on the flower head that suggest the need for pruning.\"}', '2025-11-28 11:33:13'),
(215, 19, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-24 10:21:30', NULL, NULL, '2025-11-24 10:21:30'),
(372, 19, '1,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-28 11:17:58', NULL, NULL, '2025-11-28 11:17:58'),
(373, 19, '1,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-28 11:17:58', NULL, NULL, '2025-11-28 11:17:58'),
(374, 19, '1,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-28 11:17:58', NULL, NULL, '2025-11-28 11:17:58'),
(431, 24, '1,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-28 12:10:44', NULL, NULL, '2025-11-28 12:10:44'),
(434, 24, '1,2', 102, '2025-11-28', '2025-11-28', NULL, '2025-11-28', 'Placed via drag and drop', 1, '2025-11-28 12:10:44', 'uploads/plants/space_434_1764332970.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.8, \"reasoning\": \"The image shows one strawberry with signs of dehydration and wilting. There is also a decaying strawberry present, indicating a need for pruning.\"}', '2025-11-28 12:29:34'),
(437, 24, '1,3', 105, '2025-11-28', '2025-11-28', NULL, '2025-11-28', 'Placed via drag and drop', 1, '2025-11-28 12:10:44', 'uploads/plants/space_437_1764334273.jpeg', '{\"needs_water\": false, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.9, \"reasoning\": \"The leaves appear healthy and green without signs of wilting, yellowing, or overgrowth.\"}', '2025-11-28 12:51:17'),
(439, 24, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-28 12:10:44', NULL, NULL, '2025-11-28 12:10:44'),
(444, 24, '2,2', 103, '2025-11-28', '2025-11-28', NULL, '2025-11-28', 'Placed via drag and drop', 1, '2025-11-28 12:10:44', 'uploads/plants/space_444_1764332678.jpeg', '{\"needs_water\": false, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.3, \"reasoning\": \"AI analysis completed but response format unclear: I\'m sorry, I can\'t assist with that....\"}', '2025-11-28 12:24:41'),
(447, 24, '2,3', 106, '2025-11-28', '2025-11-28', NULL, '2025-11-28', 'Placed via drag and drop', 1, '2025-11-28 12:10:44', 'uploads/plants/space_447_1764334399.jpeg', '{\"needs_water\": false, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.9, \"reasoning\": \"The sunflower appears healthy with vibrant green leaves and no visible signs of wilting, yellowing, or damaged leaves.\"}', '2025-11-28 12:53:23'),
(449, 24, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-28 12:10:44', NULL, NULL, '2025-11-28 12:10:44'),
(451, 24, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-28 12:10:44', NULL, NULL, '2025-11-28 12:10:44'),
(452, 24, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-11-28 12:10:44', NULL, NULL, '2025-11-28 12:10:44'),
(896, 32, '1,1', 134, '2025-12-06', '2025-12-07', NULL, '2025-12-06', 'Placed via drag and drop', 1, '2025-12-06 04:35:50', 'uploads/plants/space_896_1765082480.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.8, \"reasoning\": \"The image shows wilted leaves and a dried, brownish strawberry indicating dehydration. Additionally, there is evidence of damaged and possibly diseased fruit that needs pruning.\"}', '2025-12-06 04:43:19'),
(897, 32, '1,2', 135, '2025-12-06', '2025-12-06', NULL, '2025-12-06', 'Placed via drag and drop', 1, '2025-12-06 04:35:50', 'uploads/plants/space_897_1764996216.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.9, \"reasoning\": \"The grapes appear shriveled, indicating underwatering, and some fruit is damaged, suggesting pruning is needed.\"}', '2025-12-06 04:44:08'),
(898, 32, '1,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-06 04:35:50', NULL, NULL, '2025-12-06 04:35:50'),
(899, 32, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-06 04:35:50', NULL, NULL, '2025-12-06 04:35:50'),
(900, 32, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-06 04:35:50', NULL, NULL, '2025-12-06 04:35:50'),
(901, 32, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-06 04:35:50', NULL, NULL, '2025-12-06 04:35:50'),
(905, 32, '1,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-06 12:48:19', NULL, NULL, '2025-12-06 12:48:19'),
(906, 32, '1,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-06 12:48:19', NULL, NULL, '2025-12-06 12:48:19'),
(907, 32, '1,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-06 12:48:19', NULL, NULL, '2025-12-06 12:48:19'),
(1520, 41, '1,1', 164, '2025-12-10', NULL, NULL, NULL, 'Placed via drag and drop', 1, '2025-12-10 05:21:41', 'uploads/plants/space_1520_1765344299.jpeg', '{\"needs_water\": false, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.9, \"reasoning\": \"The Aloe Vera plant shows healthy green leaves without signs of wilting, drooping, or damage. The soil is not visibly dry, and there are no signs of nutrient deficiency or overgrowth.\"}', '2025-12-10 05:25:08'),
(1522, 41, '1,2', 163, '2025-12-10', NULL, NULL, '2025-12-10', 'Placed via drag and drop', 1, '2025-12-10 05:21:41', 'uploads/plants/space_1522_1765431452.jpeg', '{\"needs_water\": false, \"needs_fertilize\": false, \"needs_prune\": false, \"confidence\": 0.8, \"reasoning\": \"The strawberry plant has vibrant, healthy green leaves and ripe strawberries. There are no visible signs of wilted leaves, browning, or stunted growth.\"}', '2025-12-11 05:37:36'),
(1524, 41, '1,3', 165, '2025-12-10', '2025-12-10', NULL, '2025-12-10', 'Placed via drag and drop', 1, '2025-12-10 05:21:41', 'uploads/plants/space_1524_1765344531.jpeg', '{\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.8, \"reasoning\": \"The grapes appear shriveled, indicating possible dehydration. Some leaves are damaged, suggesting a need for pruning.\"}', '2025-12-10 05:29:29'),
(1526, 41, '2,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:21:41', NULL, NULL, '2025-12-10 05:21:41'),
(1528, 41, '2,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:21:41', NULL, NULL, '2025-12-10 05:21:41'),
(1530, 41, '2,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:21:41', NULL, NULL, '2025-12-10 05:21:41'),
(1532, 41, '3,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:21:41', NULL, NULL, '2025-12-10 05:21:41'),
(1534, 41, '3,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:21:41', NULL, NULL, '2025-12-10 05:21:41'),
(1536, 41, '3,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:21:41', NULL, NULL, '2025-12-10 05:21:41'),
(1538, 41, '1,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1539, 41, '1,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1540, 41, '1,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1541, 41, '2,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1542, 41, '2,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1543, 41, '2,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1544, 41, '3,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1545, 41, '3,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1546, 41, '3,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1547, 41, '4,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1548, 41, '4,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1549, 41, '4,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1550, 41, '4,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1551, 41, '4,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1552, 41, '4,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1553, 41, '5,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1554, 41, '5,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1555, 41, '5,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1556, 41, '5,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1557, 41, '5,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1558, 41, '5,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1559, 41, '6,1', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1560, 41, '6,2', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1561, 41, '6,3', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1562, 41, '6,4', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1563, 41, '6,5', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36'),
(1564, 41, '6,6', NULL, NULL, NULL, NULL, NULL, '', 1, '2025-12-10 05:24:36', NULL, NULL, '2025-12-10 05:24:36');

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

--
-- Dumping data for table `learning_path_content`
--

INSERT INTO `learning_path_content` (`id`, `path_difficulty`, `module_id`, `content_type`, `content_id`, `title`, `content`, `media_type`, `media_url`, `media_description`, `question_number`, `is_active`, `created_at`, `updated_at`) VALUES
(13, 'Beginner', 'basic-information', 'module', 0, 'Basic Information - Getting Started', '{\"description\": \"Essential information every beginner gardener needs to know\", \"difficulty\": \"Beginner\", \"estimatedTime\": \"25 min\", \"id\": \"basic-information\", \"images\": [], \"lessons\": [{\"id\": 1, \"content\": \"Welcome to the wonderful world of gardening! Gardening is a rewarding hobby that connects you with nature and provides fresh produce, beautiful flowers, and a sense of accomplishment.\", \"images\": [], \"points\": [\"\\ud83c\\udf31 Gardening is accessible to everyone, regardless of space or experience\", \"\\ud83c\\udf3f Start small with a few plants to build confidence\", \"\\ud83d\\udca7 Understanding your local climate and growing season is crucial\", \"\\ud83c\\udf1e Most plants need 6-8 hours of sunlight daily\", \"\\ud83d\\udca1 Gardening teaches patience and observation skills\", \"\\ud83c\\udfaf Set realistic goals for your first growing season\"], \"title\": \"Introduction to Gardening\", \"videos\": []}, {\"id\": 2, \"content\": \"You don\'t need expensive equipment to start gardening. Here are the essential tools every beginner should have:\", \"images\": [], \"points\": [\"\\ud83e\\udeb4 Containers with drainage holes (or garden space)\", \"\\ud83c\\udf31 Quality potting mix or garden soil\", \"\\ud83d\\udca7 Watering can or hose with gentle spray\", \"\\u2702\\ufe0f Pruning shears for trimming plants\", \"\\ud83c\\udf3f Plant labels to track what you\'re growing\", \"\\ud83d\\udccf Basic measuring tools for spacing\"], \"title\": \"Essential Tools and Supplies\", \"videos\": []}], \"quiz\": {\"id\": \"quiz-1765131671921-btdky8phu\", \"title\": \"Basic Information Quiz\", \"questions\": [{\"id\": 1, \"question\": \"How many hours of sunlight do most plants need daily?\", \"options\": [\"2-4 hours\", \"6-8 hours\", \"10-12 hours\", \"All day\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Most plants need 6-8 hours of direct sunlight daily to thrive and produce flowers or fruits.\", \"image\": null, \"video\": null, \"required\": true}, {\"id\": 2, \"question\": \"What is the best approach for beginner gardeners?\", \"options\": [\"Start with 20+ plants\", \"Start with 3-5 plants\", \"Start with only one plant\", \"Start with a full garden\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Starting with 3-5 plants allows you to give each plant proper attention and learn their specific needs without feeling overwhelmed.\", \"image\": null, \"video\": null, \"required\": true}, {\"id\": 1765131638253, \"question\": \"3rd question\", \"options\": [\"correct\", \"wrong\"], \"correct\": 0, \"explanation\": \"\", \"image\": null, \"video\": null, \"required\": false}, {\"id\": 1765131639949, \"question\": \"4th\", \"options\": [\"correct\", \"wrong\"], \"correct\": 0, \"explanation\": \"\", \"image\": null, \"video\": null, \"required\": false}], \"images\": [], \"videos\": []}, \"title\": \"Basic Information - Getting Started\", \"videos\": [], \"quizzes\": [{\"id\": \"quiz-1765131671921-btdky8phu\", \"title\": \"Basic Information Quiz\", \"questions\": [{\"id\": 1, \"question\": \"How many hours of sunlight do most plants need daily?\", \"options\": [\"2-4 hours\", \"6-8 hours\", \"10-12 hours\", \"All day\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Most plants need 6-8 hours of direct sunlight daily to thrive and produce flowers or fruits.\", \"image\": null, \"video\": null, \"required\": true}, {\"id\": 2, \"question\": \"What is the best approach for beginner gardeners?\", \"options\": [\"Start with 20+ plants\", \"Start with 3-5 plants\", \"Start with only one plant\", \"Start with a full garden\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Starting with 3-5 plants allows you to give each plant proper attention and learn their specific needs without feeling overwhelmed.\", \"image\": null, \"video\": null, \"required\": true}, {\"id\": 1765131638253, \"question\": \"3rd question\", \"options\": [\"correct\", \"wrong\"], \"correct\": 0, \"explanation\": \"\", \"image\": null, \"video\": null, \"required\": false}, {\"id\": 1765131639949, \"question\": \"4th\", \"options\": [\"correct\", \"wrong\"], \"correct\": 0, \"explanation\": \"\", \"image\": null, \"video\": null, \"required\": false}], \"images\": [], \"videos\": []}]}', NULL, NULL, NULL, NULL, 1, '2025-12-03 17:05:24', '2025-12-10 05:09:10'),
(14, 'Beginner', 'lessons', 'module', 0, 'Essential Lessons - Core Gardening Skills', '{\"description\": \"Learn the fundamental skills needed for successful gardening\", \"difficulty\": \"Beginner\", \"estimatedTime\": \"30 min\", \"id\": \"lessons\", \"images\": [], \"lessons\": [{\"id\": 1, \"content\": \"Proper watering is the foundation of plant care. Understanding when and how to water is crucial for plant health.\", \"images\": [], \"points\": [\"\\ud83d\\udca7 Water when the top inch of soil feels dry to touch\", \"\\ud83c\\udf31 Water deeply but less frequently to encourage strong roots\", \"\\ud83c\\udf3f Water in the morning to allow leaves to dry before evening\", \"\\ud83d\\udeab Avoid overwatering - it\'s the #1 cause of plant death\", \"\\ud83d\\udca1 Different plants have different water needs - observe your plants\", \"\\ud83c\\udf27\\ufe0f Adjust watering based on weather and season\"], \"title\": \"Watering Basics\", \"videos\": []}, {\"id\": 2, \"content\": \"Understanding light needs helps you place plants in the right location for optimal growth.\", \"images\": [], \"points\": [\"\\u2600\\ufe0f Full sun: 6+ hours of direct sunlight (vegetables, most flowers)\", \"\\ud83c\\udf24\\ufe0f Partial sun: 3-6 hours of direct sunlight (many herbs, some flowers)\", \"\\ud83c\\udf25\\ufe0f Partial shade: 2-4 hours of direct sunlight (leafy greens, some houseplants)\", \"\\ud83c\\udf11 Full shade: Less than 2 hours of direct sunlight (ferns, some houseplants)\", \"\\ud83e\\ude9f Indoor plants: Place near windows based on their light needs\", \"\\ud83d\\udd04 Rotate indoor plants regularly for even growth\"], \"title\": \"Light Requirements\", \"videos\": []}], \"quiz\": {\"id\": \"quiz-1765342852657-fcs9jqvo8\", \"title\": \"Essential Lessons Quiz\", \"questions\": [{\"id\": 1, \"question\": \"When should you water your plants?\", \"options\": [\"Every day at the same time\", \"When the top inch of soil feels dry\", \"Only when leaves droop\", \"Once a week regardless\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Water when the top inch of soil feels dry. This ensures plants get water when needed without overwatering.\", \"image\": null, \"video\": null, \"required\": true}, {\"id\": 2, \"question\": \"What does \\\"full sun\\\" mean?\", \"options\": [\"All day sunlight\", \"6+ hours of direct sunlight\", \"Bright indirect light\", \"Morning sun only\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Full sun means 6 or more hours of direct sunlight daily. Most vegetables and flowering plants need full sun.\", \"image\": null, \"video\": null, \"required\": true}, {\"id\": 1765342815843, \"question\": \"question 3\", \"options\": [\"wrong\", \"correct\"], \"correct\": 1, \"explanation\": \"correct\", \"image\": null, \"video\": null, \"required\": false}], \"images\": [], \"videos\": []}, \"title\": \"Essential Lessons - Core Gardening Skills\", \"videos\": [], \"quizzes\": [{\"id\": \"quiz-1765342852657-fcs9jqvo8\", \"title\": \"Essential Lessons Quiz\", \"questions\": [{\"id\": 1, \"question\": \"When should you water your plants?\", \"options\": [\"Every day at the same time\", \"When the top inch of soil feels dry\", \"Only when leaves droop\", \"Once a week regardless\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Water when the top inch of soil feels dry. This ensures plants get water when needed without overwatering.\", \"image\": null, \"video\": null, \"required\": true}, {\"id\": 2, \"question\": \"What does \\\"full sun\\\" mean?\", \"options\": [\"All day sunlight\", \"6+ hours of direct sunlight\", \"Bright indirect light\", \"Morning sun only\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Full sun means 6 or more hours of direct sunlight daily. Most vegetables and flowering plants need full sun.\", \"image\": null, \"video\": null, \"required\": true}, {\"id\": 1765342815843, \"question\": \"question 3\", \"options\": [\"wrong\", \"correct\"], \"correct\": 1, \"explanation\": \"correct\", \"image\": null, \"video\": null, \"required\": false}], \"images\": [], \"videos\": []}]}', NULL, NULL, NULL, NULL, 1, '2025-12-03 17:05:25', '2025-12-10 05:09:10'),
(15, 'Beginner', 'quizzes', 'module', 0, 'Knowledge Check - Test Your Understanding', '{\"id\": \"quizzes\", \"title\": \"Knowledge Check - Test Your Understanding\", \"difficulty\": \"Beginner\", \"estimatedTime\": \"20 min\", \"description\": \"Test your knowledge with comprehensive quizzes covering all beginner topics\", \"lessons\": [{\"id\": 1, \"title\": \"Preparing for Quizzes\", \"content\": \"Quizzes help reinforce what you\'ve learned and identify areas that need more attention. Take your time and think through each question.\", \"points\": [\"\\ud83d\\udcda Review the lessons before taking quizzes\", \"\\ud83e\\udd14 Read each question carefully\", \"\\ud83d\\udcad Think about what you learned in the lessons\", \"\\u2705 Don\'t worry about perfect scores - learning is the goal\", \"\\ud83d\\udd04 You can retake quizzes to improve your understanding\", \"\\ud83d\\udcdd Review explanations to understand why answers are correct\"], \"images\": [], \"videos\": []}], \"quiz\": {\"title\": \"Comprehensive Beginner Quiz\", \"questions\": [{\"id\": 1, \"question\": \"What is the most common cause of plant death for beginners?\", \"options\": [\"Too little sunlight\", \"Overwatering\", \"Not enough fertilizer\", \"Wrong container size\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Overwatering is the #1 cause of plant death. It leads to root rot and prevents roots from getting oxygen.\", \"required\": true}, {\"id\": 2, \"question\": \"Which tool is essential for all container gardens?\", \"options\": [\"Expensive fertilizer\", \"Drainage holes in containers\", \"Grow lights\", \"Automatic watering system\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Drainage holes are absolutely essential. Without them, water accumulates and causes root rot.\", \"required\": true}, {\"id\": 3, \"question\": \"What should you do if a plant shows yellow leaves?\", \"options\": [\"Water more frequently\", \"Check for overwatering or nutrient issues\", \"Move to full sun immediately\", \"Add more fertilizer\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Yellow leaves can indicate overwatering, underwatering, or nutrient deficiency. Check the soil and plant conditions first.\", \"required\": true}]}, \"images\": [], \"videos\": []}', NULL, NULL, NULL, NULL, 1, '2025-12-03 17:05:25', '2025-12-10 05:09:10'),
(16, 'Intermediate', 'basic-information', 'module', 0, 'Advanced Information - Deepening Your Knowledge', '{\"id\": \"basic-information\", \"title\": \"Advanced Information - Deepening Your Knowledge\", \"difficulty\": \"Intermediate\", \"estimatedTime\": \"30 min\", \"description\": \"Expand your understanding with advanced gardening concepts and techniques\", \"lessons\": [{\"id\": 1, \"title\": \"Plant Nutrition and Fertilization\", \"content\": \"Understanding plant nutrition helps you provide the right nutrients at the right time for optimal growth and productivity.\", \"points\": [\"\\ud83c\\udf3f NPK Ratio: Nitrogen (N) for leaves, Phosphorus (P) for roots/flowers, Potassium (K) for overall health\", \"\\u23f0 Fertilize during active growth periods (spring/summer)\", \"\\ud83c\\udf31 Organic fertilizers feed soil life and release slowly\", \"\\u26a1 Synthetic fertilizers provide quick nutrients but don\'t improve soil\", \"\\ud83d\\udcca Test soil before fertilizing to know what your plants need\", \"\\ud83d\\udca7 Water before and after fertilizing to prevent root burn\"], \"images\": [], \"videos\": []}, {\"id\": 2, \"title\": \"Pest and Disease Management\", \"content\": \"Preventing and managing pests and diseases is crucial for maintaining healthy plants.\", \"points\": [\"\\ud83d\\udd0d Regular inspection helps catch problems early\", \"\\ud83c\\udf3f Healthy plants are naturally more resistant to pests and diseases\", \"\\ud83e\\udeb4 Proper spacing improves air circulation and reduces disease spread\", \"\\ud83e\\uddea Identify problems correctly before treating\", \"\\ud83c\\udf31 Use organic methods first (neem oil, insecticidal soap)\", \"\\ud83d\\udd04 Rotate crops to prevent pest and disease buildup\"], \"images\": [], \"videos\": []}], \"quiz\": {\"title\": \"Advanced Information Quiz\", \"questions\": [{\"id\": 1, \"question\": \"What does the \\\"P\\\" in NPK fertilizer stand for?\", \"options\": [\"Potassium\", \"Phosphorus\", \"Protein\", \"Photosynthesis\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! P stands for Phosphorus, which is essential for root development, flowering, and fruiting.\", \"required\": true}, {\"id\": 2, \"question\": \"When is the best time to fertilize plants?\", \"options\": [\"Only in winter\", \"During active growth periods\", \"Every day\", \"Only when plants show problems\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Fertilize during active growth periods (spring and summer) when plants can use the nutrients most effectively.\", \"required\": true}]}, \"images\": [], \"videos\": []}', NULL, NULL, NULL, NULL, 1, '2025-12-03 17:05:25', '2025-12-10 05:08:57'),
(17, 'Intermediate', 'lessons', 'module', 0, 'Advanced Lessons - Mastering Techniques', '{\"id\": \"lessons\", \"title\": \"Advanced Lessons - Mastering Techniques\", \"difficulty\": \"Intermediate\", \"estimatedTime\": \"35 min\", \"description\": \"Learn advanced techniques to take your gardening to the next level\", \"lessons\": [{\"id\": 1, \"title\": \"Pruning and Training Plants\", \"content\": \"Proper pruning and training techniques help plants grow stronger and produce better yields.\", \"points\": [\"\\u2702\\ufe0f Prune to remove dead, damaged, or diseased growth\", \"\\ud83c\\udf3f Prune to shape plants and encourage bushier growth\", \"\\ud83c\\udf45 Pinch suckers on tomatoes for better fruit production\", \"\\ud83c\\udf31 Train vining plants with supports for better air circulation\", \"\\u23f0 Prune at the right time for each plant type\", \"\\ud83e\\uddf9 Use clean, sharp tools to prevent disease spread\"], \"images\": [], \"videos\": []}, {\"id\": 2, \"title\": \"Companion Planting\", \"content\": \"Companion planting uses beneficial plant relationships to improve growth and deter pests.\", \"points\": [\"\\ud83c\\udf31 Some plants help each other when grown together\", \"\\ud83c\\udf3f Marigolds repel many garden pests\", \"\\ud83c\\udf3e Tall plants can provide shade for shade-loving plants\", \"\\ud83e\\udd8b Some plants attract beneficial insects\", \"\\ud83d\\udeab Some plant combinations should be avoided\", \"\\ud83d\\udcca Plan your garden layout with companion planting in mind\"], \"images\": [], \"videos\": []}], \"quiz\": {\"title\": \"Advanced Lessons Quiz\", \"questions\": [{\"id\": 1, \"question\": \"Why should you prune plants?\", \"options\": [\"To make them smaller\", \"To remove dead/damaged growth and encourage healthy growth\", \"To reduce watering needs\", \"To make them grow faster\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Pruning removes dead, damaged, or diseased growth and encourages plants to grow stronger and produce better yields.\", \"required\": true}, {\"id\": 2, \"question\": \"What is companion planting?\", \"options\": [\"Growing only one type of plant\", \"Using beneficial plant relationships\", \"Growing plants in pairs\", \"Growing plants far apart\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Companion planting uses beneficial relationships between plants to improve growth, deter pests, and maximize garden productivity.\", \"required\": true}]}, \"images\": [], \"videos\": []}', NULL, NULL, NULL, NULL, 1, '2025-12-03 17:05:26', '2025-12-10 05:08:57'),
(18, 'Intermediate', 'quizzes', 'module', 0, 'Advanced Knowledge Assessment', '{\"id\": \"quizzes\", \"title\": \"Advanced Knowledge Assessment\", \"difficulty\": \"Intermediate\", \"estimatedTime\": \"25 min\", \"description\": \"Test your intermediate gardening knowledge with comprehensive assessments\", \"lessons\": [{\"id\": 1, \"title\": \"Review and Assessment\", \"content\": \"These quizzes test your understanding of intermediate gardening concepts. Review the lessons and apply what you\'ve learned.\", \"points\": [\"\\ud83d\\udcd6 Review all intermediate lessons before taking quizzes\", \"\\ud83e\\udde0 Apply concepts to real gardening situations\", \"\\ud83d\\udca1 Think about how techniques work together\", \"\\ud83d\\udcdd Note areas where you need more practice\", \"\\ud83d\\udd04 Use quiz results to guide further learning\", \"\\u2705 Celebrate your progress and knowledge growth\"], \"images\": [], \"videos\": []}], \"quiz\": {\"title\": \"Comprehensive Intermediate Quiz\", \"questions\": [{\"id\": 1, \"question\": \"What is the primary benefit of organic fertilizers?\", \"options\": [\"They work faster\", \"They feed soil life and improve soil structure\", \"They cost less\", \"They last longer\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Organic fertilizers feed beneficial soil microorganisms and improve soil structure over time, creating healthier growing conditions.\", \"required\": true}, {\"id\": 2, \"question\": \"When should you start treating a pest problem?\", \"options\": [\"Wait until it\'s severe\", \"As soon as you notice it\", \"Only in spring\", \"Never - let nature handle it\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Start treating pest problems as soon as you notice them. Early intervention is much more effective than waiting.\", \"required\": true}, {\"id\": 3, \"question\": \"What is the main purpose of companion planting?\", \"options\": [\"To save space\", \"To use beneficial plant relationships\", \"To reduce costs\", \"To simplify watering\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Companion planting uses beneficial relationships between plants to improve growth, deter pests, attract beneficial insects, and maximize garden productivity.\", \"required\": true}]}, \"images\": [], \"videos\": []}', NULL, NULL, NULL, NULL, 1, '2025-12-03 17:05:26', '2025-12-10 05:08:57'),
(19, 'Expert', 'basic-information', 'module', 0, 'Expert Information - Master-Level Knowledge', '{\"id\": \"basic-information\", \"title\": \"Expert Information - Master-Level Knowledge\", \"difficulty\": \"Expert\", \"estimatedTime\": \"40 min\", \"description\": \"Master advanced concepts and professional-level gardening information\", \"lessons\": [{\"id\": 1, \"title\": \"Soil Science and Chemistry\", \"content\": \"Understanding soil chemistry and science enables you to create optimal growing conditions for any plant.\", \"points\": [\"\\ud83e\\uddea Soil pH affects nutrient availability - most plants prefer 6.0-7.0\", \"\\ud83c\\udf31 Cation Exchange Capacity (CEC) measures soil\'s ability to hold nutrients\", \"\\ud83e\\udda0 Beneficial microorganisms are essential for healthy soil\", \"\\ud83c\\udf3f Organic matter improves soil structure and nutrient availability\", \"\\ud83d\\udca7 Soil texture (sand, silt, clay) affects drainage and water retention\", \"\\ud83d\\udcca Regular soil testing guides amendment decisions\"], \"images\": [], \"videos\": []}, {\"id\": 2, \"title\": \"Advanced Propagation Techniques\", \"content\": \"Master propagation techniques to multiply your plants and share with others.\", \"points\": [\"\\ud83c\\udf31 Seed starting requires proper temperature, moisture, and light\", \"\\u2702\\ufe0f Stem cuttings can clone plants exactly\", \"\\ud83c\\udf3f Layering creates new plants while still attached to parent\", \"\\ud83d\\udd2c Grafting combines desirable traits from different plants\", \"\\u23f0 Timing is crucial for successful propagation\", \"\\ud83c\\udf21\\ufe0f Bottom heat and humidity domes improve success rates\"], \"images\": [], \"videos\": []}], \"quiz\": {\"title\": \"Expert Information Quiz\", \"questions\": [{\"id\": 1, \"question\": \"What pH range do most plants prefer?\", \"options\": [\"4.0-5.0\", \"6.0-7.0\", \"8.0-9.0\", \"10.0-11.0\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Most plants prefer slightly acidic to neutral soil (pH 6.0-7.0) where nutrients are most available.\", \"required\": true}, {\"id\": 2, \"question\": \"What does CEC stand for in soil science?\", \"options\": [\"Carbon Exchange Capacity\", \"Cation Exchange Capacity\", \"Chemical Element Count\", \"Crop Enhancement Coefficient\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! CEC (Cation Exchange Capacity) measures a soil\'s ability to hold and exchange positively charged nutrient ions.\", \"required\": true}]}, \"images\": [], \"videos\": []}', NULL, NULL, NULL, NULL, 1, '2025-12-03 17:05:26', '2025-12-03 17:05:26'),
(20, 'Expert', 'lessons', 'module', 0, 'Expert Lessons - Professional Techniques', '{\"id\": \"lessons\", \"title\": \"Expert Lessons - Professional Techniques\", \"difficulty\": \"Expert\", \"estimatedTime\": \"45 min\", \"description\": \"Learn professional-grade techniques used by master gardeners\", \"lessons\": [{\"id\": 1, \"title\": \"Integrated Pest Management (IPM)\", \"content\": \"IPM combines multiple strategies to manage pests while minimizing environmental impact.\", \"points\": [\"\\ud83d\\udd0d Monitor and identify pests accurately\", \"\\ud83c\\udf3f Use cultural controls (proper spacing, crop rotation)\", \"\\ud83e\\udd8b Encourage beneficial insects and natural predators\", \"\\ud83e\\uddea Use chemical controls only as last resort\", \"\\ud83d\\udcca Keep records to track pest patterns\", \"\\ud83d\\udd04 Rotate control methods to prevent resistance\"], \"images\": [], \"videos\": []}, {\"id\": 2, \"title\": \"Advanced Soil Building\", \"content\": \"Build and maintain exceptional soil through advanced techniques and understanding.\", \"points\": [\"\\ud83c\\udf31 No-till gardening preserves soil structure and beneficial organisms\", \"\\ud83d\\udd04 Cover crops add organic matter and fix nitrogen\", \"\\ud83c\\udf3f Composting creates nutrient-rich soil amendments\", \"\\ud83e\\udda0 Microbial inoculants introduce beneficial organisms\", \"\\ud83d\\udcca Regular soil testing guides improvement strategies\", \"\\ud83c\\udf0d Long-term soil health benefits entire ecosystem\"], \"images\": [], \"videos\": []}], \"quiz\": {\"title\": \"Expert Lessons Quiz\", \"questions\": [{\"id\": 1, \"question\": \"What is Integrated Pest Management (IPM)?\", \"options\": [\"Using only chemicals\", \"Combining multiple pest control strategies\", \"Never treating pests\", \"Using only organic methods\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! IPM combines monitoring, cultural controls, biological controls, and chemical controls (as last resort) for effective, environmentally responsible pest management.\", \"required\": true}, {\"id\": 2, \"question\": \"What is a primary benefit of no-till gardening?\", \"options\": [\"Saves time\", \"Preserves soil structure and beneficial organisms\", \"Reduces watering\", \"Makes planting easier\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! No-till gardening preserves soil structure, maintains beneficial soil organisms, and prevents erosion while building soil health over time.\", \"required\": true}]}, \"images\": [], \"videos\": []}', NULL, NULL, NULL, NULL, 1, '2025-12-03 17:05:27', '2025-12-03 17:05:27'),
(21, 'Expert', 'quizzes', 'module', 0, 'Expert Mastery Assessment', '{\"id\": \"quizzes\", \"title\": \"Expert Mastery Assessment\", \"difficulty\": \"Expert\", \"estimatedTime\": \"30 min\", \"description\": \"Comprehensive assessment of expert-level gardening knowledge\", \"lessons\": [{\"id\": 1, \"title\": \"Mastery Assessment Preparation\", \"content\": \"These comprehensive assessments test your mastery of expert-level gardening concepts and techniques.\", \"points\": [\"\\ud83d\\udcda Review all expert-level lessons thoroughly\", \"\\ud83e\\udde0 Apply advanced concepts to complex scenarios\", \"\\ud83d\\udca1 Think critically about problem-solving approaches\", \"\\ud83d\\udcca Use assessment results to identify mastery areas\", \"\\ud83d\\udd04 Continue learning and refining techniques\", \"\\ud83c\\udf1f Share knowledge with other gardeners\"], \"images\": [], \"videos\": []}], \"quiz\": {\"title\": \"Comprehensive Expert Quiz\", \"questions\": [{\"id\": 1, \"question\": \"Why is soil pH important for plant nutrition?\", \"options\": [\"It doesn\'t matter\", \"It affects nutrient availability\", \"It only matters for vegetables\", \"It changes daily\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Soil pH directly affects nutrient availability. Most nutrients are available at pH 6.0-7.0, while extreme pH levels lock up nutrients.\", \"required\": true}, {\"id\": 2, \"question\": \"What is the correct order of IPM strategies?\", \"options\": [\"Chemical first\", \"Monitor, cultural controls, biological controls, chemical as last resort\", \"Only biological\", \"No order needed\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! IPM follows this order: 1) Monitor and identify, 2) Cultural controls, 3) Biological controls, 4) Chemical controls as last resort.\", \"required\": true}, {\"id\": 3, \"question\": \"What is the primary goal of advanced soil building?\", \"options\": [\"To save money\", \"To create long-term soil health and ecosystem benefits\", \"To reduce watering\", \"To grow faster plants\"], \"correct\": 1, \"explanation\": \"\\u2705 CORRECT! Advanced soil building focuses on creating long-term soil health that benefits the entire ecosystem, not just individual plants.\", \"required\": true}]}, \"images\": [], \"videos\": []}', NULL, NULL, NULL, NULL, 1, '2025-12-03 17:05:27', '2025-12-03 17:05:27'),
(22, 'Beginner', 'module-1765344869090', 'module', 0, 'how to plant properly', '{\"id\": \"module-1765344869090\", \"title\": \"how to plant properly\", \"description\": \"description\", \"estimatedTime\": \"30 min\", \"difficulty\": \"Beginner\", \"lessons\": [{\"id\": 1765344793150, \"title\": \"How to plant properly\", \"content\": \"1. plant\\n2. water\\n3. prune\\n4. fertilize\", \"points\": [], \"images\": [{\"id\": \"1765344785_1e27469a\", \"url\": \"/uploads/learning_paths/image/learning_1765344785_1e27469a.jpg\", \"name\": \"aloevera.jpg\", \"size\": 9288, \"type\": \"image/jpeg\"}], \"videos\": []}], \"quizzes\": [{\"id\": \"quiz-1765344852468\", \"title\": \"how to plant properly Quiz\", \"questions\": [{\"id\": 1, \"question\": \"Based on the lesson \\\"How to plant properly\\\", what is the main topic covered?\", \"options\": [\"The concepts discussed in the lesson\", \"Information not covered in the lesson\", \"Advanced topics beyond this lesson\", \"Basic concepts unrelated to this lesson\"], \"correct\": 0, \"explanation\": \"This question is based on the lesson: How to plant properly. Review the lesson content to understand the correct answer.\"}], \"images\": [], \"videos\": []}], \"quiz\": {\"id\": \"quiz-1765344852468\", \"title\": \"how to plant properly Quiz\", \"questions\": [{\"id\": 1, \"question\": \"Based on the lesson \\\"How to plant properly\\\", what is the main topic covered?\", \"options\": [\"The concepts discussed in the lesson\", \"Information not covered in the lesson\", \"Advanced topics beyond this lesson\", \"Basic concepts unrelated to this lesson\"], \"correct\": 0, \"explanation\": \"This question is based on the lesson: How to plant properly. Review the lesson content to understand the correct answer.\"}], \"images\": [], \"videos\": []}, \"images\": [], \"videos\": []}', NULL, NULL, NULL, NULL, 1, '2025-12-10 05:34:29', '2025-12-10 05:34:29');

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
(96, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Use well-draining, slightly acidic soil enriched with organic matter.', 7, 30, 60, 'uploads/plants/plant_1763991075_strawberry.jpg.jpeg', '2025-11-24 13:31:15'),
(97, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1764328017_strawberry.jpg.jpeg', '2025-11-28 11:06:57'),
(98, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1764329543_sunflower.jpg.jpeg', '2025-11-28 11:32:23'),
(99, 'Pumpkin', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Well-drained, fertile soil with a pH between 6.0 and 6.8 is ideal.', 7, 30, 60, 'uploads/plants/plant_1764329715_sas.jpg.jpeg', '2025-11-28 11:35:15'),
(100, 'water-lily tulip', 'flower', 'outdoor', '💧 Watering: Moderate during growth; dry summer dormancy\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑drained; avoid waterlogged bulbs\r\n\r\n📈 Growth Stage: Bulb (cool season)\r\n\r\n⚠️ Common Issues: Bulb rot, Aphids, Deer/rabbit browsing', 'Use well-drained, sandy or loamy soil. Ensure good drainage to prevent bulb rot.', 7, 30, 60, 'uploads/plants/plant_1764329789_tulip.jpg.jpeg', '2025-11-28 11:36:29'),
(101, 'Tomato', 'vegetable', 'outdoor', '💧 Watering: Deeply 1–2x/week; keep evenly moist, avoid wet foliage\r\n\r\n☀️ Sunlight: Full sun (6–8+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained soil with compost; pH 6.0–6.8\r\n\r\n📈 Growth Stage: Vegetative/fruiting (warm-season annual)\r\n\r\n⚠️ Common Issues: Blossom end rot, Early blight, Aphids, Split fruit', 'Maintain well-draining soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1764329833_tomato.webp.webp', '2025-11-28 11:37:13'),
(102, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1764331956_strawberry.jpg.jpeg', '2025-11-28 12:12:36'),
(103, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Well-draining, loamy soil with good organic matter content is ideal. Maintain a slightly acidic to n', 7, 30, 60, 'uploads/plants/plant_1764332488_grape.jpg.jpeg', '2025-11-28 12:21:28'),
(104, 'Banana', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Use well-draining, rich soil with good organic content.', 7, 30, 60, 'uploads/plants/plant_1764333304_banana3.jpg.jpeg', '2025-11-28 12:35:04'),
(105, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1764334152_grape.jpg.jpeg', '2025-11-28 12:49:12'),
(106, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Prefers well-drained, nutrient-rich soil.', 7, 30, 60, 'uploads/plants/plant_1764334349_sunflower.jpg.jpeg', '2025-11-28 12:52:29'),
(107, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1764461039_strawberry.jpg.jpeg', '2025-11-30 00:03:59'),
(108, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1764461574_grape.jpg.jpeg', '2025-11-30 00:12:54'),
(109, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Use well-draining soil with a neutral to slightly acidic pH.', 7, 30, 60, 'uploads/plants/plant_1764462526_sunflower.jpg.jpeg', '2025-11-30 00:28:46'),
(110, 'Tomato', 'vegetable', 'outdoor', '💧 Watering: Deeply 1–2x/week; keep evenly moist, avoid wet foliage\r\n\r\n☀️ Sunlight: Full sun (6–8+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained soil with compost; pH 6.0–6.8\r\n\r\n📈 Growth Stage: Vegetative/fruiting (warm-season annual)\r\n\r\n⚠️ Common Issues: Blossom end rot, Early blight, Aphids, Split fruit', '', NULL, NULL, NULL, 'uploads/plants/plant_1764463519_tomato.webp.webp', '2025-11-30 00:45:19'),
(111, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1764466259_strawberry.jpg.jpeg', '2025-11-30 01:30:59'),
(112, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Maintain well-drained, fertile soil with good organic content.', 7, 30, 60, 'uploads/plants/plant_1764467664_grape.jpg.jpeg', '2025-11-30 01:54:24'),
(113, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1764467709_sunflower.jpg.jpeg', '2025-11-30 01:55:09'),
(114, 'water-lily tulip', 'flower', 'outdoor', '💧 Watering: Moderate during growth; dry summer dormancy\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑drained; avoid waterlogged bulbs\r\n\r\n📈 Growth Stage: Bulb (cool season)\r\n\r\n⚠️ Common Issues: Bulb rot, Aphids, Deer/rabbit browsing', 'Well-drained soil is essential. Consider adding organic matter to improve drainage if needed.', 7, 30, 60, 'uploads/plants/plant_1764468410_tulip.jpg.jpeg', '2025-11-30 02:06:50'),
(115, 'Carrot', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1764468483_carrots.jpg.jpeg', '2025-11-30 02:08:03'),
(116, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Maintain well-draining, slightly acidic soil with good organic matter content.', 7, 30, 60, 'uploads/plants/plant_1764468609_strawberry.jpg.jpeg', '2025-11-30 02:10:09'),
(117, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1764470064_grape.jpg.jpeg', '2025-11-30 02:34:24'),
(118, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Maintain well-draining, slightly acidic soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1764470103_strawberry.jpg.jpeg', '2025-11-30 02:35:03'),
(121, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1764778911_grape.jpg.jpeg', '2025-12-03 16:21:51'),
(122, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Use well-drained, sandy loam soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1765211810_strawberry.jpg.jpeg', '2025-12-08 16:36:50'),
(123, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1764780774_sunflower.jpg.jpeg', '2025-12-03 16:52:54'),
(124, 'Apple', 'fruit', 'outdoor', '💧 Watering: Deep weekly for young trees; adjust by rainfall\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining loam; mulch to conserve moisture\r\n\r\n📈 Growth Stage: Deciduous fruit tree\r\n\r\n⚠️ Common Issues: Scab, Codling moth, Fire blight', 'Well-drained, loamy soil with a slightly acidic to neutral pH is best.', 7, 30, 60, 'uploads/plants/plant_1764781048_appleplant1.webp.webp', '2025-12-03 16:57:28'),
(125, 'Carrot', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1764781328_carrots.jpg.jpeg', '2025-12-03 17:02:08'),
(126, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Maintain well-draining, slightly acidic soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1764783699_strawberry.jpg.jpeg', '2025-12-03 17:41:39'),
(127, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1764783895_sunflower.jpg.jpeg', '2025-12-03 17:44:55'),
(128, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1764784188_sunflower.jpg.jpeg', '2025-12-03 17:49:48'),
(129, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Use well-draining, slightly acidic soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1764784229_strawberry.jpg.jpeg', '2025-12-03 17:50:29'),
(130, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1764989714_strawberry.jpg.jpeg', '2025-12-06 02:55:14'),
(131, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Well-drained, loamy soil with good organic content.', 7, 30, 60, 'uploads/plants/plant_1764989802_grape.jpg.jpeg', '2025-12-06 02:56:42'),
(132, 'Pumpkin', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1764989910_carrot.jpg.jpeg', '2025-12-06 02:58:30'),
(133, 'water-lily tulip', 'flower', 'outdoor', '💧 Watering: Moderate during growth; dry summer dormancy\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑drained; avoid waterlogged bulbs\r\n\r\n📈 Growth Stage: Bulb (cool season)\r\n\r\n⚠️ Common Issues: Bulb rot, Aphids, Deer/rabbit browsing', '', NULL, NULL, NULL, 'uploads/plants/plant_1764993802_tulip.jpg.jpeg', '2025-12-06 04:03:22'),
(134, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Use well-draining soil with good organic matter content.', 7, 30, 60, 'uploads/plants/plant_1764995937_strawberry2.jpg.jpeg', '2025-12-06 04:38:57'),
(135, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Well-drained, loamy soil with good organic matter content.', 7, 30, 60, 'uploads/plants/plant_1764996169_grape.jpg.jpeg', '2025-12-06 04:42:49'),
(136, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1765028565_strawberry.jpg.jpeg', '2025-12-06 13:42:45'),
(137, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Well-draining soil with a neutral to slightly acidic pH is ideal.', 7, 30, 60, 'uploads/plants/plant_1765028626_sunflower.jpg.jpeg', '2025-12-06 13:43:46'),
(138, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1765029552_strawberry2.jpg.jpeg', '2025-12-06 13:59:12'),
(139, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Well-draining soil with a neutral to slightly acidic pH is ideal.', 7, 30, 60, 'uploads/plants/plant_1765029591_sunflower.jpg.jpeg', '2025-12-06 13:59:51'),
(140, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1765134775_sunflower2.jpg.jpeg', '2025-12-07 19:12:55'),
(141, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Well-draining soil with good organic matter content.', 7, 30, 60, 'uploads/plants/plant_1765135933_grape.jpg.jpeg', '2025-12-07 19:32:13'),
(142, 'Aloe Vera', 'flower', 'outdoor', '💧 Watering: Sparse; soak then dry fully (2–4 weeks indoors)\r\n\r\n☀️ Sunlight: Bright light; acclimate to full sun\r\n\r\n🌱 Soil: Gritty, fast‑draining cactus mix\r\n\r\n📈 Growth Stage: Succulent\r\n\r\n⚠️ Common Issues: Root rot from overwatering, Etiolation in low light', '', NULL, NULL, NULL, 'uploads/plants/plant_1765136094_aloevera.jpg.jpeg', '2025-12-07 19:34:54'),
(143, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1765297098_strawberry.jpg.jpeg', '2025-12-09 16:18:18'),
(144, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Prefers well-draining soil with a neutral to slightly acidic pH.', 7, 30, 60, 'uploads/plants/plant_1765297173_sunflower.jpg.jpeg', '2025-12-09 16:19:33'),
(145, 'Carrot', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1765298198_carrots.jpg.jpeg', '2025-12-09 16:36:38'),
(146, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Maintain well-drained, fertile soil with good organic content.', 7, 30, 60, 'uploads/plants/plant_1765298238_grape.jpg.jpeg', '2025-12-09 16:37:18'),
(147, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Use well-draining, slightly acidic soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1765337051_strawberry.jpg.jpeg', '2025-12-10 03:24:11'),
(148, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Use well-draining, slightly acidic soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1765338596_strawberry.jpg.jpeg', '2025-12-10 03:49:56'),
(149, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1765338626_grape.jpg.jpeg', '2025-12-10 03:50:26'),
(150, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', '', NULL, NULL, NULL, 'uploads/plants/plant_1765339574_sunflower.jpg.jpeg', '2025-12-10 04:06:14'),
(151, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Maintain well-drained, fertile soil with good organic matter.', 7, 30, 60, 'uploads/plants/plant_1765339621_grape.jpg.jpeg', '2025-12-10 04:07:01'),
(152, 'Carrot', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1765340331_carrots.jpg.jpeg', '2025-12-10 04:18:51'),
(153, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', 'Use well-draining, slightly acidic soil rich in organic matter.', 7, 30, 60, 'uploads/plants/plant_1765340359_strawberry.jpg.jpeg', '2025-12-10 04:19:19');
INSERT INTO `plant` (`PLANT_ID`, `NAME`, `TYPE`, `ENVIRONMENT`, `CARE_GUIDE`, `IDEAL_SOIL_TYPE`, `WATERING_FREQUENCY`, `FERTILIZING_FREQUENCY`, `PRUNING_FREQUENCY`, `IMAGE_PATH`, `CREATED_AT`) VALUES
(154, 'Sunflower', 'flower', 'outdoor', 'General care', '', NULL, NULL, NULL, 'uploads/plants/plant_1765341190_sunflower.jpg.jpeg', '2025-12-10 04:33:10'),
(155, 'Strawberry', 'fruit', 'outdoor', 'undefined', 'Rich, well‑drained; regular feeding during bloom', 7, 30, 60, 'uploads/plants/plant_1765341268_strawberry.jpg.jpeg', '2025-12-10 04:34:28'),
(156, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1765341413_strawberry.jpg.jpeg', '2025-12-10 04:36:53'),
(157, 'Apple', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Prefers well-drained, loamy soil with a pH between 6.0 and 7.0.', 7, 30, 60, 'uploads/plants/plant_1765341500_apple.jpg.jpeg', '2025-12-10 04:38:20'),
(159, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Maintain well-drained, fertile soil with good organic matter.', 7, 30, 60, 'uploads/plants/plant_1765341576_grape.jpg.jpeg', '2025-12-10 04:39:36'),
(160, 'Carrot', 'vegetable', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', '', NULL, NULL, NULL, 'uploads/plants/plant_1765341969_carrots.jpg.jpeg', '2025-12-10 04:46:09'),
(161, 'Sunflower', 'flower', 'outdoor', '💧 Watering: Deep watering; drought tolerant once established\r\n\r\n☀️ Sunlight: Full sun\r\n\r\n🌱 Soil: Well‑draining; stake tall varieties\r\n\r\n📈 Growth Stage: Annual flowering\r\n\r\n⚠️ Common Issues: Birds/squirrels on seeds, Downy mildew', 'Prefers well-draining soil with a neutral to slightly acidic pH.', 7, 30, 60, 'uploads/plants/plant_1765342031_sunflower.jpg.jpeg', '2025-12-10 04:47:11'),
(162, 'Strawberry', 'fruit', 'outdoor', '💧 Watering: Deep soak 1–2x/week; water soil not foliage\r\n\r\n☀️ Sunlight: Full sun (5–6+ hours)\r\n\r\n🌱 Soil: Rich, well‑drained; regular feeding during bloom\r\n\r\n📈 Growth Stage: Flowering shrub\r\n\r\n⚠️ Common Issues: Black spot, Powdery mildew, Aphids', '', NULL, NULL, NULL, 'uploads/plants/plant_1765342279_strawberry.jpg.jpeg', '2025-12-10 04:51:19'),
(163, 'Strawberry', 'fruit', 'outdoor', 'General care', '', NULL, NULL, NULL, 'uploads/plants/plant_1765344137_strawberry.jpg.jpeg', '2025-12-10 05:22:17'),
(164, 'Aloe Vera', 'flower', 'outdoor', 'undefined', 'Gritty, fast‑draining cactus mix', 7, 30, 60, 'uploads/plants/plant_1765344257_aloevera.jpg.jpeg', '2025-12-10 05:24:17'),
(165, 'Grape', 'fruit', 'outdoor', '💧 Watering: Water as needed; keep soil appropriate for species\r\n\r\n☀️ Sunlight: Provide suitable sun exposure for species\r\n\r\n🌱 Soil: Well-draining soil is recommended', 'Maintain well-drained, fertile soil with good organic matter.', 7, 30, 60, 'uploads/plants/plant_1765344435_grape.jpg.jpeg', '2025-12-10 05:27:15');

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
(88, 19, 97, '2025-11-28', NULL, NULL, NULL, NULL),
(89, 19, 98, '2025-11-28', NULL, NULL, NULL, NULL),
(90, 19, 99, '2025-11-28', NULL, NULL, NULL, NULL),
(91, 19, 100, '2025-11-28', NULL, NULL, NULL, NULL),
(92, 19, 101, '2025-11-28', NULL, NULL, NULL, NULL),
(93, 24, 102, '2025-11-28', NULL, NULL, NULL, NULL),
(94, 24, 103, '2025-11-28', NULL, NULL, NULL, NULL),
(95, 24, 104, '2025-11-28', NULL, NULL, NULL, NULL),
(96, 24, 105, '2025-11-28', NULL, NULL, NULL, NULL),
(97, 24, 106, '2025-11-28', NULL, NULL, NULL, NULL),
(125, 32, 134, '2025-12-06', NULL, NULL, NULL, NULL),
(126, 32, 135, '2025-12-06', NULL, NULL, NULL, NULL),
(154, 41, 163, '2025-12-10', NULL, NULL, NULL, NULL),
(155, 41, 164, '2025-12-10', NULL, NULL, NULL, NULL),
(156, 41, 165, '2025-12-10', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plant_history_logs`
--

CREATE TABLE `plant_history_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `garden_id` int(11) DEFAULT NULL,
  `space_id` int(11) DEFAULT NULL,
  `plant_id` int(11) DEFAULT NULL,
  `change_type` varchar(50) NOT NULL,
  `change_description` text DEFAULT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `change_metadata` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plant_history_logs`
--

INSERT INTO `plant_history_logs` (`id`, `user_id`, `garden_id`, `space_id`, `plant_id`, `change_type`, `change_description`, `old_value`, `new_value`, `change_metadata`, `created_at`) VALUES
(1, 18, 19, 210, 85, 'placed', 'Placed Grape at position 1,1', '{\"plant_id\": null}', '{\"plant_id\": 85, \"planting_date\": \"2025-11-24\"}', '{\"planting_date\": \"2025-11-24\", \"notes\": \"Placed via drag and drop\", \"grid_position\": \"1,1\"}', '2025-11-28 11:50:31'),
(2, 18, 19, 210, 85, 'image_upload', 'Uploaded new image for Grape at position 1,1', '{\"image_path\": \"uploads/plants/space_210_1763980189.jpeg\"}', '{\"image_path\": \"uploads/plants/space_210_1764330640.jpeg\"}', '{\"ai_analysis\": {\"needs_water\": true, \"needs_fertilize\": false, \"needs_prune\": true, \"confidence\": 0.8, \"reasoning\": \"The grapes appear shriveled and some fruit is damaged which indicates dehydration and possible need for pruning.\"}, \"grid_position\": \"1,1\"}', '2025-11-28 11:50:52');

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
-- Table structure for table `soil_analysis_usage`
--

CREATE TABLE `soil_analysis_usage` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `free_analyses_used` int(11) DEFAULT NULL,
  `purchased_credits` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `soil_analysis_usage`
--

INSERT INTO `soil_analysis_usage` (`id`, `user_id`, `free_analyses_used`, `purchased_credits`, `created_at`, `updated_at`) VALUES
(98, 24, 1, 0, '2025-12-06 04:47:49', '2025-12-06 04:48:11'),
(209, 29, 1, 0, '2025-12-10 05:27:31', '2025-12-10 05:27:50');

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
(18, 'jarizada@yahoo.com', 'jan', 'rizada', '09213412341', 'pbkdf2:sha256:600000$8Qm253hzK0wLbZAG$f514c5a0e1b189c16f547e8298717103fc7621ec12ffc4ac171087b8992a6dda', 'user', 1, 0, 'basic', 1, 'beginner', '2025-11-24 10:16:27', '2025-11-28 11:34:14', 1, NULL, NULL),
(20, 'johnlouie3211@gmail.com', 'john louie', 'purisima', '09123412342', 'pbkdf2:sha256:600000$uPCAXob9GEHTCmtv$7385e49a9d0a70c40c4e150800b6f8cb34bf57ec92d261b3daca97a6c5e4d0a8', 'user', 1, 0, 'basic', 1, 'beginner', '2025-11-24 10:54:11', '2025-12-07 19:09:57', 1, NULL, NULL),
(24, 'canamalicht@yahoo.com', 'licht', 'canama', '09123412341', 'pbkdf2:sha256:600000$V9rsaRQ9OYj1Gp4w$209ac1b338cc136687611e7c4bb8be266fa6487012b8340ace274084f374cd63', 'user', 1, 0, 'basic', 1, 'beginner', '2025-12-06 04:34:30', '2025-12-07 19:09:57', 1, NULL, NULL),
(29, 'rizadajohn5@gmail.com', 'john ', 'rizada', '09123412341', 'pbkdf2:sha256:600000$PaO0Qtu2Zy1BsSjC$212316f31e5a81d73dec09c27df4b0eacd5f5c6a906c2fc02104c16691db2e7a', 'user', 1, 1, 'basic', 1, 'beginner', '2025-12-10 05:18:50', '2025-12-10 05:24:36', 1, NULL, NULL);

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
(14, 18, 1, '2025-11-28 19:17:58', '2025-12-28 19:17:58', 'cancelled', 'paid', 150.00, '2025-11-28 11:17:58', '2025-11-28 11:20:16'),
(15, 18, 1, '2025-11-28 19:29:56', '2025-12-28 19:29:56', 'cancelled', 'paid', 150.00, '2025-11-28 11:29:56', '2025-11-28 11:34:14'),
(27, 24, 1, '2025-12-06 20:48:19', '2026-01-05 20:48:19', 'cancelled', 'paid', 150.00, '2025-12-06 12:48:19', '2025-12-06 12:52:37'),
(28, 24, 1, '2025-12-06 20:53:28', '2026-01-05 20:53:28', 'cancelled', 'paid', 150.00, '2025-12-06 12:53:28', '2025-12-06 12:58:02'),
(29, 24, 1, '2025-12-06 13:01:17', '2026-01-05 13:01:17', 'cancelled', 'paid', 150.00, '2025-12-06 13:01:17', '2025-12-06 13:01:25'),
(30, 24, 1, '2025-12-06 13:02:06', '2026-01-05 13:02:06', 'cancelled', 'paid', 150.00, '2025-12-06 13:02:06', '2025-12-06 13:05:19'),
(39, 29, 1, '2025-12-10 05:24:36', '2026-01-09 05:24:36', 'active', 'paid', 150.00, '2025-12-10 05:24:36', '2025-12-10 05:24:36');

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
-- Indexes for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

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
-- Indexes for table `plant_history_logs`
--
ALTER TABLE `plant_history_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `garden_id` (`garden_id`),
  ADD KEY `space_id` (`space_id`),
  ADD KEY `plant_id` (`plant_id`);

--
-- Indexes for table `seasonal_content`
--
ALTER TABLE `seasonal_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `soil_analysis_usage`
--
ALTER TABLE `soil_analysis_usage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=240;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `ai_analysis_usage`
--
ALTER TABLE `ai_analysis_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `ai_usage_tracking`
--
ALTER TABLE `ai_usage_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `garden`
--
ALTER TABLE `garden`
  MODIFY `GARDEN_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `grid_spaces`
--
ALTER TABLE `grid_spaces`
  MODIFY `SPACE_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1565;

--
-- AUTO_INCREMENT for table `learning_path_content`
--
ALTER TABLE `learning_path_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
  MODIFY `PLANT_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;

--
-- AUTO_INCREMENT for table `planttracking`
--
ALTER TABLE `planttracking`
  MODIFY `TRACKING_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT for table `plant_history_logs`
--
ALTER TABLE `plant_history_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `seasonal_content`
--
ALTER TABLE `seasonal_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `soil_analysis_usage`
--
ALTER TABLE `soil_analysis_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=210;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `user_plant_update_usage`
--
ALTER TABLE `user_plant_update_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_shared_concepts`
--
ALTER TABLE `user_shared_concepts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD CONSTRAINT `admin_notifications_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

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
-- Constraints for table `planttracking`
--
ALTER TABLE `planttracking`
  ADD CONSTRAINT `planttracking_ibfk_1` FOREIGN KEY (`GARDEN_ID`) REFERENCES `garden` (`GARDEN_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `planttracking_ibfk_2` FOREIGN KEY (`PLANT_ID`) REFERENCES `plant` (`PLANT_ID`);

--
-- Constraints for table `plant_history_logs`
--
ALTER TABLE `plant_history_logs`
  ADD CONSTRAINT `plant_history_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `plant_history_logs_ibfk_2` FOREIGN KEY (`garden_id`) REFERENCES `garden` (`GARDEN_ID`),
  ADD CONSTRAINT `plant_history_logs_ibfk_3` FOREIGN KEY (`space_id`) REFERENCES `grid_spaces` (`SPACE_ID`),
  ADD CONSTRAINT `plant_history_logs_ibfk_4` FOREIGN KEY (`plant_id`) REFERENCES `plant` (`PLANT_ID`);

--
-- Constraints for table `seasonal_content`
--
ALTER TABLE `seasonal_content`
  ADD CONSTRAINT `seasonal_content_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `soil_analysis_usage`
--
ALTER TABLE `soil_analysis_usage`
  ADD CONSTRAINT `soil_analysis_usage_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
