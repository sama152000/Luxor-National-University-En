export interface PostCategory {
  id: string;
  postId: string;
  categoryId: string;
  categoryName: string;
}

export interface PostAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  postId: string;
}

export interface PostTag {
  postId: string;
  index: number;
  id: string;
  name: string;
}

export interface News {
  id: string;
  title: string;
  urlTitleEn: string;
  content: string;
  status: string;
  type: string;
  publishedDate: string;
  featuredImagePath: string;
  pageId: string;
  pageTittle: string;
  createdDate: string;
  postCategories: PostCategory[];
  postAttachments: PostAttachment[];
  tags: PostTag[];
  slug?: string; // مضاف حديثًا
}
