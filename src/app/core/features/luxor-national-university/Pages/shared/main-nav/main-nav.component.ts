import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../Services/navigation.service';
import { NavigationItem } from '../../../model/navigation.model';
import { LogosService } from '../../../Services/logos.service';
import { Logo } from '../../../model/logo.model';

@Component({
  selector: 'app-main-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy {
  navigationItems: NavigationItem[] = [];
  logos: Logo[] = [];
  openDropdownId: string | null = null; // Track which dropdown is open

  // Static icons mapping based on slug (from API)
  private iconMap: { [key: string]: string } = {
    'home': 'fas fa-home',
    'about': 'fas fa-university',
    'faculties': 'fas fa-graduation-cap',
    'services': 'fas fa-handshake',
    'news': 'fas fa-newspaper',
    'contactInfo': 'fas fa-phone-alt',
    'custom': 'fas fa-file-alt',
    'first-page': 'fas fa-file',
    'second': 'fas fa-file'
  };

  constructor(
    private navigationService: NavigationService,
    private logosService: LogosService
  ) {}

  ngOnInit(): void {
    // ✅ جلب عناصر المنيو من API
    this.navigationService.getNavigationItems().subscribe({
      next: (data) => {
        this.navigationItems = data;

        // ✅ لو فيه صفحات مخصصة
        const customItem = data.find(item => item.slug === 'custom');
        if (customItem) {
         
        }
      },
      error: (err) => console.error('Error fetching navigation items', err)
    });

    // ✅ جلب اللوجوهات
    this.logosService.getAllLogos().subscribe({
      next: (data) => this.logos = data,
      error: (err) => console.error('Error fetching logos', err)
    });

    // ✅ إغلاق الدروب داون عند الضغط خارج المنيو
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  // Handle click outside to close dropdown
  private onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-item.has-dropdown')) {
      this.closeDropdown();
    }
  }

  // Get static icon based on slug
  getIcon(slug: string): string {
    return this.iconMap[slug] || 'fas fa-link';
  }

  // Get childs for an item
  getChilds(item: NavigationItem): NavigationItem[] {
    const childs = item.childs || [];
    // console.log('Getting childs for', item.title, ':', childs);
    return childs;
  }

  // Check if item has childs
  hasChilds(item: NavigationItem): boolean {
    return Array.isArray(item.childs) && item.childs.length > 0;
  }

  // Check if dropdown is open for specific item
  isDropdownOpen(itemId: string): boolean {
    const isOpen = this.openDropdownId === itemId;
    return isOpen;
  }

  // Toggle dropdown for specific item
  toggleDropdown(event: Event, item: NavigationItem): void {
    // console.log('toggleDropdown called for', item.title, 'id:', item.id);
    event.preventDefault();
    event.stopPropagation();
    if (this.openDropdownId === item.id) {
      this.openDropdownId = null; // Close if already open
    } else {
      this.openDropdownId = item.id; // Open this dropdown
    }
  }

  // Close all dropdowns
  closeDropdown(): void {
    this.openDropdownId = null;
  }
}
