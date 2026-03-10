import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { CleanHtmlPipe } from '../../../../../../core/pipes/clean-html.pipe';
import { TruncateHtmlPipe } from '../../../../../../core/pipes/truncate-html.pipe';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, CleanHtmlPipe, TruncateHtmlPipe],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  latestEvents: News[] = [];
  isLoading = true;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadLatestEvents();
  }

  loadLatestEvents(): void {
    this.isLoading = true;
    this.newsService.getLatestEvents(4).subscribe({
      next: (events) => {
        this.latestEvents = events;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching events', err);
        this.isLoading = false;
      }
    });
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }
}
