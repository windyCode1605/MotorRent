-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: carvip1
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `rentaladdons`
--

DROP TABLE IF EXISTS `rentaladdons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rentaladdons` (
  `addon_id` int NOT NULL AUTO_INCREMENT,
  `rental_id` int NOT NULL,
  `addon_type` enum('Insurance','Child Seat','GPS','WiFi','Other') NOT NULL,
  `addon_name` varchar(255) NOT NULL,
  `addon_price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `total_price` decimal(10,2) GENERATED ALWAYS AS ((`addon_price` * `quantity`)) STORED,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`addon_id`),
  KEY `rental_id` (`rental_id`),
  CONSTRAINT `rentaladdons_ibfk_1` FOREIGN KEY (`rental_id`) REFERENCES `rental` (`rental_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rentaladdons`
--

LOCK TABLES `rentaladdons` WRITE;
/*!40000 ALTER TABLE `rentaladdons` DISABLE KEYS */;
INSERT INTO `rentaladdons` (`addon_id`, `rental_id`, `addon_type`, `addon_name`, `addon_price`, `quantity`, `created_at`, `updated_at`) VALUES (1,1,'Insurance','Bảo hiểm toàn diện',500000.00,1,'2025-04-05 07:33:21','2025-04-05 07:33:21'),(2,1,'Child Seat','Ghế trẻ em',100000.00,2,'2025-04-05 07:33:21','2025-04-05 07:33:21'),(3,2,'GPS','Thiết bị định vị GPS',150000.00,1,'2025-04-05 07:33:21','2025-04-05 07:33:21'),(4,3,'WiFi','WiFi di động',200000.00,1,'2025-04-05 07:33:21','2025-04-05 07:33:21'),(5,3,'Other','Gói vệ sinh xe',80000.00,1,'2025-04-05 07:33:21','2025-04-05 07:33:21');
/*!40000 ALTER TABLE `rentaladdons` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22  9:49:43
