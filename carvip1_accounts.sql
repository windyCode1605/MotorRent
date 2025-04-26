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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','staff','admin') NOT NULL DEFAULT 'customer',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'alice@example.com','$2b$10$A1hash1abcabcabcabcabcabcabcabcabcabcabcabcabcabcabc','customer',1,'2025-04-14 09:14:11'),(2,'bob@example.com','$2b$10$B2hash2xyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyz','staff',1,'2025-04-14 09:14:11'),(3,'carol@example.com','$2b$10$C3hash3defdefdefdefdefdefdefdefdefdefdefdefdefdef','admin',1,'2025-04-14 09:14:11'),(4,'dave@example.com','$2b$10$D4hash4qweqweqweqweqweqweqweqweqweqweqweqweqwe','customer',1,'2025-04-14 09:14:11'),(5,'eva@example.com','$2b$10$E5hash5asdasdasdasdasdasdasdasdasdasdasdasdasd','staff',1,'2025-04-14 09:14:11'),(6,'frank@example.com','$2b$10$F6hash6zxcvzxczxcvzxczxcvzxczxcvzxczxcvzxczxcv','customer',1,'2025-04-14 09:14:11'),(7,'grace@example.com','$2b$10$G7hash7plmplmplmplmplmplmplmplmplmplmplmplmp','staff',1,'2025-04-14 09:14:11'),(8,'hank@example.com','$2b$10$H8hash8rtyrtyrtyrtyrtyrtyrtyrtyrtyrtyrtyrty','admin',1,'2025-04-14 09:14:11'),(9,'ivy@example.com','$2b$10$I9hash9nmgnmgnmgnmgnmgnmgnmgnmgnmgnmgnmgnmgnmg','customer',1,'2025-04-14 09:14:11'),(10,'john@example.com','$2b$10$J0hash0uiouiouiouiouiouiouiouiouiouiouiouiouiou','staff',1,'2025-04-14 09:14:11'),(11,'testuser1@example.com','$2b$10$X15t.mlJzZcyHlHxzi5JzevFTOiHSK5V.Ckf8uFi0ilVr8XZk7SqC','customer',1,'2025-04-14 10:24:28'),(12,'Tusena@example.com','$2b$10$FFRgtnehOYa9dp1XGPzAa.MlxQjwAnh0mif6Cstn4ueY/8zNVI7kq','customer',1,'2025-04-14 10:27:54'),(13,'Tusna@example.com','$2b$10$3AG.z./FDZ22RVZdqC5sfuLBzjo4EYuLO/h5txs1amaTKrI89JpUm','customer',1,'2025-04-14 10:53:10'),(14,'newuser@example.com','$2b$10$JIbyFiErn2S/GQFoTzgm8OtII1e4TrbmmC.idibFSxBSDgGatFA92','customer',1,'2025-04-14 11:31:42'),(15,'test2@example.com','$2b$10$i74WkCcU3iIacUevRmt33OApaVSgKuJxkXd/liCSqt4fzFedhZpGG','customer',1,'2025-04-14 13:52:09'),(16,'test@example.com','$2b$10$xLJgQcFX06pmH8bCIJgz9eDivY.mgqUKmTFxo6kFM3p54DFYU82Ge','customer',1,'2025-04-14 14:28:49'),(17,'DM@example.com','$2b$10$jhr2id6kvlN3SMnIS6ItSeoFxSQN.BOU3nYPJeQFfnDoDI5FFAxPq','customer',1,'2025-04-14 14:35:22'),(18,'admin@example.com','$2b$10$mmglKE0ggC6eC5Kuz8kW5.30OaXkM4AZtz9INgd5jCvTrCoygTZqa','customer',1,'2025-04-14 14:35:22');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
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
