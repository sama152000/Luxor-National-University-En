import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';
import { CustomPage, PageAttachment } from '../../../model/custom-page.model';
import { CustomPageService } from '../../../Services/custom-page.service';
import { environment } from '../../../../../../../environments/environment';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe';


interface Tab {
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-custom-page',
  standalone: true,
  imports: [CommonModule,RouterModule,CleanHtmlPipe],
  templateUrl: './custom-page.component.html',
  styleUrls: ['./custom-page.component.css']
})
export class CustomPageComponent implements OnInit, OnDestroy {
  currentPage: CustomPage | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  activeTabId: string = 'content';
  tabs: Tab[] = [
    { id: 'content', title: 'المحتوى', icon: 'pi pi-file' },
    { id: 'attachments', title: 'المرفقات', icon: 'pi pi-paperclip' }
  ];
  private subscription = new Subscription();

  constructor(
    private customPageService: CustomPageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const sub = this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadPageBySlug(slug);
      } else {
        this.hasError = true;
        this.isLoading = false;
      }
    });
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadPageBySlug(slug: string): void {
    this.isLoading = true;
    this.hasError = false;
    
    const sub = this.customPageService.getAllPages().subscribe({
      next: (pages) => {
        this.currentPage = pages.find(p => p.slug === slug) || null;
        this.isLoading = false;
        if (!this.currentPage) {
          this.hasError = true;
        }
      },
      error: (error) => {
        console.error('Error loading page:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
    this.subscription.add(sub);
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTabId === tabId;
  }

  setActiveTab(tabId: string): void {
    this.activeTabId = tabId;
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return environment.apiUrl + imagePath;
  }

  downloadAttachment(attachment: PageAttachment): void {
    if (attachment.url) {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.fileName || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  getFileIcon(fileName: string): string {
    if (!fileName) return 'pi pi-file';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word';
      case 'xls':
      case 'xlsx':
        return 'pi pi-file-excel';
      case 'ppt':
      case 'pptx':
        return 'pi pi-file';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'pi pi-image';
      case 'zip':
      case 'rar':
        return 'pi pi-file-archive';
      default:
        return 'pi pi-file';
    }
  }

  hasValidContent(): boolean {
    return !!(this.currentPage?.subTitle || this.currentPage?.content || 
             (this.currentPage?.pageAttachments && this.currentPage.pageAttachments.length > 0));
  }
}
