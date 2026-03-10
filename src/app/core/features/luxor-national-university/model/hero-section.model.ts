export interface HeroAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  heroSectionId: string;
}

export interface HeroSection {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  isActive: boolean;
  heroAttachments: HeroAttachment[];
}

export interface HeroDot {
  label: string;
  active: boolean;
}
