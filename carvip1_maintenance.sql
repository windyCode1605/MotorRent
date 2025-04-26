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
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `maintenance_id` int NOT NULL AUTO_INCREMENT,
  `car_id` int NOT NULL,
  `maintenance_date` date NOT NULL,
  `description` text NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `status` enum('Scheduled','In Progress','Completed') NOT NULL DEFAULT 'Scheduled',
  `mechanic` varchar(255) NOT NULL,
  `next_maintenance_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`maintenance_id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `car` (`car_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
INSERT INTO `maintenance` VALUES (1,1,'2024-12-10','Thay dầu động cơ và kiểm tra hệ thống phanh',1500000.00,'Completed','Garage Minh Anh','2025-06-10','2025-04-05 07:17:22','2025-04-05 07:17:22'),(2,2,'2025-01-15','Sửa chữa hệ thống điện và đèn pha',2200000.00,'Completed','AutoFix Hà Nội','2025-07-15','2025-04-05 07:17:22','2025-04-05 07:17:22'),(3,3,'2025-02-20','Bảo trì định kỳ: thay lọc gió, cân chỉnh lốp',1300000.00,'Scheduled','Trung tâm kỹ thuật An Khang','2025-08-20','2025-04-05 07:17:22','2025-04-05 07:17:22'),(4,4,'2025-03-05','Thay lốp trước bên trái và kiểm tra treo xe',1700000.00,'In Progress','Garage Quang Vinh',NULL,'2025-04-05 07:17:22','2025-04-05 07:17:22'),(5,5,'2025-03-12','Kiểm tra điều hòa không khí và thay gas lạnh',1000000.00,'Completed','Garage Trung Đức','2025-09-12','2025-04-05 07:17:22','2025-04-05 07:17:22'),(6,6,'2025-03-18','Khắc phục tiếng ồn từ hộp số',2500000.00,'Scheduled','AutoFix Đà Nẵng','2025-09-18','2025-04-05 07:17:22','2025-04-05 07:17:22'),(7,7,'2025-03-20','Sơn lại vỏ xe do trầy xước',3000000.00,'In Progress','Garage Sơn Tùng',NULL,'2025-04-05 07:17:22','2025-04-05 07:17:22'),(8,8,'2025-03-25','Sửa chữa hệ thống treo và cân chỉnh góc lái',2800000.00,'Completed','Trung tâm AutoPro','2025-09-25','2025-04-05 07:17:22','2025-04-05 07:17:22'),(9,9,'2025-03-28','Bảo trì định kỳ 10.000km: thay dầu, lọc nhớt',1600000.00,'Completed','AutoCare Việt Đức','2025-09-28','2025-04-05 07:17:22','2025-04-05 07:17:22'),(10,10,'2025-04-01','Kiểm tra rò rỉ dầu động cơ',1200000.00,'Scheduled','Garage Hùng Mạnh','2025-10-01','2025-04-05 07:17:22','2025-04-05 07:17:22');
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22  9:49:44
