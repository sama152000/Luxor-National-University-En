import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServicesService } from '../../Services/services.service';
import { ContactService } from '../../Services/contact.service';
import { Service } from '../../model/service.model';
import { Contact } from '../../model/contact.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink,CleanHtmlPipe],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  contactInfo: Contact | null = null;
  currentIndex = 0;
  isTransitioning = false;
  autoPlayInterval: any;
  private destroy$ = new Subject<void>();

  constructor(
    private servicesService: ServicesService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadContactInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAutoPlay();
  }

  /** تحميل الخدمات */
  private loadServices(): void {
    this.servicesService.getActiveServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe((services: Service[]) => {
        this.services = services;
        // تشغيل الـ auto-play بعد تحميل الخدمات
        setTimeout(() => {
          this.startAutoPlay();
        }, 1000);
      });
  }

  /** تحميل بيانات الاتصال */
  private loadContactInfo(): void {
    this.contactService.getAllContacts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(contacts => {
        if (contacts && contacts.length > 0) {
          this.contactInfo = contacts[0];
        }
      });
  }

  /** تشغيل الـ auto-play */
  private startAutoPlay(): void {
    this.stopAutoPlay(); // نتأكد الأول إنه مفيش interval شغال
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 8000);
  }

  /** إيقاف الـ auto-play */
  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  nextSlide(): void {
    if (this.isTransitioning || this.services.length === 0) return;
    
    this.isTransitioning = true;
    this.currentIndex = (this.currentIndex + 1) % this.services.length;
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  prevSlide(): void {
    if (this.isTransitioning || this.services.length === 0) return;
    
    this.isTransitioning = true;
    this.currentIndex = this.currentIndex === 0 ? this.services.length - 1 : this.currentIndex - 1;
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  goToSlide(index: number): void {
    if (this.isTransitioning || index === this.currentIndex) return;
    
    this.isTransitioning = true;
    this.currentIndex = index;
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  onMouseEnter(): void {
    this.stopAutoPlay();
  }

  onMouseLeave(): void {
    this.startAutoPlay();
  }

  getCurrentService(): Service | null {
    return this.services[this.currentIndex] || null;
  }

  trackByService(index: number, service: Service): string {
    return service.id;
  }

  /** Get fax URL for the button */
  getFaxUrl(): string {
    return this.contactInfo?.fax ? `fax:${this.contactInfo.fax}` : '';
  }

  hasFax(): boolean {
    return !!this.contactInfo?.fax;
  }
}
