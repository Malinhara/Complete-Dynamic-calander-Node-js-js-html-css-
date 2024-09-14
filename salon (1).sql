-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2024 at 06:25 PM
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
-- Database: `salon`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `backgroundColor` varchar(7) DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `title`, `telephone`, `address`, `start`, `end`, `backgroundColor`, `status`, `employee_id`, `customer_id`) VALUES
(20, 'Nimal', '070144532', 'Homagama', '2024-06-11 11:21:00', '2024-06-11 12:22:00', 'green', 'Pending', 60, 1),
(21, 'Nimal', '070144532', 'Homagama', '2024-06-12 11:23:00', '2024-06-12 12:23:00', 'red', 'Cancel', 56, 1),
(22, 'Ronaldo', '0701553733', '214/6 Puwakwaththa road,ekathumuthu mawatha,meegod', '2024-06-12 11:27:00', '2024-06-12 12:27:00', 'green', '0', 56, 2),
(23, 'Nimal', '070144532', 'Homagama', '2024-06-07 09:00:00', '2024-06-07 10:59:00', 'blue', '0', 56, 1),
(25, 'Ronaldo', '0701553733', '214/6 Puwakwaththa road,ekathumuthu mawatha,meegod', '2024-06-25 18:50:00', '2024-06-25 19:50:00', 'green', 'Pending', 60, 2),
(26, 'Ronaldo', '0701553733', '214/6 Puwakwaththa road,ekathumuthu mawatha,meegod', '2024-09-14 03:03:00', '2024-09-15 03:03:00', 'green', 'Pending', 60, 2),
(27, 'Ronaldo', '0701553733', '214/6 Puwakwaththa road,ekathumuthu mawatha,meegod', '2024-09-13 21:05:00', '2024-09-13 23:05:00', 'blue', 'Postpone', 60, 2);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `cusID` int(11) NOT NULL,
  `cusName` varchar(50) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `address` varchar(50) NOT NULL,
  `Rdate` date NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`cusID`, `cusName`, `contact`, `address`, `Rdate`, `status`) VALUES
(1, 'Nimal', '070144532', 'Homagama', '2024-05-27', 1),
(2, 'Ronaldo', '0701553733', '214/6 Puwakwaththa road,ekathumuthu mawatha,meegod', '2024-05-26', 1),
(12, 'kamal', '0701554532', 'Homagama', '2024-05-27', 0);

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `EmpID` int(11) NOT NULL,
  `empName` varchar(50) NOT NULL,
  `empEmail` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `Gender` varchar(20) NOT NULL,
  `Telephone` varchar(12) NOT NULL,
  `Empbasicsal` float NOT NULL,
  `EmpPerecentage` float NOT NULL,
  `empImage` longtext NOT NULL,
  `hide` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`EmpID`, `empName`, `empEmail`, `password`, `Role`, `Gender`, `Telephone`, `Empbasicsal`, `EmpPerecentage`, `empImage`, `hide`) VALUES
(56, 'Poorna mal', 'malinathgegara44@gmail.com', 'h6y65y', 'Employee', 'male', '0701553733', 500, 50, '/1717560601034-OIP (5).jfif', '1'),
(60, 'mark', 'pooe@gmail.com', '1234', 'Admin', 'female', '0701223543', 66, 2, '/1719322114774-R (2).png', '1'),
(62, 'John', 'pooehh@gmail.com', 'trhrth', 'Cashier', 'Male', '07012235', 66, 2, '', '0'),
(63, 'Poorna', 'malinahara4g4@gmail.com', 'dgth', 'Cashier', 'male', '0701553733r', 44, 44, '1717657408023-Screenshot 2024-06-03 152745.jpg', '0'),
(64, 'Aiden', 'Aiden@gmail.com', '123456mp', 'Employee', 'male', '0701553732', 50000, 10, '1717730556015-OIP (3).jfif', '1'),
(65, 'Kohli', 'Kohli@gmail.com', '123456mp', 'Employee', 'male', '070155373', 70000, 13, '1717730689508-OIP (3).jfif', '1'),
(66, 'PoornaEFRF', 'malinaharvhnhm44@gmail.com', 'hnghmngh', 'Admin', 'male', '0701553733', 6, 6, '1718442307585-dwdwd.png', '0'),
(69, 'Poorna1332', 'malirvhnhmhrt44@gmail.com', 'rthrhyhth', 'Employee', 'female', '0701553743', 6, 55, '1718443232290-dwdwd.png', '0'),
(70, 'abcdefghij', 'malirttnhmhrt44@gmail.com', '433fg', 'Cashier', 'male', '0701553733', 6, 55, '/1719059783949-bannerBG1.jpg', '0'),
(71, 'Poorna', 'poornamalinhara53@gmail.com', 'trhrh', 'Cashier', 'male', '0701553732', 0, 6, '1719057099322-banner1HRH.jpg', '0'),
(72, 'Poorna', 'poornamalffnhara53@gmail.com', '443r', 'Employee', 'male', '0701553732', 55, 0, '1719057179995-Untitled.png', '0'),
(73, 'Poorna', 'poornamalinhayjtyjra53@gmail.com', 'hh', 'Employee', 'male', '0701553732', 55, 0, '1719057695499-Untitled.png', '0'),
(74, 'Poorna', 'poornamalinhthhara53@gmail.com', '5gbyhy', 'Cashier', 'female', '0701553732', 0, 0, '1719057947738-Untitled.png', '0'),
(75, 'Poorna', 'poornahyhdggmalinhara53@gmail.com', 'yjyj', 'Employee', 'male', '0701553732', 3, 555, '1719060103829-banner1HRH.jpg', '0'),
(76, 'abcdefghij', 'poo@gmail.com', 'fjyjtyjtyj', 'Admin', 'Male', '07012235', 66, 50, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `price_manage`
--

CREATE TABLE `price_manage` (
  `id` int(11) NOT NULL,
  `pid` int(11) DEFAULT NULL,
  `sid` int(11) DEFAULT NULL,
  `empId` int(11) DEFAULT NULL,
  `contact` int(11) NOT NULL,
  `servicePrice` float(10,2) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `price_manage`
--

INSERT INTO `price_manage` (`id`, `pid`, `sid`, `empId`, `contact`, `servicePrice`, `date`, `status`) VALUES
(48, 15, 5, 56, 701553733, 1000.00, '2024-06-25', 0),
(49, 15, 5, 60, 701223566, 1000.00, '2024-06-25', 0),
(50, 15, 5, 69, 701553743, 1000.00, '2024-06-26', 1),
(51, 15, 6, 60, 701223543, 3000.00, '2024-06-26', 1),
(52, 16, 5, 64, 701553732, 1000.00, '2024-06-25', 0);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `Pid` int(11) NOT NULL,
  `Pname` varchar(50) NOT NULL,
  `Mtf_date` date NOT NULL,
  `Exp_date` date NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`Pid`, `Pname`, `Mtf_date`, `Exp_date`, `status`) VALUES
(13, 'Scissor', '2024-06-26', '0000-00-00', 0),
(14, 'Scissor', '0000-00-00', '0000-00-00', 0),
(15, 'Scissor', '2024-06-25', '2024-06-25', 1),
(16, 'Dream drone color pack', '2024-06-25', '2024-10-17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `Sid` int(11) NOT NULL,
  `Sname` varchar(50) NOT NULL,
  `Sprice` float NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`Sid`, `Sname`, `Sprice`, `status`) VALUES
(3, 'Hair color', 5550, 0),
(5, 'Head massage', 1000, 1),
(6, 'Hair cut', 3000, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`cusID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`EmpID`);

--
-- Indexes for table `price_manage`
--
ALTER TABLE `price_manage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Pid` (`pid`),
  ADD KEY `Sid` (`sid`),
  ADD KEY `price_manage_ibfk_3` (`empId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`Pid`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`Sid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `cusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `EmpID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `price_manage`
--
ALTER TABLE `price_manage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `Pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `Sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`EmpID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`cusID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `price_manage`
--
ALTER TABLE `price_manage`
  ADD CONSTRAINT `price_manage_ibfk_3` FOREIGN KEY (`empId`) REFERENCES `employee` (`EmpID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
