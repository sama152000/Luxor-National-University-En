export interface ContactInfo {
  phone: string;
  email: string;
  website: string;
}

export interface Language {
  code: string;
  name: string;
  active: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  active: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  title?: string;
}