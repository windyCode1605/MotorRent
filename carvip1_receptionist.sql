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
-- Table structure for table `receptionist`
--

DROP TABLE IF EXISTS `receptionist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receptionist` (
  `receptionist_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `shift` enum('Morning','Afternoon','Night') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`receptionist_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receptionist`
--

LOCK TABLES `receptionist` WRITE;
/*!40000 ALTER TABLE `receptionist` DISABLE KEYS */;
INSERT INTO `receptionist` VALUES (1,'Nguyễn Thị Mai','mainguyen@carvip.vn','0912000111','fc8d5c17ee6bd893ac3d47583df509da68ada40070b9c9e1890cae52bc62de28','Morning','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL),(2,'Trần Văn Hoàng','hoangtran@carvip.vn','0912000222','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','Afternoon','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL),(3,'Lê Thị Hạnh','hanhle@carvip.vn','0912000333','c27530366f59171e88c0f3b3f616709968cb237d1a350fc093c4fd0c44c438c2','Night','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL),(4,'Phạm Quốc Duy','duypham@carvip.vn','0912000444','dd8554a8432466cc5e32ff9fb396a03f54e5eeb44c2646fed7e9d5667ea8a6a5','Morning','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL),(5,'Đỗ Thị Minh','minhdo@carvip.vn','0912000555','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','Afternoon','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL),(6,'Ngô Văn Nam','namngo@carvip.vn','0912000666','c9d01074e8403be06be97270c00bb3b25182abebea391d158dbbbf92e97337e3','Night','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL),(7,'Hoàng Thị Huyền','huyenhoang@carvip.vn','0912000777','ca3d188f3d6253f368efa12bc685a3e5ae0425db266b65c5f794bed2c95f2a60','Morning','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL),(8,'Vũ Quốc Thịnh','thinhvu@carvip.vn','0912000888','a8672375d5b3fdc55d0de4918905804ecb626b951db4031e8ab8e29986943437','Afternoon','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL),(9,'Bùi Thị Thanh','thanhbui@carvip.vn','0912000999','f618b682bf20df63907eeb3839404bf0ad021c440996cf7a8cec9186e8bc4a26','Night','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL),(10,'Nguyễn Văn Cường','cuongnguyen@carvip.vn','0912001000','85bbfc1d298889e4facaaa08455ffe14fc4ab8259d0c9166fdac13ab2913a216','Morning','2025-04-05 07:22:05','2025-04-05 07:22:05',NULL);
/*!40000 ALTER TABLE `receptionist` ENABLE KEYS */;
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
