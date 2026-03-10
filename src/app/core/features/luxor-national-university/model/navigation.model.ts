export interface NavigationItem {
  id: string;
  pageId: string;
  title: string;       // العنوان بالعربي
  titleEn: string;     // العنوان بالإنجليزي
  slug: string;        // المسار الديناميكي
  pageTemplate: string;
  icon: string;
  order: number;
  menuTypeId: string;
  menuType: string;
  parentId?: string | null;
  parentName?: string | null;
  childs?: NavigationItem[]; // عناصر فرعية
}

export interface NavigationData {
  success: boolean;
  data: NavigationItem[];
  message: string;
  errors: any[];
  statusCode: number;
  timestamp: string;
}
