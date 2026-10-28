export type FieldType = "text" | "textarea" | "slug" | "image" | "pdf" | "images" | "date" | "number" | "select" | "longtext" | "boolean" | "relation" | "url";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  max?: number;
  rows?: number;
  options?: { value: string; label: string }[];
  /** For type "relation": which prisma model supplies the <select> options (must have `id` and a label field). */
  relation?: { model: "productType"; labelField: string };
  help?: string;
  placeholder?: string;
  group?: "seo" | "id";
  /** Default for new records (booleans/numbers/selects). */
  def?: string | number | boolean;
};

export type ColumnDef = { key: string; label: string; kind?: "text" | "image" | "date" | "status" | "bool" };

export type ModuleKey = "services" | "product-types" | "products" | "portfolio" | "gallery" | "blogs" | "about-us" | "our-team" | "brands" | "clients";

export type ModelName = "service" | "productType" | "product" | "portfolio" | "gallery" | "blog" | "aboutSection" | "teamMember" | "brand" | "client";

export type ModuleDef = {
  key: ModuleKey;
  model: ModelName;
  label: string;
  singular: string;
  nameField: string;
  slugSource?: string;
  /** Entity name used by slug_redirects; when set, old URLs keep working after a slug edit. */
  slugRedirect?: "product" | "blog" | "service" | "portfolio";
  searchFields: string[];
  orderBy: Record<string, "asc" | "desc">[];
  mediaFields: string[]; // FK columns to media_files
  /** Extra gallery table (multiple images). The form field of type "images" carries comma-separated media IDs. */
  multiImage?: { field: string; model: "serviceImage" | "portfolioImage"; fk: "serviceId" | "portfolioId"; media: "mediaId" };
  /** Block deletion while other rows still reference this one. */
  deleteGuard?: { model: "product"; fk: "productTypeId"; message: string };
  publicPaths: string[];
  columns: ColumnDef[];
  fields: FieldDef[];
  section: "content" | "other";
};

const seo: FieldDef[] = [
  { name: "metaTitle", label: "Meta title", type: "text", max: 160, group: "seo", help: "Leave empty to use the main title." },
  { name: "metaDescription", label: "Meta description", type: "textarea", max: 320, rows: 3, group: "seo" },
];
const seoId: FieldDef[] = [
  { name: "metaTitleId", label: "Meta title (Indonesian)", type: "text", max: 160, group: "seo" },
  { name: "metaDescriptionId", label: "Meta description (Indonesian)", type: "textarea", max: 320, rows: 3, group: "seo" },
];
const idg = (f: Omit<FieldDef, "group">): FieldDef => ({ ...f, group: "id" });
const order: FieldDef = { name: "displayOrder", label: "Display order", type: "number", help: "Lower numbers appear first.", def: 0 };
const active: FieldDef = { name: "isActive", label: "Active (visible on the public website)", type: "boolean", def: true };
const featured: FieldDef = { name: "isFeatured", label: "Featured (shown on the homepage)", type: "boolean", def: false };

export const MODULES: Record<ModuleKey, ModuleDef> = {
  services: {
    key: "services", model: "service", label: "Services", singular: "service", nameField: "name", slugSource: "name", slugRedirect: "service", section: "content",
    searchFields: ["name", "description"], orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], mediaFields: ["imageId"],
    multiImage: { field: "galleryIds", model: "serviceImage", fk: "serviceId", media: "mediaId" },
    publicPaths: ["/", "/service"],
    columns: [{ key: "imageId", label: "Image", kind: "image" }, { key: "name", label: "Name" }, { key: "displayOrder", label: "Order" }, { key: "isFeatured", label: "Featured", kind: "bool" }, { key: "isActive", label: "Active", kind: "bool" }, { key: "updatedAt", label: "Updated", kind: "date" }],
    fields: [
      { name: "name", label: "Service title", type: "text", required: true, max: 160 },
      { name: "slug", label: "Slug", type: "slug", max: 190, help: "Leave empty to generate from the title." },
      { name: "description", label: "Description", type: "textarea", required: true, max: 5000, rows: 6 },
      { name: "imageId", label: "Main image", type: "image" },
      { name: "galleryIds", label: "Additional images", type: "images", help: "Upload several images. Drag order is the order of upload; use the arrows to reorder." },
      order, featured, active, ...seo,
      idg({ name: "nameId", label: "Service title (Indonesian)", type: "text", max: 160 }),
      idg({ name: "descriptionId", label: "Description (Indonesian)", type: "textarea", max: 5000, rows: 6 }),
    ],
  },
  "product-types": {
    key: "product-types", model: "productType", label: "Product Types", singular: "product type", nameField: "name", slugSource: "name", section: "content",
    searchFields: ["name", "description"], orderBy: [{ displayOrder: "asc" }, { name: "asc" }], mediaFields: [],
    deleteGuard: { model: "product", fk: "productTypeId", message: "This product type still has products. Move or delete those products first." },
    publicPaths: ["/", "/products"],
    columns: [{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }, { key: "displayOrder", label: "Order" }, { key: "isActive", label: "Active", kind: "bool" }, { key: "updatedAt", label: "Updated", kind: "date" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 160 },
      { name: "slug", label: "Slug", type: "slug", max: 190 },
      { name: "description", label: "Description", type: "textarea", max: 2000, rows: 4 },
      order, active,
      idg({ name: "nameId", label: "Name (Indonesian)", type: "text", max: 160 }),
      idg({ name: "descriptionId", label: "Description (Indonesian)", type: "textarea", max: 2000, rows: 4 }),
    ],
  },
  products: {
    key: "products", model: "product", label: "Products", singular: "product", nameField: "name", slugSource: "name", slugRedirect: "product", section: "content",
    searchFields: ["name", "brand", "model", "description"], orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], mediaFields: ["imageId", "pdfId"], publicPaths: ["/", "/products"],
    columns: [{ key: "imageId", label: "Image", kind: "image" }, { key: "name", label: "Title" }, { key: "brand", label: "Brand" }, { key: "model", label: "Model" }, { key: "isFeatured", label: "Featured", kind: "bool" }, { key: "isActive", label: "Active", kind: "bool" }],
    fields: [
      { name: "productTypeId", label: "Product type", type: "relation", required: true, relation: { model: "productType", labelField: "name" }, help: "Create a Product Type first if the list is empty." },
      { name: "name", label: "Title", type: "text", required: true, max: 160 },
      { name: "slug", label: "Slug", type: "slug", max: 190, help: "Used in the product URL. Changing it keeps the old URL working via redirect." },
      { name: "brand", label: "Brand", type: "text", max: 160 },
      { name: "productOrigin", label: "Product origin", type: "text", max: 160 },
      { name: "model", label: "Model", type: "text", max: 160 },
      { name: "description", label: "Introduction", type: "textarea", required: true, max: 5000, rows: 6 },
      { name: "imageId", label: "Product image", type: "image", required: true },
      { name: "pdfId", label: "PDF document (datasheet / brochure)", type: "pdf" },
      order, featured, active, ...seo,
      idg({ name: "nameId", label: "Title (Indonesian)", type: "text", max: 160 }),
      idg({ name: "productOriginId", label: "Product origin (Indonesian)", type: "text", max: 160 }),
      idg({ name: "descriptionId", label: "Introduction (Indonesian)", type: "textarea", max: 5000, rows: 6 }),
    ],
  },
  portfolio: {
    key: "portfolio", model: "portfolio", label: "Portfolio", singular: "project", nameField: "name", slugSource: "name", slugRedirect: "portfolio", section: "content",
    searchFields: ["name", "clientName", "description"], orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], mediaFields: ["imageId"],
    multiImage: { field: "galleryIds", model: "portfolioImage", fk: "portfolioId", media: "mediaId" },
    publicPaths: ["/", "/portfolio"],
    columns: [{ key: "imageId", label: "Image", kind: "image" }, { key: "name", label: "Title" }, { key: "clientName", label: "Client" }, { key: "isFeatured", label: "Featured", kind: "bool" }, { key: "isActive", label: "Active", kind: "bool" }],
    fields: [
      { name: "name", label: "Project title", type: "text", required: true, max: 160 },
      { name: "slug", label: "Slug", type: "slug", max: 190 },
      { name: "clientName", label: "Client", type: "text", max: 160, help: "Only enter a client name if you have permission to publish it." },
      { name: "description", label: "Description", type: "textarea", required: true, max: 5000, rows: 6 },
      { name: "projectDate", label: "Project date", type: "date" },
      { name: "imageId", label: "Main image", type: "image" },
      { name: "galleryIds", label: "Additional images", type: "images" },
      order, featured, active, ...seo,
      idg({ name: "nameId", label: "Project title (Indonesian)", type: "text", max: 160 }),
      idg({ name: "descriptionId", label: "Description (Indonesian)", type: "textarea", max: 5000, rows: 6 }),
    ],
  },
  gallery: {
    key: "gallery", model: "gallery", label: "Gallery", singular: "photo", nameField: "title", section: "content",
    searchFields: ["title", "description"], orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], mediaFields: ["imageId"], publicPaths: ["/", "/gallery"],
    columns: [{ key: "imageId", label: "Image", kind: "image" }, { key: "title", label: "Internal label" }, { key: "displayOrder", label: "Order" }, { key: "isActive", label: "Active", kind: "bool" }, { key: "createdAt", label: "Added", kind: "date" }],
    fields: [
      { name: "title", label: "Internal label (not shown publicly)", type: "text", required: true, max: 160 },
      { name: "description", label: "Internal note (not shown publicly)", type: "textarea", max: 2000, rows: 3 },
      { name: "imageId", label: "Image", type: "image", required: true },
      order, active,
    ],
  },
  blogs: {
    key: "blogs", model: "blog", label: "Blogs", singular: "article", nameField: "title", slugSource: "title", slugRedirect: "blog", section: "content",
    searchFields: ["title", "excerpt"], orderBy: [{ createdAt: "desc" }], mediaFields: ["featuredImageId"], publicPaths: ["/", "/blogs"],
    columns: [{ key: "featuredImageId", label: "Image", kind: "image" }, { key: "title", label: "Title" }, { key: "status", label: "Status", kind: "status" }, { key: "publishedAt", label: "Published", kind: "date" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 220 },
      { name: "slug", label: "Slug", type: "slug", max: 250 },
      { name: "excerpt", label: "Description (summary)", type: "textarea", max: 400, rows: 3 },
      { name: "content", label: "Content", type: "longtext", required: true, max: 100000, rows: 16, help: "Separate paragraphs with a blank line. Start a line with '## ' for a subheading. HTML is not processed." },
      { name: "featuredImageId", label: "Image", type: "image" },
      { name: "status", label: "Status", type: "select", required: true, def: "DRAFT", options: [{ value: "DRAFT", label: "Draft" }, { value: "PUBLISHED", label: "Published" }] },
      { name: "publishedAt", label: "Publication date", type: "date", help: "Leave empty to use the date of publishing." },
      ...seo,
      idg({ name: "titleId", label: "Title (Indonesian)", type: "text", max: 220 }),
      idg({ name: "excerptId", label: "Description / summary (Indonesian)", type: "textarea", max: 400, rows: 3 }),
      idg({ name: "contentId", label: "Content (Indonesian)", type: "longtext", max: 100000, rows: 16, help: "Same format as the English content." }),
    ],
  },
  "about-us": {
    key: "about-us", model: "aboutSection", label: "About Us", singular: "section", nameField: "heading", section: "content",
    searchFields: ["heading", "body"], orderBy: [{ displayOrder: "asc" }, { id: "asc" }], mediaFields: ["imageId"], publicPaths: ["/", "/about-us"],
    columns: [{ key: "imageId", label: "Image", kind: "image" }, { key: "heading", label: "Heading" }, { key: "displayOrder", label: "Order" }, { key: "isActive", label: "Active", kind: "bool" }, { key: "updatedAt", label: "Updated", kind: "date" }],
    fields: [
      { name: "heading", label: "Heading", type: "text", required: true, max: 200 },
      { name: "body", label: "Body content", type: "longtext", required: true, max: 20000, rows: 10, help: "Blank line = new paragraph. Start a line with '- ' for a bullet. HTML is not processed." },
      { name: "imageId", label: "Optional image", type: "image" },
      order, active,
      idg({ name: "headingId", label: "Heading (Indonesian)", type: "text", max: 200 }),
      idg({ name: "bodyId", label: "Body content (Indonesian)", type: "longtext", max: 20000, rows: 10 }),
    ],
  },
  "our-team": {
    key: "our-team", model: "teamMember", label: "Our Team", singular: "team member", nameField: "name", section: "content",
    searchFields: ["name", "position"], orderBy: [{ displayOrder: "asc" }, { id: "asc" }], mediaFields: ["photoId"], publicPaths: ["/", "/about-us"],
    columns: [{ key: "photoId", label: "Photo", kind: "image" }, { key: "name", label: "Name" }, { key: "position", label: "Position" }, { key: "displayOrder", label: "Order" }, { key: "isActive", label: "Active", kind: "bool" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 160 },
      { name: "position", label: "Position", type: "text", required: true, max: 160 },
      { name: "photoId", label: "Photo", type: "image" },
      order, active,
      idg({ name: "positionId", label: "Position (Indonesian)", type: "text", max: 160 }),
    ],
  },
  brands: {
    key: "brands", model: "brand", label: "Brands", singular: "brand", nameField: "name", section: "content",
    searchFields: ["name"], orderBy: [{ displayOrder: "asc" }, { name: "asc" }], mediaFields: ["logoId"], publicPaths: ["/"],
    columns: [{ key: "logoId", label: "Logo", kind: "image" }, { key: "name", label: "Name" }, { key: "displayOrder", label: "Order" }, { key: "isActive", label: "Active", kind: "bool" }],
    fields: [
      { name: "name", label: "Brand name", type: "text", required: true, max: 160 },
      { name: "logoId", label: "Logo", type: "image" },
      { name: "websiteUrl", label: "Website URL", type: "url", max: 255, placeholder: "https://" },
      order, active,
    ],
  },
  clients: {
    key: "clients", model: "client", label: "Clients", singular: "client", nameField: "name", section: "content",
    searchFields: ["name"], orderBy: [{ displayOrder: "asc" }, { name: "asc" }], mediaFields: ["logoId"], publicPaths: ["/"],
    columns: [{ key: "logoId", label: "Logo", kind: "image" }, { key: "name", label: "Name" }, { key: "displayOrder", label: "Order" }, { key: "isActive", label: "Active", kind: "bool" }],
    fields: [
      { name: "name", label: "Client name", type: "text", required: true, max: 160 },
      { name: "logoId", label: "Logo", type: "image" },
      { name: "websiteUrl", label: "Website URL", type: "url", max: 255, placeholder: "https://" },
      order, active,
    ],
  },
};

/** Public URL for a record, or null when it is not visible publicly (inactive / draft). */
export function publicUrlFor(key: ModuleKey, row: Record<string, unknown>): string | null {
  if (row.isActive === false) return null;
  switch (key) {
    case "services": return `/service/${row.slug}`;
    case "products": return `/products/${row.slug}`;
    case "portfolio": return `/portfolio/${row.slug}`;
    case "gallery": return "/gallery";
    case "our-team": case "about-us": return "/about-us";
    case "blogs": return row.status === "PUBLISHED" ? `/blogs/${row.slug}` : null;
    case "product-types": return "/products";
    case "brands": case "clients": return "/";
  }
}

export const MODULE_LIST = Object.values(MODULES);
export function getModule(key: string): ModuleDef | null {
  return (MODULES as Record<string, ModuleDef>)[key] ?? null;
}
