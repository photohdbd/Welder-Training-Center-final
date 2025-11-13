
export interface SiteSettings {
  name_bn: string;
  name_en: string;
  logoUrl: string;
  faviconUrl: string;
  signatureUrl: string;
  description_bn: string;
  description_en: string;
  address_bn: string;
  address_en: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  googleMapUrl: string;
  features: Feature[];
  whyChooseUs: WhyChooseUsItem[];
  whyChooseUsImageUrl: string;
}

export interface Slide {
  id: string;
  imageUrl: string;
  caption_bn: string;
  caption_en: string;
}

export interface Notice {
  id: string;
  title_bn: string;
  title_en: string;
  date: string;
  content_bn: string;
  content_en: string;
}

export interface Trainer {
  id: string;
  name_bn: string;
  name_en: string;
  phone: string;
  address_bn: string;
  address_en: string;
  expertise_bn: string;
  expertise_en: string;
  imageUrl: string;
}

export interface Student {
  id: string; // Certificate ID / Student ID
  name: string;
  fatherName: string;
  phone: string;
  courseName_bn: string;
  courseName_en: string;
  courseDuration_bn: string;
  courseDuration_en: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  certificatePdfUrl?: string;
}

export interface Course {
    id: string;
    name_bn: string;
    name_en: string;
    shortDescription_bn: string;
    shortDescription_en: string;
    imageUrl: string;
    details_bn: string;
    details_en: string;
    price?: number;
    offerPrice?: number;
    offerEndDate?: string;
}

export interface GalleryItem {
    id: string;
    imageUrl: string;
    description_bn: string;
    description_en: string;
}

export interface Video {
    id: string;
    title_bn: string;
    title_en: string;
    youtubeUrl: string;
}

export interface Feature {
    id: string;
    icon: string;
    title_bn: string;
    title_en: string;
    description_bn: string;
    description_en: string;
}

export interface WhyChooseUsItem {
    id: string;
    icon: string;
    title_bn: string;
    title_en: string;
    description_bn: string;
    description_en: string;
}

export interface TrainingItem {
    id: string;
    name_bn: string;
    name_en: string;
    imageUrl: string;
}