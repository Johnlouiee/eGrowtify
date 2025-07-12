-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 06, 2025 at 12:15 PM
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
-- Database: `egrowtify_db`
--

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
  `email_notifications` tinyint(1) DEFAULT 1,
  `learning_level` varchar(20) DEFAULT 'beginner',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `CREATED_AT` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `PRUNING_FREQUENCY` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `garden`
--
ALTER TABLE `garden`
  ADD PRIMARY KEY (`GARDEN_ID`),
  ADD KEY `USER_ID` (`USER_ID`);

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
  ADD KEY `GARDEN_ID` (`GARDEN_ID`),
  ADD KEY `PLANT_ID` (`PLANT_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `garden`
--
ALTER TABLE `garden`
  MODIFY `GARDEN_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plant`
--
ALTER TABLE `plant`
  MODIFY `PLANT_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `planttracking`
--
ALTER TABLE `planttracking`
  MODIFY `TRACKING_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `garden`
--
ALTER TABLE `garden`
  ADD CONSTRAINT `garden_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `planttracking`
--
ALTER TABLE `planttracking`
  ADD CONSTRAINT `planttracking_ibfk_1` FOREIGN KEY (`GARDEN_ID`) REFERENCES `garden` (`GARDEN_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `planttracking_ibfk_2` FOREIGN KEY (`PLANT_ID`) REFERENCES `plant` (`PLANT_ID`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */; 