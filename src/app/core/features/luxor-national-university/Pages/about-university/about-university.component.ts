import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AboutUniversityService } from '../../Services/about-university.service';
import { AboutUniversitySection } from '../../model/about-university.model';
import { GalleryService } from '../../Services/gallery.service';
import { GalleryAttachment } from '../../model/gallery.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-about-university',
  standalone: true,
  imports: [CommonModule, RouterLink, CleanHtmlPipe],
  templateUrl: './about-university.component.html',
  styleUrls: ['./about-university.component.css']
})
export class AboutUniversityComponent implements OnInit {
  section: AboutUniversitySection | null = null;
  activeTab: string = 'overview';
  isLoading = false;

  // One random image URL assigned per tab
  tabImages: Record<string, string> = {};

  tabs = [
    { id: 'overview', title: 'Overview', icon: 'pi pi-home' },
    { id: 'vision', title: 'Vision', icon: 'pi pi-eye' },
    { id: 'mission', title: 'Mission', icon: 'pi pi-flag' },
    { id: 'goals', title: 'Goals', icon: 'pi pi-bullseye' },
    { id: 'history', title: 'History', icon: 'pi pi-clock' }
  ];

  constructor(
    private aboutService: AboutUniversityService,
    private galleryService: GalleryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Read the active tab from the snapshot immediately to avoid flash
    const initialTab = this.route.snapshot.params['tab'] || 'overview';
    this.activeTab = initialTab;

    this.loadData();
    this.loadGalleryImages();

    // Keep listening for subsequent navigation changes (same component instance reused)
    this.route.params.subscribe(params => {
      this.activeTab = params['tab'] || 'overview';
    });
  }

  loadData(): void {
    this.aboutService.getAboutData().subscribe(data => {
      this.section = data;
    });
  }

  loadGalleryImages(): void {
    this.galleryService.getAllGalleryAttachments().subscribe((images: GalleryAttachment[]) => {
      if (!images || images.length === 0) return;

      // Images are already shuffled once in the service (stable across re-inits)
      this.tabs.forEach((tab, index) => {
        this.tabImages[tab.id] = images[index % images.length].url;
      });
    });
  }

  get activeTabImage(): string {
    return this.tabImages[this.activeTab] || '';
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }
}
