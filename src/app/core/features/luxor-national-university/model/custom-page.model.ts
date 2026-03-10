export interface PageAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  pageId: string;
}

export interface CustomPage {
  id: string;
  pageId: string;
  slug: string;
  pageType: string;
  pageTemplate: number; // 0 = default, 1 = custom (حسب الـ backend)
  subTitle: string;
  content: string;
  status: string;
  publishedDate: string;
  featuredImagePath: string;
  pageAttachments: PageAttachment[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: string[];
  statusCode: number;
  timestamp: string;
}
