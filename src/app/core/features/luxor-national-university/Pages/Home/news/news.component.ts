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
  isLoading = true;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadLatestNews();
  }

  /** تحميل أحدث الأخبار */
  loadLatestNews(): void {
    this.isLoading = true;
    this.newsService.getLatestNews(4).subscribe({
      next: (news) => {
        this.latestNews = news;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching latest news', err);
        this.isLoading = false;
      }
    });
  }

  /** تنسيق التاريخ */
  formatDate(date: string): string {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }
}
