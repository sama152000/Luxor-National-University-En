import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css']
})
export class NewsDetailsComponent implements OnInit {
  news: News | null = null;
  relatedNews: News[] = [];
  previousNews: News | null = null;
  nextNews: News | null = null;

  currentImageIndex = 0;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadNewsDetails(slug);
      }
    });
  }

  loadNewsDetails(slug: string): void {
    this.isLoading = true;

    this.newsService.getNewsBySlug(slug).subscribe(news => {
      this.news = news || null;

      if (this.news) {
        this.loadRelatedNews(this.news.id);
        this.loadNavigationNews(this.news.id);
      }

      this.isLoading = false;
    });
  }

  loadRelatedNews(newsId: string): void {
    this.newsService.getRelatedNews(newsId, 4).subscribe(related => {
      this.relatedNews = related;
    });
  }

  loadNavigationNews(newsId: string): void {
    this.newsService.getPreviousNews(newsId).subscribe(prev => {
      this.previousNews = prev !== undefined ? prev : null;
    });

    this.newsService.getNextNews(newsId).subscribe(next => {
      this.nextNews = next !== undefined ? next : null;
    });
  }

  // Image Slider Methods
  nextImage(): void {
    if (this.news && this.news.postAttachments.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.news.postAttachments.length;
    }
  }

  previousImage(): void {
    if (this.news && this.news.postAttachments.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.news.postAttachments.length - 1
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  // Navigation Methods
  goToPreviousNews(): void {
    if (this.previousNews) {
      this.router.navigate(['/news', this.previousNews.slug]);
    }
  }

  goToNextNews(): void {
    if (this.nextNews) {
      this.router.navigate(['/news', this.nextNews.slug]);
    }
  }

  viewRelatedNews(slug: string | undefined): void {
    if (slug) {
      this.router.navigate(['/news', slug]);
    }
  }

  goBack(): void {
    this.router.navigate(['/news']);
  }

  // Utility Methods
  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  getCurrentImage(): string {
    return this.news?.postAttachments[this.currentImageIndex]?.url || this.news?.featuredImagePath || '';
  }

  hasMultipleImages(): boolean {
    return (this.news?.postAttachments.length || 0) > 1;
  }
}
