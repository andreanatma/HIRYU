-- Remove Indonesian (bilingual) columns. DESTRUCTIVE: back up the database first.

ALTER TABLE `services`
  DROP COLUMN `nameId`,
  DROP COLUMN `descriptionId`,
  DROP COLUMN `metaTitleId`,
  DROP COLUMN `metaDescriptionId`;

ALTER TABLE `product_types`
  DROP COLUMN `nameId`,
  DROP COLUMN `descriptionId`;

ALTER TABLE `products`
  DROP COLUMN `nameId`,
  DROP COLUMN `productOriginId`,
  DROP COLUMN `descriptionId`,
  DROP COLUMN `metaTitleId`,
  DROP COLUMN `metaDescriptionId`;

ALTER TABLE `portfolio`
  DROP COLUMN `nameId`,
  DROP COLUMN `descriptionId`,
  DROP COLUMN `metaTitleId`,
  DROP COLUMN `metaDescriptionId`;

ALTER TABLE `blogs`
  DROP COLUMN `titleId`,
  DROP COLUMN `contentId`,
  DROP COLUMN `excerptId`,
  DROP COLUMN `metaTitleId`,
  DROP COLUMN `metaDescriptionId`;

ALTER TABLE `about_sections`
  DROP COLUMN `headingId`,
  DROP COLUMN `bodyId`;

ALTER TABLE `team_members`
  DROP COLUMN `positionId`;

ALTER TABLE `seo_settings`
  DROP COLUMN `titleId`,
  DROP COLUMN `descriptionId`;