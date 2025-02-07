import { CustomLink } from './custom-link';
import { SocialLink } from './social-link';

export interface Page {
  id: number;
  url: string;
  title?: string;
  bio?: string;
  pictureUrl?: string;
  backgroundColor?: string;
  fontColor?: string;
  buttonBackgroundColor?: string;
  buttonFontColor?: string;
  buttonRounded: boolean;
  fontStyle?: string;
  backgroundStyle?: string;
  dateCreated?: string;
  dateLastModified?: string;
  socialLinks?: SocialLink[];
  customLinks?: CustomLink[];
  userVerified: boolean;
}
