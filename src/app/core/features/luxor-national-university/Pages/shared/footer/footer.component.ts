import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
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
    alt: 'Luxor National University',
    title: 'logo'
  };
    totalViews = 0;
  displayedViews = 0;
  animationDone = false;

  private subscription = new Subscription();
  private animationFrameId?: number;

  constructor(
    private footerService: FooterService,
    private logosService: LogosService,
    private ngZone: NgZone
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
      alt: 'Luxor National University',
      title: 'University Logo'
    },
    description: 'Luxor National University is committed to academic excellence, scientific research, and community service.',
    sections: [
      {
        title: 'Important Links',
        links: [
          { label: 'About the University', url: '/about' },
          { label: 'Faculties', url: '/faculties' },
          { label: 'News and Events', url: '/news' },
          { label: 'Contact Us', url: '/contactInfo' }
        ]
      }
    ],
    socialLinks: [],
    copyright: 'Luxor National University. All rights reserved.',
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
          alt: 'Luxor National University',
          title: 'University Logo'
        };
      }
    },
    error: (error) => {
      console.error('Error loading logo:', error);
    }
  });
  this.subscription.add(sub);
}
 private startCounterAnimation(): void {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    if (this.totalViews <= 0) {
      this.displayedViews = 0;
      this.animationDone = true;
      return;
    }

    const duration = 1800;
    const target = this.totalViews;
    let startTime: number | null = null;

    // Run rAF loop outside Angular zone to avoid triggering change detection on every frame.
    // We call ngZone.run() only when the displayed value actually changes.
    this.ngZone.runOutsideAngular(() => {
      const step = (timestamp: number) => {
        if (startTime === null) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease-out: decelerates as it approaches the target
        const eased = 1 - Math.pow(1 - progress, 3);
        const next = Math.round(target * eased);

        if (next !== this.displayedViews) {
          this.ngZone.run(() => {
            this.displayedViews = next;
          });
        }

        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(step);
        } else {
          this.ngZone.run(() => {
            this.displayedViews = target;
            this.animationDone = true;
          });
          this.animationFrameId = undefined;
        }
      };

      this.animationFrameId = requestAnimationFrame(step);
    });
  }
}
