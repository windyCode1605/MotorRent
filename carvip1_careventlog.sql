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
-- Table structure for table `careventlog`
--

DROP TABLE IF EXISTS `careventlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `careventlog` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `car_id` int NOT NULL,
  `event_type` enum('Accident','Damage','Maintenance','Inspection','Other') NOT NULL,
  `event_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text NOT NULL,
  `reported_by` varchar(255) NOT NULL,
  `status` enum('Pending','Resolved','Investigating') NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `careventlog_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `car` (`car_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `careventlog`
--

LOCK TABLES `careventlog` WRITE;
/*!40000 ALTER TABLE `careventlog` DISABLE KEYS */;
INSERT INTO `careventlog` VALUES (1,1,'Accident','2025-04-04 02:15:47','Xe bị va chạm nhẹ ở phần trước, trầy xước cản trước.','Nhân viên bảo trì','Investigating','2025-04-04 02:15:47','2025-04-04 02:15:47'),(2,2,'Damage','2025-04-04 02:15:47','Gương chiếu hậu bị vỡ do va chạm.','Khách hàng','Pending','2025-04-04 02:15:47','2025-04-04 02:15:47'),(3,3,'Maintenance','2025-04-04 02:15:47','Kiểm tra và thay nhớt định kỳ.','Nhân viên kỹ thuật','Resolved','2025-04-04 02:15:47','2025-04-04 02:15:47'),(4,4,'Inspection','2025-04-04 02:15:47','Kiểm tra tổng thể xe trước khi bàn giao.','Lễ tân','Pending','2025-04-04 02:15:47','2025-04-04 02:15:47'),(5,5,'Other','2025-04-04 02:15:47','Khách hàng phản ánh có tiếng kêu lạ khi vận hành.','Khách hàng','Investigating','2025-04-04 02:15:47','2025-04-04 02:15:47'),(6,6,'Accident','2025-04-04 02:15:47','Xe bị té ngã khi đang đỗ, trầy xước nhẹ.','Bảo vệ bãi xe','Resolved','2025-04-04 02:15:47','2025-04-04 02:15:47'),(7,7,'Damage','2025-04-04 02:15:47','Lốp xe sau bị thủng, cần vá lốp.','Nhân viên bảo trì','Pending','2025-04-04 02:15:47','2025-04-04 02:15:47'),(8,8,'Maintenance','2025-04-04 02:15:47','Thay má phanh do hao mòn.','Nhân viên kỹ thuật','Resolved','2025-04-04 02:15:47','2025-04-04 02:15:47'),(9,9,'Inspection','2025-04-04 02:15:47','Kiểm tra xe trước khi cho thuê.','Lễ tân','Pending','2025-04-04 02:15:47','2025-04-04 02:15:47'),(10,10,'Other','2025-04-04 02:15:47','Khách hàng phản hồi về hệ thống phanh có cảm giác lỏng.','Khách hàng','Investigating','2025-04-04 02:15:47','2025-04-04 02:15:47');
/*!40000 ALTER TABLE `careventlog` ENABLE KEYS */;
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
