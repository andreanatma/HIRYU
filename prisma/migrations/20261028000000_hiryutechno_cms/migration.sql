-- -- Hiryutechno CMS: ADDITIVE migration. Tidak ada DROP TABLE / DROP COLUMN; data lama dipertahankan.
-- -- Kolom baru memakai DEFAULT agar baris lama tetap valid. Verifikasi dengan `npx prisma migrate dev` / `prisma migrate diff`.

-- -- CreateTable
-- CREATE TABLE `product_types` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `name` VARCHAR(160) NOT NULL,
--     `slug` VARCHAR(190) NOT NULL,
--     `description` TEXT NULL,
--     `displayOrder` INTEGER NOT NULL DEFAULT 0,
--     `isActive` BOOLEAN NOT NULL DEFAULT true,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `updatedAt` DATETIME(3) NOT NULL,

--     UNIQUE INDEX `product_types_slug_key`(`slug`),
--     INDEX `product_types_isActive_displayOrder_idx`(`isActive`, `displayOrder`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- AlterTable services
-- ALTER TABLE `services`
--     ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
--     ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
--     ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
-- CREATE INDEX `services_isActive_displayOrder_idx` ON `services`(`isActive`, `displayOrder`);

-- -- AlterTable products
-- ALTER TABLE `products`
--     ADD COLUMN `productTypeId` INTEGER NULL,
--     ADD COLUMN `brand` VARCHAR(160) NULL,
--     ADD COLUMN `productOrigin` VARCHAR(160) NULL,
--     ADD COLUMN `model` VARCHAR(160) NULL,
--     ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
--     ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
--     ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
-- CREATE INDEX `products_productTypeId_isActive_displayOrder_idx` ON `products`(`productTypeId`, `isActive`, `displayOrder`);
-- CREATE INDEX `products_isFeatured_isActive_idx` ON `products`(`isFeatured`, `isActive`);

-- -- AlterTable portfolio
-- ALTER TABLE `portfolio`
--     ADD COLUMN `clientName` VARCHAR(160) NULL,
--     ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
--     ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
--     ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
--     ADD COLUMN `metaTitle` VARCHAR(160) NULL,
--     ADD COLUMN `metaDescription` VARCHAR(320) NULL;
-- CREATE INDEX `portfolio_isActive_isFeatured_displayOrder_idx` ON `portfolio`(`isActive`, `isFeatured`, `displayOrder`);

-- -- AlterTable gallery
-- ALTER TABLE `gallery`
--     ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
--     ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
-- CREATE INDEX `gallery_isActive_displayOrder_createdAt_idx` ON `gallery`(`isActive`, `displayOrder`, `createdAt`);

-- -- AlterTable team_members
-- ALTER TABLE `team_members` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
-- CREATE INDEX `team_members_isActive_displayOrder_idx` ON `team_members`(`isActive`, `displayOrder`);

-- -- AlterTable contact_messages
-- ALTER TABLE `contact_messages`
--     ADD COLUMN `company` VARCHAR(160) NULL,
--     ADD COLUMN `subject` VARCHAR(200) NULL,
--     ADD COLUMN `emailStatus` VARCHAR(20) NOT NULL DEFAULT 'NOT_CONFIGURED';

-- -- CreateTable service_images
-- CREATE TABLE `service_images` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `serviceId` INTEGER NOT NULL,
--     `mediaId` INTEGER NOT NULL,
--     `displayOrder` INTEGER NOT NULL DEFAULT 0,

--     INDEX `service_images_serviceId_displayOrder_idx`(`serviceId`, `displayOrder`),
--     INDEX `service_images_mediaId_idx`(`mediaId`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable portfolio_images
-- CREATE TABLE `portfolio_images` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `portfolioId` INTEGER NOT NULL,
--     `mediaId` INTEGER NOT NULL,
--     `displayOrder` INTEGER NOT NULL DEFAULT 0,

--     INDEX `portfolio_images_portfolioId_displayOrder_idx`(`portfolioId`, `displayOrder`),
--     INDEX `portfolio_images_mediaId_idx`(`mediaId`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable brands
-- CREATE TABLE `brands` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `name` VARCHAR(160) NOT NULL,
--     `logoId` INTEGER NULL,
--     `websiteUrl` VARCHAR(255) NULL,
--     `displayOrder` INTEGER NOT NULL DEFAULT 0,
--     `isActive` BOOLEAN NOT NULL DEFAULT true,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `updatedAt` DATETIME(3) NOT NULL,

--     INDEX `brands_isActive_displayOrder_idx`(`isActive`, `displayOrder`),
--     INDEX `brands_logoId_idx`(`logoId`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable clients
-- CREATE TABLE `clients` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `name` VARCHAR(160) NOT NULL,
--     `logoId` INTEGER NULL,
--     `websiteUrl` VARCHAR(255) NULL,
--     `displayOrder` INTEGER NOT NULL DEFAULT 0,
--     `isActive` BOOLEAN NOT NULL DEFAULT true,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `updatedAt` DATETIME(3) NOT NULL,

--     INDEX `clients_isActive_displayOrder_idx`(`isActive`, `displayOrder`),
--     INDEX `clients_logoId_idx`(`logoId`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable about_sections
-- CREATE TABLE `about_sections` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `heading` VARCHAR(200) NOT NULL,
--     `body` TEXT NOT NULL,
--     `imageId` INTEGER NULL,
--     `displayOrder` INTEGER NOT NULL DEFAULT 0,
--     `isActive` BOOLEAN NOT NULL DEFAULT true,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `updatedAt` DATETIME(3) NOT NULL,

--     INDEX `about_sections_isActive_displayOrder_idx`(`isActive`, `displayOrder`),
--     INDEX `about_sections_imageId_idx`(`imageId`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- CreateTable slug_redirects
-- CREATE TABLE `slug_redirects` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `entity` VARCHAR(30) NOT NULL,
--     `oldSlug` VARCHAR(250) NOT NULL,
--     `newSlug` VARCHAR(250) NOT NULL,
--     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

--     UNIQUE INDEX `slug_redirects_entity_oldSlug_key`(`entity`, `oldSlug`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- -- AddForeignKey
-- ALTER TABLE `products` ADD CONSTRAINT `products_productTypeId_fkey` FOREIGN KEY (`productTypeId`) REFERENCES `product_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- ALTER TABLE `service_images` ADD CONSTRAINT `service_images_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `service_images` ADD CONSTRAINT `service_images_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- ALTER TABLE `portfolio_images` ADD CONSTRAINT `portfolio_images_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `portfolio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `portfolio_images` ADD CONSTRAINT `portfolio_images_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- ALTER TABLE `brands` ADD CONSTRAINT `brands_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE `clients` ADD CONSTRAINT `clients_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE `about_sections` ADD CONSTRAINT `about_sections_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE `services`
--   ADD COLUMN `nameId` VARCHAR(160) NULL,
--   ADD COLUMN `descriptionId` TEXT NULL,
--   ADD COLUMN `metaTitleId` VARCHAR(160) NULL,
--   ADD COLUMN `metaDescriptionId` VARCHAR(320) NULL;

-- ALTER TABLE `product_types`
--   ADD COLUMN `nameId` VARCHAR(160) NULL,
--   ADD COLUMN `descriptionId` TEXT NULL;

-- ALTER TABLE `products`
--   ADD COLUMN `nameId` VARCHAR(160) NULL,
--   ADD COLUMN `productOriginId` VARCHAR(160) NULL,
--   ADD COLUMN `descriptionId` TEXT NULL,
--   ADD COLUMN `metaTitleId` VARCHAR(160) NULL,
--   ADD COLUMN `metaDescriptionId` VARCHAR(320) NULL;

-- ALTER TABLE `portfolio`
--   ADD COLUMN `nameId` VARCHAR(160) NULL,
--   ADD COLUMN `descriptionId` TEXT NULL,
--   ADD COLUMN `metaTitleId` VARCHAR(160) NULL,
--   ADD COLUMN `metaDescriptionId` VARCHAR(320) NULL;

-- ALTER TABLE `blogs`
--   ADD COLUMN `titleId` VARCHAR(220) NULL,
--   ADD COLUMN `excerptId` VARCHAR(400) NULL,
--   ADD COLUMN `contentId` LONGTEXT NULL,
--   ADD COLUMN `metaTitleId` VARCHAR(160) NULL,
--   ADD COLUMN `metaDescriptionId` VARCHAR(320) NULL;

-- ALTER TABLE `about_sections`
--   ADD COLUMN `headingId` VARCHAR(200) NULL,
--   ADD COLUMN `bodyId` TEXT NULL;

-- ALTER TABLE `team_members` ADD COLUMN `positionId` VARCHAR(160) NULL;

-- ALTER TABLE `seo_settings`
--   ADD COLUMN `titleId` VARCHAR(160) NULL,
--   ADD COLUMN `descriptionId` VARCHAR(320) NULL;

ALTER TABLE `seo_settings`
  ADD COLUMN `titleId` VARCHAR(160) NULL,
  ADD COLUMN `descriptionId` VARCHAR(320) NULL;