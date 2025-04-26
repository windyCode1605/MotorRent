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
-- Table structure for table `car`
--

DROP TABLE IF EXISTS `car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car` (
  `car_id` int NOT NULL AUTO_INCREMENT,
  `barcode` varchar(50) NOT NULL,
  `parking_spot` varchar(20) NOT NULL,
  `license_plate` varchar(20) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `fuel_type` enum('Gasoline','Electric') NOT NULL,
  `transmission` enum('CVT','Automatic') NOT NULL,
  `mileage` int NOT NULL,
  `status` enum('Available','Rented','Maintenance','Unavailable') NOT NULL DEFAULT 'Available',
  `daily_rental_price` decimal(10,2) NOT NULL,
  `insurance_status` enum('Active','Expired','None') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `IMG_Motor` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`car_id`),
  UNIQUE KEY `barcode` (`barcode`),
  UNIQUE KEY `license_plate` (`license_plate`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car`
--

LOCK TABLES `car` WRITE;
/*!40000 ALTER TABLE `car` DISABLE KEYS */;
INSERT INTO `car` VALUES (1,'BAR123456','A12','59A1-12345','Honda','Honda SH 150i',2023,'Black','Gasoline','CVT',12000,'Available',150000.00,'Active','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car1.jpg'),(2,'BAR123457','B05','59C2-56789','Yamaha','Yamaha NVX 155',2022,'Red','Gasoline','CVT',9000,'Rented',120000.00,'Active','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car2.jpg'),(3,'BAR123458','C07','60B3-34567','Suzuki','Suzuki Burgman Street 125',2021,'White','Gasoline','CVT',15000,'Available',100000.00,'Expired','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car3.jpg'),(4,'BAR123459','D09','61D4-78901','Honda','Honda AirBlade 160',2024,'Blue','Gasoline','CVT',5000,'Available',130000.00,'Active','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car4.jpg'),(5,'BAR123460','E11','62E5-23456','Yamaha','Yamaha Grande Hybrid',2023,'Silver','Gasoline','CVT',8000,'Maintenance',110000.00,'Active','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car5.jpg'),(6,'BAR123461','F13','63F6-67890','Honda','Honda Vision 110',2022,'Gray','Gasoline','CVT',11000,'Rented',90000.00,'None','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car6.jpg'),(7,'BAR123462','G15','64G7-13579','VinFast','VinFast Klara S',2023,'White','Electric','CVT',7000,'Available',140000.00,'Active','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car7.jpg'),(8,'BAR123463','H17','65H8-24680','Yamaha','Yamaha Sirius FI',2021,'Black','Gasoline','Automatic',17000,'Unavailable',80000.00,'Expired','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car8.jpg'),(9,'BAR123464','I19','66I9-11223','Honda','Honda Wave Alpha',2020,'Red','Gasoline','Automatic',20000,'Available',70000.00,'None','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car9.jpg'),(10,'BAR123465','J21','67J0-33445','Piaggio','Piaggio Liberty 125',2023,'Blue','Gasoline','CVT',6000,'Available',160000.00,'Active','2025-04-04 02:15:07','2025-04-19 14:04:31','uploads/car10.jpg'),(11,'BAR12346d5','J21d','67J0-d33445','Piaggido','Piaggido Liberty 125',2022,'Blue','Gasoline','CVT',6000,'Available',160000.00,'Active',NULL,'2025-04-20 15:28:01','uploads/car2.jpg'),(15,'BAR12346d53','J21dee','67J0-d33445rr','Piaggidorr','Piaggido Liberty 125',2022,'Blue','Gasoline','CVT',6000,'Available',160000.00,'Active','2025-04-20 10:37:24','2025-04-20 15:28:01','uploads/car2.jpg');
/*!40000 ALTER TABLE `car` ENABLE KEYS */;
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
