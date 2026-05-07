import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FooterService } from '../../../Services/footer.service';
import { LogosService } from '../../../Services/logos.service';
import { VisitorsService } from '../../../Services/visitors.service';
import { FooterData } from '../../../model/footer.model';
import { ImageAsset } from '../../../model/common.model';
import { Logo } from '../../../model/logo.model';
import { VisitorsTotal, VisitorsToday, VisitorsMonth } from '../../../model/visitors.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  footerData!: FooterData;
  logo: ImageAsset = {
    src: './assets/lnu.logo.png',
    alt: 'جامعة الأقصر الوطنية',
    title: 'شعار الجامعة'
  };

  totalViews = 0;
  displayedViews = 0;
  animationDone = false;

  todayViews = 0;
  monthViews = 0;

  private subscription = new Subscription();
  private animationFrameId?: number;

  constructor(
    private footerService: FooterService,
    private logosService: LogosService,
    private visitorsService: VisitorsService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadFooterData();
    this.loadLogo();
    this.loadTotalViews();
    this.loadTodayViews();
    this.loadMonthViews();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  isInternalLink(url: string): boolean {
    return !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('www.');
  }

  private loadFooterData(): void {
    const sub = this.footerService.getFooterData().subscribe({
      next: (data: FooterData) => {
        this.footerData = data;
      },
      error: () => {
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
        if (logos?.length > 0) {
          this.logo = {
            src: logos[0].url || './assets/lnu.logo.png',
            alt: 'جامعة الأقصر الوطنية',
            title: 'شعار الجامعة'
          };
        }
      },
      error: () => {}
    });
    this.subscription.add(sub);
  }

  private loadTotalViews(): void {
    const sub = this.visitorsService.getTotalViews().subscribe({
      next: (data: VisitorsTotal) => {
        this.totalViews = data?.totalViews ?? 0;
        this.displayedViews = 0;
        this.animationDone = false;
        this.startCounterAnimation();
      },
      error: () => {
        this.totalViews = 0;
        this.displayedViews = 0;
      }
    });
    this.subscription.add(sub);
  }

  private loadTodayViews(): void {
    const sub = this.visitorsService.getTodayViews().subscribe({
      next: (data: VisitorsToday) => {
        this.todayViews = data?.todayViews ?? 0;
      },
      error: () => {
        this.todayViews = 0;
      }
    });
    this.subscription.add(sub);
  }

  private loadMonthViews(): void {
    const sub = this.visitorsService.getMonthViews().subscribe({
      next: (data: VisitorsMonth) => {
        this.monthViews = data?.monthViews ?? 0;
      },
      error: () => {
        this.monthViews = 0;
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
