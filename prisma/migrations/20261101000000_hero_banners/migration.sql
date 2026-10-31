-- Hero banner: ADITIF (hanya CREATE TABLE, tidak ada DROP / ALTER pada tabel lama).

-- CreateTable
CREATE TABLE `page_heroes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageKey` VARCHAR(40) NOT NULL,
    `title` VARCHAR(200) NULL,
    `description` VARCHAR(600) NULL,
    `imageId` INTEGER NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `page_heroes_pageKey_key`(`pageKey`),
    INDEX `page_heroes_imageId_idx`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `home_hero_slides` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageId` INTEGER NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `home_hero_slides_displayOrder_idx`(`displayOrder`),
    INDEX `home_hero_slides_imageId_idx`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `page_heroes` ADD CONSTRAINT `page_heroes_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `home_hero_slides` ADD CONSTRAINT `home_hero_slides_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `media_files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
