-- AlterTable
ALTER TABLE `blogs` ADD COLUMN `contentId` LONGTEXT NULL,
    ADD COLUMN `excerptId` VARCHAR(400) NULL,
    ADD COLUMN `metaDescriptionId` VARCHAR(320) NULL,
    ADD COLUMN `metaTitleId` VARCHAR(160) NULL,
    ADD COLUMN `titleId` VARCHAR(220) NULL;

-- AlterTable
ALTER TABLE `contact_messages` ADD COLUMN `company` VARCHAR(160) NULL,
    ADD COLUMN `emailStatus` VARCHAR(20) NOT NULL DEFAULT 'NOT_CONFIGURED',
    ADD COLUMN `subject` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `gallery` ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `portfolio` ADD COLUMN `clientName` VARCHAR(160) NULL,
    ADD COLUMN `descriptionId` TEXT NULL,
    ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `metaDescription` VARCHAR(320) NULL,
    ADD COLUMN `metaDescriptionId` VARCHAR(320) NULL,
    ADD COLUMN `metaTitle` VARCHAR(160) NULL,
    ADD COLUMN `metaTitleId` VARCHAR(160) NULL,
    ADD COLUMN `nameId` VARCHAR(160) NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `brand` VARCHAR(160) NULL,
    ADD COLUMN `descriptionId` TEXT NULL,
    ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `metaDescriptionId` VARCHAR(320) NULL,
    ADD COLUMN `metaTitleId` VARCHAR(160) NULL,
    ADD COLUMN `model` VARCHAR(160) NULL,
    ADD COLUMN `nameId` VARCHAR(160) NULL,
    ADD COLUMN `productOrigin` VARCHAR(160) NULL,
    ADD COLUMN `productOriginId` VARCHAR(160) NULL,
    ADD COLUMN `productTypeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `services` ADD COLUMN `descriptionId` TEXT NULL,
    ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `metaDescriptionId` VARCHAR(320) NULL,
    ADD COLUMN `metaTitleId` VARCHAR(160) NULL,
    ADD COLUMN `nameId` VARCHAR(160) NULL;

-- AlterTable
ALTER TABLE `team_members` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `positionId` VARCHAR(160) NULL;

-- CreateTable
CREATE TABLE `product_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(190) NOT NULL,
    `description` TEXT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `nameId` VARCHAR(160) NULL,
    `descriptionId` TEXT NULL,

    UNIQUE INDEX `product_types_slug_key`(`slug`),
    INDEX `product_types_name_idx`(`name`),
    INDEX `product_types_isActive_displayOrder_idx`(`isActive`, `displayOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceId` INTEGER NOT NULL,
    `mediaId` INTEGER NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `service_images_serviceId_displayOrder_idx`(`serviceId`, `displayOrder`),
    INDEX `service_images_mediaId_idx`(`mediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `portfolioId` INTEGER NOT NULL,
    `mediaId` INTEGER NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `portfolio_images_portfolioId_displayOrder_idx`(`portfolioId`, `displayOrder`),
    INDEX `portfolio_images_mediaId_idx`(`mediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(160) NOT NULL,
    `logoId` INTEGER NULL,
    `websiteUrl` VARCHAR(255) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `brands_isActive_displayOrder_idx`(`isActive`, `displayOrder`),
    INDEX `brands_logoId_idx`(`logoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(160) NOT NULL,
    `logoId` INTEGER NULL,
    `websiteUrl` VARCHAR(255) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `clients_isActive_displayOrder_idx`(`isActive`, `displayOrder`),
    INDEX `clients_logoId_idx`(`logoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `about_sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heading` VARCHAR(200) NOT NULL,
    `body` TEXT NOT NULL,
    `imageId` INTEGER NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `headingId` VARCHAR(200) NULL,
    `bodyId` TEXT NULL,

    INDEX `about_sections_isActive_displayOrder_idx`(`isActive`, `displayOrder`),
    INDEX `about_sections_imageId_idx`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `slug_redirects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entity` VARCHAR(30) NOT NULL,
    `oldSlug` VARCHAR(250) NOT NULL,
    `newSlug` VARCHAR(250) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `slug_redirects_entity_oldSlug_key`(`entity`, `oldSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `gallery_isActive_displayOrder_createdAt_idx` ON `gallery`(`isActive`, `displayOrder`, `createdAt`);

-- CreateIndex
CREATE INDEX `portfolio_isActive_isFeatured_displayOrder_idx` ON `portfolio`(`isActive`, `isFeatured`, `displayOrder`);

-- CreateIndex
CREATE INDEX `products_productTypeId_isActive_displayOrder_idx` ON `products`(`productTypeId`, `isActive`, `displayOrder`);

-- CreateIndex
CREATE INDEX `products_isFeatured_isActive_idx` ON `products`(`isFeatured`, `isActive`);

-- CreateIndex
CREATE INDEX `services_isActive_displayOrder_idx` ON `services`(`isActive`, `displayOrder`);

-- CreateIndex
CREATE INDEX `team_members_isActive_displayOrder_idx` ON `team_members`(`isActive`, `displayOrder`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_productTypeId_fkey` FOREIGN KEY (`productTypeId`) REFERENCES `product_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_images` ADD CONSTRAINT `service_images_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_images` ADD CONSTRAINT `service_images_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolio_images` ADD CONSTRAINT `portfolio_images_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `portfolio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolio_images` ADD CONSTRAINT `portfolio_images_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brands` ADD CONSTRAINT `brands_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `about_sections` ADD CONSTRAINT `about_sections_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
