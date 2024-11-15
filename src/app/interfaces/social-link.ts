import { SocialPlatform } from './social-platform';

export interface SocialLink {
  id: number;
  socialPlatform: SocialPlatform;
  url: string;
  position: number;
  isActive: boolean;
}
