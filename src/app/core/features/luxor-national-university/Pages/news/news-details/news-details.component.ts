import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../../../../../environments/environment';
import { switchMap } from 'rxjs/operators';

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
    private newsService: NewsService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadNewsDetails(id);
      }
    });
  }

  private updateMetaTags(news: News): void {
    // Get the first image from attachments or use featured image
    const imageUrl = news.postAttachments?.[0]?.url 
      ? this.getFullImageUrl(news.postAttachments[0].url)
      : news.featuredImagePath 
        ? this.getFullImageUrl(news.featuredImagePath)
        : 'https://lunar.runasp.net/assets/lnu.logo.png';

    // Get a clean description from content (strip HTML tags)
    const description = this.stripHtmlTags(news.content).substring(0, 160);

    // Update page title
    this.title.setTitle(`${news.title} - جامعة الاقصر الاهلية`);

    // Update Open Graph meta tags
    this.meta.updateTag({ property: 'og:title', content: news.title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:image:secure_url', content: imageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: news.title });
    this.meta.updateTag({ property: 'og:url', content: `${environment.apiBase}/news/${news.id}` });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'جامعة الاقصر الاهلية' });

    // Update Twitter Card meta tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: news.title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image:src', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image:alt', content: news.title });
  }

  getFullImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }

    if (url.startsWith('/')) {
      return `${environment.apiBase}${url}`;
    }

    return `${environment.apiBase}/${url}`;
  }

  private stripHtmlTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  loadNewsDetails(id: string): void {
    this.isLoading = true;

    // First call: records the view on the backend AND loads the post content.
    // The backend increments the counter but returns the old value in this response.
    this.newsService.getNewsById(id).pipe(
      switchMap(news => {
        // Show content immediately with the count from the first response
        this.news = news || null;
        if (this.news) {
          this.loadRelatedNews(this.news.id);
          this.loadNavigationNews(this.news.id);
          this.updateMetaTags(this.news);
        }
        this.isLoading = false;

        // Second call: the backend has already incremented the counter,
        // so this response contains the correct up-to-date count.
        return this.newsService.getNewsById(id);
      })
    ).subscribe(updatedNews => {
      if (this.news && updatedNews) {
        // Only patch the view count — keep everything else as-is
        this.news.totalViewCount = updatedNews.totalViewCount;
      }
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
       this.router.navigate(['/news', this.previousNews.id]);
     }
   }

   goToNextNews(): void {
     if (this.nextNews) {
       this.router.navigate(['/news', this.nextNews.id]);
     }
   }

   viewRelatedNews(id: string | undefined): void {
     if (id) {
       this.router.navigate(['/news', id]);
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
    const imageUrl = this.news?.postAttachments[this.currentImageIndex]?.url || this.news?.featuredImagePath || '';
    return imageUrl ? this.getFullImageUrl(imageUrl) : '';
  }

  hasMultipleImages(): boolean {
    return (this.news?.postAttachments.length || 0) > 1;
  }
}