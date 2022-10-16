-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: database:3306
-- Generation Time: Oct 16, 2022 at 07:02 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `docker`
--

-- --------------------------------------------------------

--
-- Table structure for table `lectures`
--

CREATE TABLE `lectures` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `date` datetime NOT NULL,
  `duration` int DEFAULT NULL,
  `happiness` float DEFAULT NULL,
  `boredom` float DEFAULT NULL,
  `anger` float DEFAULT NULL,
  `anxiety` float DEFAULT NULL,
  `disgust` float DEFAULT NULL,
  `sadness` float DEFAULT NULL,
  `neutral` int DEFAULT '1',
  `title` varchar(600) DEFAULT NULL,
  `total` float DEFAULT '5',
  `summary` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lectures`
--

INSERT INTO `lectures` (`id`, `user_id`, `date`, `duration`, `happiness`, `boredom`, `anger`, `anxiety`, `disgust`, `sadness`, `neutral`, `title`, `total`, `summary`) VALUES
(3, 1, '2022-10-15 17:45:33', 60, 12, 25, 25, 10, 10, 25, 1, 'BJT Transistors', 5, 'What are BJT Transistors'),
(4, 1, '2022-10-14 17:50:53', 95, 40, 25, 12, 26, 30, 10, 1, 'Rocket science', 10, 'Fun class about rockets today!');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `password` char(64) DEFAULT NULL,
  `id` int NOT NULL,
  `username` varchar(500) NOT NULL,
  `token` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`firstname`, `lastname`, `password`, `id`, `username`, `token`) VALUES
('John', 'Doe', 'c659b9cf6e52ea73705d3839101849f3f5be6d5c47eb9e1b0407931151c429f7', 1, 'john.doe@gmail.com', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lectures`
--
ALTER TABLE `lectures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lectures_users_id_fk` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_uindex` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lectures`
--
ALTER TABLE `lectures`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `lectures`
--
ALTER TABLE `lectures`
  ADD CONSTRAINT `lectures_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
