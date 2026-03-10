export interface Service {
  id: string;
  title: string;
  description: string;
  iconPath: string;   // مثال: "pi pi-book"
  isActive: boolean;
  pageId: string;
  pageTitle: string;
  slug: string;
}
