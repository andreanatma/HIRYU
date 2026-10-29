/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.16-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: hiryutechno
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES
('481bacaa-3416-42b3-a2d4-a54f0a2609e5','185e9f43600fb26e85feabff4f4f01240fc2c5049fdce0adddee4bc9ea9ce7fa','2026-10-28 12:47:35.503','20261028124734_add_bilingual_fields',NULL,NULL,'2026-10-28 12:47:34.778',1),
('5bea2e0e-16bc-40f7-adc3-d8785e23517d','a24c2152029de278588a3f1361891b2fd2824646b17e0e80cfb8666deea5b630','2026-10-28 12:47:08.897','20261028000000_hiryutechno_cms',NULL,NULL,'2026-10-28 12:47:08.873',1),
('937e41cf-efc6-4bf1-8cbd-65394de124fa','61b5d85f909386549b627eec65133df37fd9132c744a5fcf0621b3752091fb9f','2026-10-28 12:47:08.872','20261026090727_init',NULL,NULL,'2026-10-28 12:47:08.185',1),
('d8b13873-df38-419a-a23f-8d7b9809d064','e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',NULL,'20261028120000_about_section_images','A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20261028120000_about_section_images\n\nDatabase error code: 1065\n\nDatabase error:\nQuery was empty\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20261028120000_about_section_images\"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name=\"20261028120000_about_section_images\"\n             at schema-engine\\core\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:226','2026-10-28 14:11:10.759','2026-10-28 14:01:06.602',0);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_sections`
--

DROP TABLE IF EXISTS `about_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `heading` varchar(200) NOT NULL,
  `body` text NOT NULL,
  `imageId` int(11) DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `headingId` varchar(200) DEFAULT NULL,
  `bodyId` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `about_sections_isActive_displayOrder_idx` (`isActive`,`displayOrder`),
  KEY `about_sections_imageId_idx` (`imageId`),
  CONSTRAINT `about_sections_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_sections`
--

LOCK TABLES `about_sections` WRITE;
/*!40000 ALTER TABLE `about_sections` DISABLE KEYS */;
INSERT INTO `about_sections` VALUES
(1,'Tentang PT Hiryu Techno Indonesia','Kami adalah perusahaan yang bergerak di bidang jasa, yang melayani kebutuhan reparasi, perbaikan, perawatan, kalibrasi dan pengadaan alat uji, alat laboratorium, alat industri. Kami telah menekuni bidang ini lebih dari 10 tahun, yang sampai saat ini sudah melayani beragam pelanggan mulai dari laboratorium RnD (Riset) manufaktur, Universitas, Klinik & Rumah Sakit, laboratorium balai pemerintahan, dan banyak lainnya.\n\nDidirikan dengan nama Hiryu Teknik dan diperbarui dengan nama PT Hiryu Techno Indonesia dengan akta no AHU-013946.AH.01.30. Tahun 2023.',NULL,0,1,'2026-10-28 13:37:46.739','2026-10-28 13:37:46.739',NULL,NULL),
(2,'Visi Kami','Menjadi mitra terkemuka dalam penyediaan solusi perbaikan, kalibrasi dan suplai alat laboratorium yang inovatif dan handal. Kami berkomitmen untuk mendukung kemajuan riset dan pengembangan dengan menyediakan pelayanan yang terbaik, cepat, dan tepat.',NULL,1,1,'2026-10-28 13:37:46.739','2026-10-28 13:37:46.739',NULL,NULL),
(3,'Misi Kami','## Memberikan Solusi Berkualitas Tinggi\nIsi utama kami adalah memberikan solusi laboratorium berkualitas tinggi kepada pelanggan kami. Kami berkomitmen untuk menghadirkan produk dan layanan yang memenuhi atau bahkan melebihi standar industri dan harapan pelanggan.\n\n## Mendukung Penelitian dan Inovasi\nKami memahami peran penting laboratorium dalam penelitian dan inovasi. Misi kami adalah menjadi mitra yang dapat diandalkan bagi komunitas ilmiah dan industri, menyediakan alat dan layanan yang mendukung kemajuan ilmiah.\n\n## Pelayanan Pelanggan yang Luar Biasa\nKami menekankan pentingnya kepuasan pelanggan. Misi kami adalah memberikan pelayanan pelanggan yang luar biasa, termasuk dukungan teknis yang unggul, untuk memastikan pelanggan kami merasa didukung sepanjang perjalanan.',NULL,2,1,'2026-10-28 13:37:46.739','2026-10-28 13:37:46.739',NULL,NULL),
(4,'Prinsip Perusahaan','## Kualitas Utama\r\nKami menekankan komitmen kami pada kualitas dalam setiap aspek bisnis kami, mulai dari produk dan layanan hingga proses internal. Kami berusaha untuk memberikan yang terbaik kepada pelanggan kami.\r\n\r\n## Keamanan Terutama (Safety First)\r\nKeamanan adalah prioritas utama kami. Kami menjalankan praktik keselamatan yang ketat untuk melindungi karyawan kami, pelanggan kami, dan masyarakat umum dari risiko yang terkait dengan produk dan layanan kami.\r\n\r\n## Inovasi Berkelanjutan\r\nKami berkomitmen untuk terus berinovasi dan berkembang. Kami percaya bahwa inovasi adalah kunci untuk memenuhi kebutuhan yang berkembang dan menjaga relevansi dalam industri yang selalu berubah.\r\n\r\n## Pelayanan Pelanggan yang Luar Biasa\r\nKami memberikan perhatian khusus pada kepuasan pelanggan. Kami berusaha keras untuk mendengarkan dan memahami kebutuhan pelanggan kami, serta memberikan layanan yang memenuhi atau bahkan melebihi harapan mereka.\r\n\r\n## Tanggung Jawab Sosial dan Lingkungan\r\nKami menyadari dampak sosial dan lingkungan dari bisnis kami. Oleh karena itu, kami berkomitmen untuk bertindak secara bertanggung jawab, menjaga dampak lingkungan sekecil mungkin, dan memberikan dukungan bagi masyarakat di sekitar kami.\r\n\r\n## Kerjasama dan Kolaborasi\r\nKami memahami pentingnya kerjasama dengan pelanggan, mitra bisnis, dan sektor industri lainnya. Kami berusaha untuk membangun hubungan yang saling menguntungkan dan berkontribusi pada kesuksesan bersama.',2,3,1,'2026-10-28 13:37:46.739','2026-10-28 13:53:04.705',NULL,NULL),
(5,'Inilah Mengapa Anda Seharusnya Memilih Kami','- **Professional**: Kami adalah ahli yang terampil dan berpengalaman dalam menganalisis, memperbaiki, dan merawat berbagai jenis peralatan laboratorium maupun alat industri dengan fokus pada kualitas dan keamanan.\n- **Trusted**: Kepercayaan anda adalah prioritas kami, dan kami berkomitmen memberikan solusi pelayanan terbaik dengan transparansi dan integritas.\n- **Competitive Price**: Kami memberikan solusi perbaikan berkualitas tinggi dengan tarif yang kompetitif dibanding kompetitor kami tanpa mengorbankan kualitas kerja.\n- **Flexible**: Menghadirkan fleksibilitas dalam layanan perbaikan kami. Dari jadwal yang dapat disesuaikan hingga pilihan solusi yang variatif, kami siap mengakomodasi kebutuhan unik anda.\n- **Fast**: Menawarkan layanan perbaikan yang cepat dan responsif. Kami menghargai waktu anda dan berkomitmen untuk memberikan hasil yang memuaskan dengan waktu respon yang singkat.\n- **Customer Satisfication**: Kami berupaya untuk memberikan layanan perbaikan yang tidak hanya memperbaiki masalah, tetapi juga meninggalkan anda dengan perasaan puas pada kualitas.',NULL,4,1,'2026-10-28 13:37:46.739','2026-10-28 13:37:46.739',NULL,NULL);
/*!40000 ALTER TABLE `about_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `action` varchar(40) NOT NULL,
  `entity` varchar(60) NOT NULL,
  `entityId` varchar(40) DEFAULT NULL,
  `summary` varchar(500) NOT NULL,
  `ipAddress` varchar(64) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `activity_logs_userId_createdAt_idx` (`userId`,`createdAt`),
  KEY `activity_logs_entity_action_idx` (`entity`,`action`),
  KEY `activity_logs_createdAt_idx` (`createdAt`),
  CONSTRAINT `activity_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES
(1,1,'LOGIN','auth',NULL,'Login successful','::1','2026-10-28 13:04:51.160'),
(2,1,'UPLOAD','media','1','Uploaded image_2026-10-15_15-16-30 _2_.png (image/png, 81345 B)','::1','2026-10-28 13:39:38.030'),
(3,1,'UPDATE','about-us','4','Updated section \"Prinsip Perusahaan\" (fields: body, imageId)','::1','2026-10-28 13:39:42.041'),
(4,1,'UPDATE','about-us','4','Updated section \"Prinsip Perusahaan\" (fields: imageId)','::1','2026-10-28 13:41:06.140'),
(5,1,'UPLOAD','media','2','Uploaded image_2026-10-15_15-16-30 _2_.png (image/png, 81345 B)','::1','2026-10-28 13:53:00.087'),
(6,1,'UPDATE','about-us','4','Updated section \"Prinsip Perusahaan\" (fields: imageId)','::1','2026-10-28 13:53:04.717'),
(7,1,'UPLOAD','media','3','Uploaded image_2026-10-15_15-16-30 _2_.png (image/png, 81345 B)','::1','2026-10-28 14:25:38.532'),
(8,1,'CREATE','brands','1','Created brand \"RUNNING\"','::1','2026-10-28 14:26:06.082'),
(9,1,'UPLOAD','media','4','Uploaded image_2026-10-05_11-46-46.png (image/png, 71989 B)','::1','2026-10-28 14:27:10.907'),
(10,1,'CREATE','brands','2','Created brand \"LINK\"','::1','2026-10-28 14:27:20.903'),
(11,1,'UPLOAD','media','5','Uploaded image_2026-09-28_14-11-40 _4_ - Copy.png (image/png, 87171 B)','::1','2026-10-28 14:51:00.192'),
(12,1,'UPLOAD','media','6','Uploaded image_2026-09-28_14-11-40 _4_.png (image/png, 87171 B)','::1','2026-10-28 14:51:00.274'),
(13,1,'UPLOAD','media','7','Uploaded image_2026-09-28_14-11-40 _3_ - Copy.png (image/png, 87530 B)','::1','2026-10-28 14:51:00.359'),
(14,1,'UPLOAD','media','8','Uploaded image_2026-09-28_14-11-40 _3_.png (image/png, 87530 B)','::1','2026-10-28 14:51:00.441'),
(15,1,'UPLOAD','media','9','Uploaded image_2026-09-28_14-11-40 _2_ - Copy.png (image/png, 87369 B)','::1','2026-10-28 14:51:00.525'),
(16,1,'UPLOAD','media','10','Uploaded image_2026-09-28_14-11-40 - Copy.png (image/png, 87399 B)','::1','2026-10-28 14:51:00.592'),
(17,1,'UPLOAD','media','11','Uploaded image_2026-09-28_14-08-17 _3_ - Copy.png (image/png, 50476 B)','::1','2026-10-28 14:51:00.658'),
(18,1,'UPLOAD','media','12','Uploaded image_2026-09-28_14-08-17 _3_.png (image/png, 50476 B)','::1','2026-10-28 14:51:00.725'),
(19,1,'UPLOAD','media','13','Uploaded image_2026-09-28_14-08-17 _4_ - Copy.png (image/png, 75408 B)','::1','2026-10-28 14:51:00.804'),
(20,1,'UPLOAD','media','14','Uploaded image_2026-09-28_14-08-17 _4_.png (image/png, 75408 B)','::1','2026-10-28 14:51:00.892'),
(21,1,'CREATE','gallery',NULL,'Added 10 gallery image(s) via bulk upload','::1','2026-10-28 14:51:00.971'),
(22,1,'UPLOAD','media','15','Uploaded PelatihanAc.jpg (image/jpeg, 951384 B)','::1','2026-10-28 14:51:55.998'),
(23,1,'CREATE','gallery','11','Created photo \"COBA\"','::1','2026-10-28 14:51:57.981'),
(24,1,'LOGIN','auth',NULL,'Login successful','::1','2026-10-29 00:20:27.429'),
(25,1,'SETTINGS','settings',NULL,'Updated site settings (15 fields)','::1','2026-10-29 00:22:05.011'),
(26,1,'LOGIN','auth',NULL,'Login successful','::1','2026-10-29 03:34:59.756'),
(27,1,'SETTINGS','settings',NULL,'Updated site settings (15 fields)','::1','2026-10-29 03:39:11.508'),
(28,1,'DELETE','brands','2','Deleted brand \"LINK\"','::1','2026-10-29 03:59:11.905'),
(29,1,'DELETE','brands','1','Deleted brand \"RUNNING\"','::1','2026-10-29 03:59:16.554'),
(30,1,'UPLOAD','media','16','Uploaded image_2026-10-28_22-06-36.png (image/png, 9759 B)','::1','2026-10-29 04:00:03.596'),
(31,1,'CREATE','brands','3','Created brand \"BINDER\"','::1','2026-10-29 04:00:13.748'),
(32,1,'UPLOAD','media','17','Uploaded image_2026-10-28_22-06-45.png (image/png, 12593 B)','::1','2026-10-29 04:00:36.307'),
(33,1,'CREATE','brands','4','Created brand \"Brookfield\"','::1','2026-10-29 04:00:47.304'),
(34,1,'UPDATE','brands','4','Updated brand \"Brookfield\" (fields: displayOrder)','::1','2026-10-29 04:00:54.480'),
(35,1,'UPLOAD','media','18','Uploaded image_2026-10-28_22-06-56.png (image/png, 15476 B)','::1','2026-10-29 04:01:14.567'),
(36,1,'CREATE','brands','5','Created brand \"BUCHI\"','::1','2026-10-29 04:01:27.147'),
(37,1,'UPLOAD','media','19','Uploaded image_2026-10-28_22-07-03.png (image/png, 9400 B)','::1','2026-10-29 04:01:46.943'),
(38,1,'CREATE','brands','6','Created brand \"GERHARDT\"','::1','2026-10-29 04:01:51.817'),
(39,1,'UPLOAD','media','20','Uploaded image_2026-10-28_22-07-11.png (image/png, 7382 B)','::1','2026-10-29 04:02:08.838'),
(40,1,'CREATE','brands','7','Created brand \"EYELA\"','::1','2026-10-29 04:02:15.960'),
(41,1,'UPDATE','brands','7','Updated brand \"EYELA\" (fields: displayOrder)','::1','2026-10-29 04:02:26.485'),
(42,1,'UPDATE','brands','6','Updated brand \"GERHARDT\" (fields: displayOrder)','::1','2026-10-29 04:02:36.033'),
(43,1,'UPDATE','brands','7','Updated brand \"EYELA\" (fields: displayOrder)','::1','2026-10-29 04:02:43.898'),
(44,1,'SETTINGS','settings',NULL,'Updated site settings (15 fields)','::1','2026-10-29 04:05:40.115'),
(45,1,'CREATE','product-types','1','Created product type \"Type 1\"','::1','2026-10-29 04:08:40.784'),
(46,1,'UPLOAD','media','21','Uploaded image_2026-10-28_22-11-58.png (image/png, 36698 B)','::1','2026-10-29 04:09:34.546'),
(47,1,'UPLOAD','media','22','Uploaded Company Profile Hiryu 2025.pdf (application/pdf, 1110967 B)','::1','2026-10-29 04:09:53.504'),
(48,1,'CREATE','products','1','Created product \"Produk1\"','::1','2026-10-29 04:10:05.600'),
(49,1,'CREATE','product-types','2','Created product type \"Type 2\"','::1','2026-10-29 04:12:51.752'),
(50,1,'UPDATE','products','1','Updated product \"Produk1\" (fields: description)','::1','2026-10-29 04:13:08.584'),
(51,1,'UPLOAD','media','23','Uploaded screen.png (image/png, 528033 B)','::1','2026-10-29 04:13:46.177'),
(52,1,'CREATE','products','2','Created product \"Produk2\"','::1','2026-10-29 04:13:53.708'),
(53,1,'UPLOAD','media','24','Uploaded Lima Bundel Kain di Meja Kerja.png (image/png, 2699298 B)','::1','2026-10-29 04:14:34.468'),
(54,1,'CREATE','products','3','Created product \"Type2\"','::1','2026-10-29 04:14:46.766'),
(55,1,'UPLOAD','media','25','Uploaded Lima Adaptor Fiber dalam Kemasan.png (image/png, 2253874 B)','::1','2026-10-29 04:15:23.777'),
(56,1,'CREATE','products','4','Created product \"Produk22\"','::1','2026-10-29 04:15:31.858'),
(57,1,'UPDATE','product-types','1','Updated product type \"Type 1\" (fields: description)','::1','2026-10-29 04:16:12.549'),
(58,1,'UPLOAD','media','26','Uploaded ChatGPT Image 19 Sep 2026_ 13.21.28.png (image/png, 2168669 B)','::1','2026-10-29 04:33:14.863'),
(59,1,'CREATE','blogs','1','Created article \"BLOG 1\"','::1','2026-10-29 04:33:25.176'),
(60,1,'UPDATE','blogs','1','Updated article \"BLOG 1\" (fields: content, status)','::1','2026-10-29 04:34:20.132');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(220) NOT NULL,
  `slug` varchar(250) NOT NULL,
  `content` longtext NOT NULL,
  `excerpt` varchar(400) DEFAULT NULL,
  `featuredImageId` int(11) DEFAULT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  `metaTitle` varchar(160) DEFAULT NULL,
  `metaDescription` varchar(320) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `contentId` longtext DEFAULT NULL,
  `excerptId` varchar(400) DEFAULT NULL,
  `metaDescriptionId` varchar(320) DEFAULT NULL,
  `metaTitleId` varchar(160) DEFAULT NULL,
  `titleId` varchar(220) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blogs_slug_key` (`slug`),
  KEY `blogs_status_publishedAt_idx` (`status`,`publishedAt`),
  KEY `blogs_title_idx` (`title`),
  KEY `blogs_featuredImageId_idx` (`featuredImageId`),
  CONSTRAINT `blogs_featuredImageId_fkey` FOREIGN KEY (`featuredImageId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES
(1,'BLOG 1','blog1','Kesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.\r\n\r\nKesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.\r\n\r\nKesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.\r\n\r\nKesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.\r\n\r\nKesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.\r\n\r\nKesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.','Kesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.',26,'2026-10-29 00:00:00.000','PUBLISHED',NULL,NULL,'2026-10-29 04:33:25.154','2026-10-29 04:34:20.110',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `logoId` int(11) DEFAULT NULL,
  `websiteUrl` varchar(255) DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `brands_isActive_displayOrder_idx` (`isActive`,`displayOrder`),
  KEY `brands_logoId_idx` (`logoId`),
  CONSTRAINT `brands_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES
(3,'BINDER',16,NULL,0,1,'2026-10-29 04:00:13.734','2026-10-29 04:00:13.734'),
(4,'Brookfield',17,NULL,1,1,'2026-10-29 04:00:47.293','2026-10-29 04:00:54.474'),
(5,'BUCHI',18,NULL,3,1,'2026-10-29 04:01:27.136','2026-10-29 04:01:27.136'),
(6,'GERHARDT',19,NULL,2,1,'2026-10-29 04:01:51.806','2026-10-29 04:02:36.021'),
(7,'EYELA',20,NULL,4,1,'2026-10-29 04:02:15.955','2026-10-29 04:02:43.886');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `logoId` int(11) DEFAULT NULL,
  `websiteUrl` varchar(255) DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clients_isActive_displayOrder_idx` (`isActive`,`displayOrder`),
  KEY `clients_logoId_idx` (`logoId`),
  CONSTRAINT `clients_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `message` text NOT NULL,
  `status` enum('UNREAD','READ','REPLIED') NOT NULL DEFAULT 'UNREAD',
  `ipHash` varchar(64) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `company` varchar(160) DEFAULT NULL,
  `emailStatus` varchar(20) NOT NULL DEFAULT 'NOT_CONFIGURED',
  `subject` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_messages_status_createdAt_idx` (`status`,`createdAt`),
  KEY `contact_messages_email_idx` (`email`),
  KEY `contact_messages_name_idx` (`name`),
  KEY `contact_messages_ipHash_createdAt_idx` (`ipHash`,`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES
(1,'Andre','tes@gmail.com','COBA DULU GANN DEGANN','READ','eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3','2026-10-28 13:07:04.053','5758','NOT_CONFIGURED','COBA'),
(2,'Andrean Atma','andre@gmail.com','COBA DULU GAN DEGANNN','READ','eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3','2026-10-29 00:22:47.609','5758','NOT_CONFIGURED','COBA'),
(3,'Andrean','an@gmail.com','coba dulu gan degann','READ','eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3','2026-10-29 00:27:44.449','5758','NOT_CONFIGURED','coba'),
(4,'Andrean Atma','and@gmail.com','show route forwarding-table family ethernet-switching','READ','eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3','2026-10-29 00:37:05.234','5758','FAILED','COBA'),
(5,'Andrean Atma','andreana@gmail.com','Email notification\r\nNot configured (message is saved here)','READ','eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3','2026-10-29 00:41:11.458','5758','FAILED','www');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(160) NOT NULL,
  `description` text DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `gallery_title_idx` (`title`),
  KEY `gallery_imageId_idx` (`imageId`),
  KEY `gallery_isActive_displayOrder_createdAt_idx` (`isActive`,`displayOrder`,`createdAt`),
  CONSTRAINT `gallery_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` VALUES
(1,'image_2026-09-28_14-11-40 _4_ - Copy',NULL,5,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(2,'image_2026-09-28_14-11-40 _4_',NULL,6,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(3,'image_2026-09-28_14-11-40 _3_ - Copy',NULL,7,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(4,'image_2026-09-28_14-11-40 _3_',NULL,8,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(5,'image_2026-09-28_14-11-40 _2_ - Copy',NULL,9,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(6,'image_2026-09-28_14-11-40 - Copy',NULL,10,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(7,'image_2026-09-28_14-08-17 _3_ - Copy',NULL,11,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(8,'image_2026-09-28_14-08-17 _3_',NULL,12,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(9,'image_2026-09-28_14-08-17 _4_ - Copy',NULL,13,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(10,'image_2026-09-28_14-08-17 _4_',NULL,14,'2026-10-28 14:51:00.965','2026-10-28 14:51:00.965',0,1),
(11,'COBA','COBA',15,'2026-10-28 14:51:57.970','2026-10-28 14:51:57.970',0,1);
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_files`
--

DROP TABLE IF EXISTS `media_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `storageKey` varchar(255) NOT NULL,
  `originalName` varchar(255) NOT NULL,
  `mimeType` varchar(100) NOT NULL,
  `sizeBytes` int(11) NOT NULL,
  `isPublic` tinyint(1) NOT NULL DEFAULT 1,
  `uploadedById` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_files_storageKey_key` (`storageKey`),
  KEY `media_files_mimeType_idx` (`mimeType`),
  KEY `media_files_createdAt_idx` (`createdAt`),
  KEY `media_files_uploadedById_fkey` (`uploadedById`),
  CONSTRAINT `media_files_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_files`
--

LOCK TABLES `media_files` WRITE;
/*!40000 ALTER TABLE `media_files` DISABLE KEYS */;
INSERT INTO `media_files` VALUES
(2,'2026/10/7d24e30d-3829-405f-ad1b-73ca28829ae7.png','image_2026-10-15_15-16-30 _2_.png','image/png',81345,1,1,'2026-10-28 13:53:00.070'),
(5,'2026/10/179428cc-0ebb-4e4e-890f-4ece5c621344.png','image_2026-09-28_14-11-40 _4_ - Copy.png','image/png',87171,1,1,'2026-10-28 14:51:00.184'),
(6,'2026/10/e4b5c34e-d8fb-424a-abf8-430a505789c3.png','image_2026-09-28_14-11-40 _4_.png','image/png',87171,1,1,'2026-10-28 14:51:00.268'),
(7,'2026/10/db7d277f-030a-4218-bb77-4fdb6696bb4a.png','image_2026-09-28_14-11-40 _3_ - Copy.png','image/png',87530,1,1,'2026-10-28 14:51:00.340'),
(8,'2026/10/7e210e16-41a5-4b41-a533-4dff13a9ea23.png','image_2026-09-28_14-11-40 _3_.png','image/png',87530,1,1,'2026-10-28 14:51:00.425'),
(9,'2026/10/e870d40b-f749-4a57-91b2-0e4f5dc9dda9.png','image_2026-09-28_14-11-40 _2_ - Copy.png','image/png',87369,1,1,'2026-10-28 14:51:00.512'),
(10,'2026/10/da38cf19-3c7c-427a-aaac-01dfc369bf67.png','image_2026-09-28_14-11-40 - Copy.png','image/png',87399,1,1,'2026-10-28 14:51:00.581'),
(11,'2026/10/01d844bc-822b-4534-957a-549b5e362827.png','image_2026-09-28_14-08-17 _3_ - Copy.png','image/png',50476,1,1,'2026-10-28 14:51:00.648'),
(12,'2026/10/92cda979-c92e-4d49-995f-5b3f82a1576a.png','image_2026-09-28_14-08-17 _3_.png','image/png',50476,1,1,'2026-10-28 14:51:00.712'),
(13,'2026/10/a45ee188-844c-4f4f-944f-02e01e0a4363.png','image_2026-09-28_14-08-17 _4_ - Copy.png','image/png',75408,1,1,'2026-10-28 14:51:00.793'),
(14,'2026/10/75af6de3-1047-434b-bed6-a16a0eedc475.png','image_2026-09-28_14-08-17 _4_.png','image/png',75408,1,1,'2026-10-28 14:51:00.879'),
(15,'2026/10/8cba7f04-5606-45ce-aa16-ea075dd5bff6.jpg','PelatihanAc.jpg','image/jpeg',951384,1,1,'2026-10-28 14:51:55.988'),
(16,'2026/10/59fd43cf-d429-44f1-9188-bbaa90c9b1b8.png','image_2026-10-28_22-06-36.png','image/png',9759,1,1,'2026-10-29 04:00:03.587'),
(17,'2026/10/f162cfe9-578e-4e7a-9616-1d00be24bfc5.png','image_2026-10-28_22-06-45.png','image/png',12593,1,1,'2026-10-29 04:00:36.298'),
(18,'2026/10/974559e0-3c8f-4fd1-8ebd-e3c0cb6c13f3.png','image_2026-10-28_22-06-56.png','image/png',15476,1,1,'2026-10-29 04:01:14.544'),
(19,'2026/10/cb5e93de-8f7b-4ed9-b885-649667b68b03.png','image_2026-10-28_22-07-03.png','image/png',9400,1,1,'2026-10-29 04:01:46.931'),
(20,'2026/10/ee397005-2df0-4671-a3b0-9e742080eb83.png','image_2026-10-28_22-07-11.png','image/png',7382,1,1,'2026-10-29 04:02:08.832'),
(21,'2026/10/493d2db6-888a-4ff7-834c-afaf210e2ad8.png','image_2026-10-28_22-11-58.png','image/png',36698,1,1,'2026-10-29 04:09:34.534'),
(22,'2026/10/9bfbe4c1-4a94-4124-960e-d5872aa0c7d9.pdf','Company Profile Hiryu 2025.pdf','application/pdf',1110967,1,1,'2026-10-29 04:09:53.487'),
(23,'2026/10/c08ab691-aa4a-463d-b0c2-50ff96f91c8a.png','screen.png','image/png',528033,1,1,'2026-10-29 04:13:46.164'),
(24,'2026/10/16c8b75e-3584-42f8-872b-3526b4af8542.png','Lima Bundel Kain di Meja Kerja.png','image/png',2699298,1,1,'2026-10-29 04:14:34.462'),
(25,'2026/10/46238f08-b01c-4016-9d1d-1b2899a068d6.png','Lima Adaptor Fiber dalam Kemasan.png','image/png',2253874,1,1,'2026-10-29 04:15:23.767'),
(26,'2026/10/eaeb475a-2b1c-47f1-801b-2f9d1d281b20.png','ChatGPT Image 19 Sep 2026_ 13.21.28.png','image/png',2168669,1,1,'2026-10-29 04:33:14.854');
/*!40000 ALTER TABLE `media_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio`
--

DROP TABLE IF EXISTS `portfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `slug` varchar(190) NOT NULL,
  `description` text NOT NULL,
  `imageId` int(11) DEFAULT NULL,
  `projectDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `clientName` varchar(160) DEFAULT NULL,
  `descriptionId` text DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `metaDescription` varchar(320) DEFAULT NULL,
  `metaDescriptionId` varchar(320) DEFAULT NULL,
  `metaTitle` varchar(160) DEFAULT NULL,
  `metaTitleId` varchar(160) DEFAULT NULL,
  `nameId` varchar(160) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `portfolio_slug_key` (`slug`),
  KEY `portfolio_name_idx` (`name`),
  KEY `portfolio_projectDate_idx` (`projectDate`),
  KEY `portfolio_imageId_idx` (`imageId`),
  KEY `portfolio_isActive_isFeatured_displayOrder_idx` (`isActive`,`isFeatured`,`displayOrder`),
  CONSTRAINT `portfolio_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio`
--

LOCK TABLES `portfolio` WRITE;
/*!40000 ALTER TABLE `portfolio` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_images`
--

DROP TABLE IF EXISTS `portfolio_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `portfolioId` int(11) NOT NULL,
  `mediaId` int(11) NOT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `portfolio_images_portfolioId_displayOrder_idx` (`portfolioId`,`displayOrder`),
  KEY `portfolio_images_mediaId_idx` (`mediaId`),
  CONSTRAINT `portfolio_images_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_files` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `portfolio_images_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `portfolio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_images`
--

LOCK TABLES `portfolio_images` WRITE;
/*!40000 ALTER TABLE `portfolio_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_types`
--

DROP TABLE IF EXISTS `product_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `slug` varchar(190) NOT NULL,
  `description` text DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `nameId` varchar(160) DEFAULT NULL,
  `descriptionId` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_types_slug_key` (`slug`),
  KEY `product_types_name_idx` (`name`),
  KEY `product_types_isActive_displayOrder_idx` (`isActive`,`displayOrder`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_types`
--

LOCK TABLES `product_types` WRITE;
/*!40000 ALTER TABLE `product_types` DISABLE KEYS */;
INSERT INTO `product_types` VALUES
(1,'Type 1','type-1','Kesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.',0,1,'2026-10-29 04:08:40.771','2026-10-29 04:16:12.539',NULL,NULL),
(2,'Type 2','type2','Kesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.',1,1,'2026-10-29 04:12:51.739','2026-10-29 04:12:51.739',NULL,NULL);
/*!40000 ALTER TABLE `product_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `slug` varchar(190) NOT NULL,
  `description` text NOT NULL,
  `specifications` text DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `pdfId` int(11) DEFAULT NULL,
  `metaTitle` varchar(160) DEFAULT NULL,
  `metaDescription` varchar(320) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `brand` varchar(160) DEFAULT NULL,
  `descriptionId` text DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `metaDescriptionId` varchar(320) DEFAULT NULL,
  `metaTitleId` varchar(160) DEFAULT NULL,
  `model` varchar(160) DEFAULT NULL,
  `nameId` varchar(160) DEFAULT NULL,
  `productOrigin` varchar(160) DEFAULT NULL,
  `productOriginId` varchar(160) DEFAULT NULL,
  `productTypeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_key` (`slug`),
  KEY `products_name_idx` (`name`),
  KEY `products_imageId_idx` (`imageId`),
  KEY `products_pdfId_idx` (`pdfId`),
  KEY `products_productTypeId_isActive_displayOrder_idx` (`productTypeId`,`isActive`,`displayOrder`),
  KEY `products_isFeatured_isActive_idx` (`isFeatured`,`isActive`),
  CONSTRAINT `products_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `products_pdfId_fkey` FOREIGN KEY (`pdfId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `products_productTypeId_fkey` FOREIGN KEY (`productTypeId`) REFERENCES `product_types` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES
(1,'Produk1','produk1','Kesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.',NULL,21,22,NULL,NULL,'2026-10-29 04:10:05.592','2026-10-29 04:13:08.562','Produk1',NULL,0,1,1,NULL,NULL,'Produk1',NULL,'Produk1',NULL,1),
(2,'Produk2','produk2','Kesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.',NULL,23,NULL,NULL,NULL,'2026-10-29 04:13:53.691','2026-10-29 04:13:53.691','Produk2',NULL,1,1,1,NULL,NULL,'Produk2',NULL,'Produk2',NULL,2),
(3,'Type2','type2','Kesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.',NULL,24,NULL,NULL,NULL,'2026-10-29 04:14:46.744','2026-10-29 04:14:46.744','Type2',NULL,1,1,1,NULL,NULL,'Type2',NULL,'Type2',NULL,1),
(4,'Produk22','produk2-2','Kesalahan pleonasme/kata ganda: Surabaya adalah merupakan kota pahlawan diperbaiki menjadi Surabaya merupakan kota pahlawan (menghindari kata mubazir); Para siswa-siswa sedang mengerjakan ujian diperbaiki menjadi Para siswa sedang mengerjakan ujian; Taman bermain itu sangat ramai sekali menjadi Taman bermain itu sangat ramai.',NULL,25,NULL,NULL,NULL,'2026-10-29 04:15:31.849','2026-10-29 04:15:31.849','Produk2',NULL,1,1,1,NULL,NULL,'Produk2',NULL,'Produk2',NULL,2);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seo_settings`
--

DROP TABLE IF EXISTS `seo_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seo_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageKey` varchar(60) NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `description` varchar(320) DEFAULT NULL,
  `ogImageId` int(11) DEFAULT NULL,
  `noindex` tinyint(1) NOT NULL DEFAULT 0,
  `updatedAt` datetime(3) NOT NULL,
  `titleId` varchar(160) DEFAULT NULL,
  `descriptionId` varchar(320) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seo_settings_pageKey_key` (`pageKey`),
  KEY `seo_settings_ogImageId_idx` (`ogImageId`),
  CONSTRAINT `seo_settings_ogImageId_fkey` FOREIGN KEY (`ogImageId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seo_settings`
--

LOCK TABLES `seo_settings` WRITE;
/*!40000 ALTER TABLE `seo_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `seo_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_images`
--

DROP TABLE IF EXISTS `service_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceId` int(11) NOT NULL,
  `mediaId` int(11) NOT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `service_images_serviceId_displayOrder_idx` (`serviceId`,`displayOrder`),
  KEY `service_images_mediaId_idx` (`mediaId`),
  CONSTRAINT `service_images_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_files` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `service_images_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_images`
--

LOCK TABLES `service_images` WRITE;
/*!40000 ALTER TABLE `service_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `slug` varchar(190) NOT NULL,
  `description` text NOT NULL,
  `imageId` int(11) DEFAULT NULL,
  `metaTitle` varchar(160) DEFAULT NULL,
  `metaDescription` varchar(320) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `descriptionId` text DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `metaDescriptionId` varchar(320) DEFAULT NULL,
  `metaTitleId` varchar(160) DEFAULT NULL,
  `nameId` varchar(160) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_slug_key` (`slug`),
  KEY `services_name_idx` (`name`),
  KEY `services_imageId_idx` (`imageId`),
  KEY `services_isActive_displayOrder_idx` (`isActive`,`displayOrder`),
  CONSTRAINT `services_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
(1,'Service Maintenance','service-maintenance','Repair, troubleshooting, and maintenance of laboratory, testing, and industrial equipment.',NULL,NULL,NULL,'2026-10-28 13:37:46.727','2026-10-28 13:37:46.727',NULL,0,1,1,NULL,NULL,NULL),
(2,'Calibration','calibration','Calibration of measuring and testing equipment within our available scope.',NULL,NULL,NULL,'2026-10-28 13:37:46.731','2026-10-28 13:37:46.731',NULL,1,1,1,NULL,NULL,NULL),
(3,'Equipment Supply','equipment-supply','Supply of testing equipment, laboratory equipment, and industrial equipment.',NULL,NULL,NULL,'2026-10-28 13:37:46.734','2026-10-28 13:37:46.734',NULL,2,1,1,NULL,NULL,NULL);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(191) NOT NULL,
  `tokenHash` varchar(64) NOT NULL,
  `userId` int(11) NOT NULL,
  `ipAddress` varchar(64) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `lastActivityAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `expiresAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_tokenHash_key` (`tokenHash`),
  KEY `sessions_userId_idx` (`userId`),
  KEY `sessions_expiresAt_idx` (`expiresAt`),
  CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES
('cmvszpo560001m0c8396zmahd','ece66f8e64b85f144787c1bc724be8eced104055e41a227ce2cde8092c13d7c9',1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-10-29 03:34:59.702','2026-10-29 04:36:31.153','2026-10-29 15:34:59.696');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `key` varchar(80) NOT NULL,
  `value` text NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES
('address','Batursari Raya, Kayon\r\nDemak, Jawa Tengah. 59567','2026-10-29 04:05:40.085'),
('company_name','PT Hiryu Techno Indonesia','2026-10-29 04:05:40.085'),
('email','simisimi0147@gmail.com','2026-10-29 04:05:40.085'),
('footer_description','Service, repair, and maintenance of laboratory equipment, plus calibration and equipment supply.','2026-10-29 04:05:40.085'),
('footer_description_id','Servis, perbaikan, dan perawatan peralatan laboratorium, serta kalibrasi dan suplai peralatan.','2026-10-29 04:05:40.085'),
('hero_subtitle','We support equipment sourcing, technical services, and calibration requirements within our available scope.','2026-10-29 04:05:40.085'),
('hero_subtitle_id','Kami mendukung pengadaan peralatan, layanan teknis, dan kebutuhan kalibrasi sesuai ruang lingkup yang kami miliki.','2026-10-29 04:05:40.085'),
('hero_title','Precision Instruments. Reliable Solutions.','2026-10-29 04:05:40.085'),
('hero_title_id','Instrumen Presisi. Solusi Andal.','2026-10-29 04:05:40.085'),
('maps_embed_url','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.788856674221!2d110.49980147587723!3d-7.034085268918076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708dec822799df%3A0x4d503133f3247598!2sJl.%20Batursari%20Raya%2C%20Kec.%20Mranggen%2C%20Kabupaten%20Demak%2C%20Jawa%20Tengah%2059567!5e0!3m2!1sid!2sid!4v1793245037570!5m2!1sid!2sid','2026-10-29 04:05:40.085'),
('office_hours','','2026-10-29 04:05:40.085'),
('office_hours_id','','2026-10-29 04:05:40.085'),
('tagline','Supplier, Service & Calibration for Laboratory and Testing Equipment.','2026-10-29 04:05:40.085'),
('tagline_id','Supplier, Servis & Kalibrasi untuk Peralatan Laboratorium dan Pengujian.','2026-10-29 04:05:40.085'),
('whatsapp','6282221101122','2026-10-29 04:05:40.085');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slug_redirects`
--

DROP TABLE IF EXISTS `slug_redirects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `slug_redirects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity` varchar(30) NOT NULL,
  `oldSlug` varchar(250) NOT NULL,
  `newSlug` varchar(250) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_redirects_entity_oldSlug_key` (`entity`,`oldSlug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slug_redirects`
--

LOCK TABLES `slug_redirects` WRITE;
/*!40000 ALTER TABLE `slug_redirects` DISABLE KEYS */;
/*!40000 ALTER TABLE `slug_redirects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `position` varchar(160) NOT NULL,
  `photoId` int(11) DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `positionId` varchar(160) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `team_members_displayOrder_idx` (`displayOrder`),
  KEY `team_members_photoId_idx` (`photoId`),
  KEY `team_members_isActive_displayOrder_idx` (`isActive`,`displayOrder`),
  CONSTRAINT `team_members_photoId_fkey` FOREIGN KEY (`photoId`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `passwordHash` varchar(100) NOT NULL,
  `role` enum('SUPER_ADMIN','ADMIN') NOT NULL DEFAULT 'ADMIN',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `lastLoginAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  KEY `users_role_isActive_idx` (`role`,`isActive`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'testing','testing@gmail.com','$2a$12$wnuIZqSKMtplAasnujsz9.EUtCmQxDdx6NM2OVPhoJe1kwp3iyR.G','SUPER_ADMIN',1,'2026-10-29 03:34:59.737','2026-10-28 13:04:03.198','2026-10-29 03:34:59.740');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-29 13:19:52
