-- MySQL dump 10.13  Distrib 5.5.29, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: enigma
-- ------------------------------------------------------
-- Server version	5.5.29-0ubuntu0.12.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `levels` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `data` text,
  `name` varchar(255) DEFAULT NULL,
  `number` int(8) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_number` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (11,'{\"player\":[5,17],\"tiles\":{\"wall\":[[4,9],[4,10],[4,11],[5,9],[16,17],[17,9],[17,17],[18,9],[18,10],[18,17]],\"coin\":[[5,10],[17,10],[17,16]],\"hole\":[]}}','andra banan',2),(12,'{\"player\":[3,8],\"tiles\":{\"wall\":[[2,17],[2,18],[2,19],[3,19],[4,19],[19,7],[20,17],[20,18]],\"coin\":[[3,18],[19,8],[19,18]],\"hole\":[]}}','tredje',3),(13,'{\"player\":[21,8],\"tiles\":{\"wall\":[[3,17],[4,7],[21,18]],\"coin\":[[4,8],[4,17],[21,17]],\"hole\":[]}}','fyra',4),(16,'{\"player\":[21,8],\"tiles\":{\"wall\":[[3,17],[4,7],[21,18]],\"coin\":[[4,8],[4,17],[21,17]],\"hole\":[]}}','sex',6),(17,'{\"player\":[4,13],\"tiles\":{\"wall\":[[3,4],[3,5],[4,4],[7,15],[8,7],[15,16],[16,5],[25,8]],\"coin\":[[4,9],[8,8],[8,15],[15,5],[15,15],[24,8]],\"hole\":[]}}','fem',5);
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-01-26  0:42:30
