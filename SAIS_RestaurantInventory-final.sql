-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 09, 2024 at 07:47 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `SAIS_RestaurantInventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `Inventory`
--

CREATE TABLE `Inventory` (
  `inventoryID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ItemMovements`
--

CREATE TABLE `ItemMovements` (
  `movementID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `movementType` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `controlledByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PredictedDemand`
--

CREATE TABLE `PredictedDemand` (
  `demandID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `predictedQuantity` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Produce`
--

CREATE TABLE `Produce` (
  `produceID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `weight` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `productID` int(11) NOT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `productType` tinyint(1) DEFAULT NULL,
  `supplierID` int(11) DEFAULT NULL,
  `activeStatus` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `addedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `RecipeIngredients`
--

CREATE TABLE `RecipeIngredients` (
  `recipeID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `RecipeRecommendations`
--

CREATE TABLE `RecipeRecommendations` (
  `recipeID` int(11) NOT NULL,
  `recipeName` varchar(255) DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `roleID` int(11) NOT NULL,
  `roleName` varchar(255) DEFAULT NULL,
  `canControlInventory` tinyint(1) DEFAULT NULL,
  `canAddProducts` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Suppliers`
--

CREATE TABLE `Suppliers` (
  `supplierID` int(11) NOT NULL,
  `supplierName` varchar(255) DEFAULT NULL,
  `contactDetails` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Suppliers`
--

INSERT INTO `Suppliers` (`supplierID`, `supplierName`, `contactDetails`, `createdAt`, `updatedAt`) VALUES
(1, 'rami', 'co-', '2024-03-09 18:31:50', '2024-03-09 18:31:50');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `userID` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `passwordHash` varchar(255) DEFAULT NULL,
  `roleID` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Inventory`
--
ALTER TABLE `Inventory`
  ADD PRIMARY KEY (`inventoryID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `ItemMovements`
--
ALTER TABLE `ItemMovements`
  ADD PRIMARY KEY (`movementID`),
  ADD KEY `productID` (`productID`),
  ADD KEY `controlledByUserID` (`controlledByUserID`);

--
-- Indexes for table `PredictedDemand`
--
ALTER TABLE `PredictedDemand`
  ADD PRIMARY KEY (`demandID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `Produce`
--
ALTER TABLE `Produce`
  ADD PRIMARY KEY (`produceID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`productID`),
  ADD KEY `addedByUserID` (`addedByUserID`),
  ADD KEY `fk_supplier` (`supplierID`);

--
-- Indexes for table `RecipeIngredients`
--
ALTER TABLE `RecipeIngredients`
  ADD KEY `recipeID` (`recipeID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `RecipeRecommendations`
--
ALTER TABLE `RecipeRecommendations`
  ADD PRIMARY KEY (`recipeID`);

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`roleID`);

--
-- Indexes for table `Suppliers`
--
ALTER TABLE `Suppliers`
  ADD PRIMARY KEY (`supplierID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `roleID` (`roleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Inventory`
--
ALTER TABLE `Inventory`
  MODIFY `inventoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ItemMovements`
--
ALTER TABLE `ItemMovements`
  MODIFY `movementID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PredictedDemand`
--
ALTER TABLE `PredictedDemand`
  MODIFY `demandID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Produce`
--
ALTER TABLE `Produce`
  MODIFY `produceID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1001;

--
-- AUTO_INCREMENT for table `RecipeRecommendations`
--
ALTER TABLE `RecipeRecommendations`
  MODIFY `recipeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Roles`
--
ALTER TABLE `Roles`
  MODIFY `roleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Suppliers`
--
ALTER TABLE `Suppliers`
  MODIFY `supplierID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Inventory`
--
ALTER TABLE `Inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `Products` (`productID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `ItemMovements`
--
ALTER TABLE `ItemMovements`
  ADD CONSTRAINT `itemmovements_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `Products` (`productID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `itemmovements_ibfk_2` FOREIGN KEY (`controlledByUserID`) REFERENCES `Users` (`userID`);

--
-- Constraints for table `PredictedDemand`
--
ALTER TABLE `PredictedDemand`
  ADD CONSTRAINT `predicteddemand_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `Products` (`productID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `Produce`
--
ALTER TABLE `Produce`
  ADD CONSTRAINT `produce_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `Products` (`productID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `Products`
--
ALTER TABLE `Products`
  ADD CONSTRAINT `fk_supplier` FOREIGN KEY (`supplierID`) REFERENCES `Suppliers` (`supplierID`),
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`addedByUserID`) REFERENCES `Users` (`userID`);

--
-- Constraints for table `RecipeIngredients`
--
ALTER TABLE `RecipeIngredients`
  ADD CONSTRAINT `recipeingredients_ibfk_1` FOREIGN KEY (`recipeID`) REFERENCES `RecipeRecommendations` (`recipeID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `recipeingredients_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `Products` (`productID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleID`) REFERENCES `Roles` (`roleID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
