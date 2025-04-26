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
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `driver_license_number` varchar(50) NOT NULL,
  `driver_license_expiry` date DEFAULT NULL,
  `membership_status` enum('Regular','VIP','Premium') DEFAULT 'Regular',
  `id_card_number` varchar(50) DEFAULT NULL,
  `id_card_issued_date` date DEFAULT NULL,
  `id_card_issued_by` varchar(255) DEFAULT NULL,
  `driver_license_class` varchar(20) DEFAULT NULL,
  `driver_license_issued_date` date DEFAULT NULL,
  `driver_license_issued_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `balance` decimal(10,2) DEFAULT '0.00',
  `total_rent` decimal(10,2) DEFAULT '0.00',
  `password` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `account_id` int DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `driver_license_number` (`driver_license_number`),
  UNIQUE KEY `id_card_number` (`id_card_number`),
  KEY `fk_customers_account` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Nguyễn','Minh Tuấn','nguyenminhtuan@email.com','0912345678','1990-05-15','Male','Số 10, đường Nguyễn Huệ, Hà Nội','1234567890','2025-05-15','VIP','123456789012','2010-08-10','Công an Hà Nội','A1','2010-08-10','Sở Giao thông Vận tải Hà Nội','2025-04-04 02:22:09','2025-04-21 16:50:55',20000.00,120000.00,'','khách hàng muốn xe giao đúng giờ ',18),(2,'Trần','Thị Mai','tranthimai@email.com','0987654321','1985-11-20','Female','Số 25, đường Lý Thường Kiệt, TP.HCM','2345678901','2026-11-20','Premium','234567890123','2015-02-12','Công an TP.HCM','B2','2015-02-12','Sở Giao thông Vận tải TP.HCM','2025-04-04 02:22:09','2025-04-14 09:41:17',12900.00,120000.00,'','',2),(3,'Lê','Hữu Phước','lehuuphuoc@email.com','0934567890','1992-03-30','Male','Số 15, đường Hoàng Văn Thụ, Đà Nẵng','3456789012','2024-03-30','Regular','345678901234','2012-10-10','Công an Đà Nẵng','C','2012-10-10','Sở Giao thông Vận tải Đà Nẵng','2025-04-04 02:22:09','2025-04-05 09:50:41',1500000.00,360000.00,'','',NULL),(4,'Phan','Thị Kim Lan','phanthikimlan@email.com','0912349876','1988-07-22','Female','Số 18, đường Trường Chinh, Bình Dương','4567890123','2027-07-22','VIP','456789012345','2014-06-20','Công an Bình Dương','A2','2014-06-20','Sở Giao thông Vận tải Bình Dương','2025-04-04 02:22:09','2025-04-14 09:41:17',179990.00,150000.00,'','',3),(5,'Hoàng','Ngọc Sơn','hoangngocson@email.com','0901234567','1995-01-10','Male','Số 30, đường Phan Đình Phùng, Cần Thơ','5678901234','2028-01-10','Regular','567890123456','2018-12-15','Công an Cần Thơ','B1','2018-12-15','Sở Giao thông Vận tải Cần Thơ','2025-04-04 02:22:09','2025-04-14 09:41:17',200000.00,120000.00,'','',5),(6,'Vũ','Thị Lan Anh','vuthilananh@email.com','0988123456','1994-09-12','Female','Số 5, đường Nguyễn Văn Cừ, Hải Phòng','6789012345','2025-09-12','Premium','678901234567','2016-11-10','Công an Hải Phòng','B2','2016-11-10','Sở Giao thông Vận tải Hải Phòng','2025-04-04 02:22:09','2025-04-14 09:41:17',0.00,0.00,'','',5),(7,'Phạm','Hoàng Nam','phamhoangnam@email.com','0938123456','1993-06-25','Male','Số 40, đường Võ Thị Sáu, Quảng Ninh','7890123456','2027-06-25','VIP','789012345678','2014-08-18','Công an Quảng Ninh','C1','2014-08-18','Sở Giao thông Vận tải Quảng Ninh','2025-04-04 02:22:09','2025-04-14 09:41:17',1400000.00,124000.00,'','',6),(8,'Ngô','Thị Bích Ngọc','ngothibichngoc@email.com','0902345678','1987-12-05','Female','Số 8, đường Trần Hưng Đạo, Nghệ An','8901234567','2026-12-05','Regular','890123456789','2013-09-30','Công an Nghệ An','A1','2013-09-30','Sở Giao thông Vận tải Nghệ An','2025-04-04 02:22:09','2025-04-14 09:41:17',150000.00,120000.00,'','',6),(9,'Đỗ','Quang Huy','doquanghuy@email.com','0912348765','1989-10-13','Male','Số 12, đường Nguyễn Lương Bằng, Nam Định','9012345678','2024-10-13','Regular','901234567890','2012-07-18','Công an Nam Định','A2','2012-07-18','Sở Giao thông Vận tải Nam Định','2025-04-04 02:22:09','2025-04-05 09:50:41',180000.00,140000.00,'','',NULL),(10,'Bùi','Thị Thu Hà','buihithuha@email.com','0987345678','1991-02-28','Female','Số 60, đường Lê Duẩn, Thanh Hóa','0123456789','2023-02-28','Premium','012345678901','2017-05-10','Công an Thanh Hóa','B1','2017-05-10','Sở Giao thông Vận tải Thanh Hóa','2025-04-04 02:22:09','2025-04-05 09:50:41',2000000.00,500000.00,'','',NULL),(12,'Nguyễn','Tú','nguyentu@example.com','0912345678','1995-04-01','Male','123 Phố Huế, Hà Nội','123456789','2030-01-01','VIP','987654321','2015-01-01','CA Hà Nội','A1','2016-01-01','Sở GTVT HN','2025-04-06 15:59:18','2025-04-06 15:59:18',0.00,0.00,'$2b$10$bDJay3uyx0pQ40GdkGMt7eWf5KHfG5gkfZkR9/uIc9CuUQ2zi0GTy','Khách hay thuê xe',NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
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
