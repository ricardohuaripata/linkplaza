import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoConfig } from '../interfaces/seo-config';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private title: Title,
    private meta: Meta
  ) {}

  setPageTitle(title: string): void {
    this.title.setTitle(title);
  }

  setCanonicalURL(url: string): void {
    const CANONICAL_URL = url == undefined ? this._document.URL : url;
    const HEAD = this._document.getElementsByTagName('head')[0];

    let element: HTMLLinkElement | null =
      this._document.querySelector('link[rel="canonical"]') || null;
    if (!element) {
      element = this._document.createElement('link') as HTMLLinkElement;
      HEAD.appendChild(element);
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', CANONICAL_URL);
  }

  setIndexFollow(state: boolean): void {
    this.meta.updateTag({
      name: 'robots',
      content: state ? 'index, follow' : 'noindex, nofollow',
    });
  }

  setSocialMetaTags(config: SeoConfig): void {
    this.meta.updateTag({
      name: 'description',
      content: config.page_description,
    });
    this.meta.updateTag({
      name: 'apple-mobile-web-app-title',
      content: environment.APP_NAME,
    });
    this.meta.updateTag({
      name: 'application-name',
      content: environment.APP_NAME,
    });
    this.meta.updateTag({
      property: 'twitter:title',
      content: config.page_title,
    });
    this.meta.updateTag({
      property: 'twitter:description',
      content: config.page_description,
    });
    this.meta.updateTag({ property: 'twitter:url', content: config.page_url });
    this.meta.updateTag({
      name: 'twitter:image',
      content: config.page_image_url,
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({
      property: 'og:site_name',
      content: environment.APP_NAME,
    });
    this.meta.updateTag({ property: 'og:title', content: config.page_title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.page_description,
    });
    this.meta.updateTag({ name: 'og:image', content: config.page_image_url });
    this.meta.updateTag({ property: 'og:url', content: config.page_url });
  }

  addPreloadImage(imageUrl: string): void {
    const HEAD = this._document.getElementsByTagName('head')[0];
    const element = this._document.createElement('link') as HTMLLinkElement;
    element.setAttribute('rel', 'preload');
    element.setAttribute('as', 'image');
    element.setAttribute('href', imageUrl);
    HEAD.appendChild(element);
  }

  addPreloadFont(fontUrl: string): void {
    const HEAD = this._document.getElementsByTagName('head')[0];
    const element = this._document.createElement('link') as HTMLLinkElement;
    element.setAttribute('rel', 'preload');
    element.setAttribute('as', 'font');
    element.setAttribute('type', 'font/woff2');
    element.setAttribute('href', fontUrl);
    element.setAttribute('crossorigin', 'anonymous');
    HEAD.appendChild(element);
  }
}
