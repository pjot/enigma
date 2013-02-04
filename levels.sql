DROP TABLE IF EXISTS `levels`;
CREATE TABLE `levels` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `data` text,
  `name` varchar(255) DEFAULT NULL,
  `number` int(8) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_number` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
LOCK TABLES `levels` WRITE;
INSERT INTO `levels` VALUES (11,'{\"player\":[5,17],\"tiles\":{\"wall\":[[4,9],[4,10],[4,11],[5,9],[16,17],[17,9],[17,17],[18,9],[18,10],[18,17]],\"coin\":[[5,10],[17,10],[17,16]],\"hole\":[]}}','andra banan',2),(12,'{\"player\":[3,8],\"tiles\":{\"wall\":[[2,17],[2,18],[2,19],[3,19],[4,19],[19,7],[20,17],[20,18]],\"coin\":[[3,18],[19,8],[19,18]],\"hole\":[]}}','tredje',3),(13,'{\"player\":[21,8],\"tiles\":{\"wall\":[[3,17],[4,7],[21,18]],\"coin\":[[4,8],[4,17],[21,17]],\"hole\":[]}}','fyra',4),(16,'{\"player\":[21,8],\"tiles\":{\"wall\":[[3,17],[4,7],[21,18]],\"coin\":[[4,8],[4,17],[21,17]],\"hole\":[]}}','sex',6),(17,'{\"player\":[4,13],\"tiles\":{\"wall\":[[3,4],[3,5],[4,4],[7,15],[8,7],[15,16],[16,5],[25,8]],\"coin\":[[4,9],[8,8],[8,15],[15,5],[15,15],[24,8]],\"hole\":[]}}','fem',5),(18,'{\"player\":[16,7],\"tiles\":{\"wall\":[[5,7],[5,8],[5,9],[6,6],[6,10],[6,17],[7,6],[11,18],[12,9],[18,10],[19,17]],\"coin\":[[6,7],[6,9],[7,17],[11,9],[11,17],[18,11],[18,17]],\"hole\":[]}}','test',1);
UNLOCK TABLES;
