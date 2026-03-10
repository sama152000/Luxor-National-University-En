import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FooterService } from '../../../Services/footer.service';
import { LogosService } from '../../../Services/logos.service';
import { FooterData } from '../../../model/footer.model';
import { ImageAsset } from '../../../model/common.model';
import { Logo } from '../../../model/logo.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  footerData!: FooterData;
  logo: ImageAsset = {
    src: './assets/lnu.logo.png',
    alt: 'جامعة الأقصر الوطنية',
    title: 'شعار الجامعة'
  };
  private subscription = new Subscription();

  constructor(
    private footerService: FooterService,
    private logosService: LogosService
  ) {}

  ngOnInit() {
    this.loadFooterData();
    this.loadLogo();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /** Check if URL is internal (not external) */
  isInternalLink(url: string): boolean {
    return !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('www.');
  }

  private loadFooterData(): void {
    const sub = this.footerService.getFooterData().subscribe({
      next: (data: FooterData) => {
        this.footerData = data;
      },
      error: (error) => {
        console.error('Error loading footer data:', error);
        // Use default data if API fails
        this.footerData = this.getDefaultFooterData();
      }
    });
    this.subscription.add(sub);
  }

  private getDefaultFooterData(): FooterData {
    return {
      id: '1',
      logo: {
        src: './assets/lnu.logo.png',
        alt: 'جامعة الأقصر الوطنية',
        title: 'شعار الجامعة'
      },
      description: 'جامعة الأقصر الوطنية ملتزمة بالتميز الأكاديمي، والبحث العلمي، وخدمة المجتمع.',
      sections: [
        {
          title: 'روابط هامة',
          links: [
            { label: 'عن الجامعة', url: '/about' },
            { label: 'الكليات', url: '/faculties' },
            { label: 'الأخبار والفعاليات', url: '/news' },
            { label: 'تواصل معنا', url: '/contactInfo' }
          ]
        }
      ],
      socialLinks: [],
      copyright: 'جامعة الأقصر الوطنية. جميع الحقوق محفوظة.',
      year: new Date().getFullYear()
    };
  }

  private loadLogo(): void {
    const sub = this.logosService.getAllLogos().subscribe({
      next: (logos: Logo[]) => {
        if (logos && logos.length > 0) {
          const firstLogo = logos[0];
          this.logo = {
            src: firstLogo.url || './assets/lnu.logo.png',
            alt: 'جامعة الأقصر الوطنية',
            title: 'شعار الجامعة'
          };
        }
      },
      error: (error) => {
        console.error('Error loading logo:', error);
      }
    });
    this.subscription.add(sub);
  }
}
