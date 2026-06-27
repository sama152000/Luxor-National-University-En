import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule, CleanHtmlPipe],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  latestNews: News[] = [];
  currentIndex: number = 0;
  isLoading = true;
  private autoSlideTimer: any;
  private readonly SLIDE_DURATION = 5000;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadLatestNews();
  }

  /** تحميل أحدث الأخبار */
  loadLatestNews(): void {
    this.isLoading = true;
    this.newsService.getLatestNews(10).subscribe({
      next: (news) => {
        this.latestNews = news;
        this.isLoading = false;
        this.currentIndex = 0;
        // Start auto-sliding only after data has successfully arrived
        if (this.latestNews && this.latestNews.length > 0) {
          this.startAutoSlide();
        }
      },
      error: (err) => {
        console.error('Error fetching latest news', err);
        this.isLoading = false;
      }
    });
  }


/** Move to the PREVIOUS slide safely */
  prevSlide(): void {
    
    if (!this.latestNews || this.latestNews.length === 0) return;
    if (this.currentIndex === 0) {
      // Loop back to the very last article in the fetched array
      const totalNews = this.latestNews.length;
  this.currentIndex = (this.currentIndex - 1 + totalNews) % totalNews;
    } else {
      this.currentIndex--;
    }
 
  }

  /** Move to the NEXT slide safely */
  nextSlide(): void {
    // Safety check: Do nothing if the data hasn't loaded yet or is empty
    if (!this.latestNews || this.latestNews.length === 0) return;

    if (this.currentIndex === this.latestNews.length - 1) {
      // Loop forward to the first article
      const totalNews = this.latestNews.length;
  this.currentIndex = (this.currentIndex + 1) % totalNews;
    } else {
      this.currentIndex++;
    }
  
  }

  startAutoSlide(): void {
    
    this.autoSlideTimer = setInterval(() => {
      this.nextSlide();
    }, this.SLIDE_DURATION);
  }

  /** تنسيق التاريخ */
  formatDate(date: string): string {
    return new Intl.DateTimeFormat('En-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }
}


