/* import { Component, OnInit,ChangeDetectorRef,ElementRef ,ViewChild,AfterViewInit } from '@angular/core'; */
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
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
/* 
@ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLDivElement>; */

  constructor(private newsService: NewsService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadLatestNews();
  }


getCurrentNews(): any {
    if (this.latestNews && this.latestNews.length > 0) {
      return this.latestNews[this.currentIndex];
    }
    return null;
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
          
        }
        this.cdr.detectChanges(); // إجبار التحديث
      },
      error: (err) => {
        console.error('Error fetching latest news', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /* private updateSliderPosition(): void {
    const slider = this.sliderContainer?.nativeElement;
    if (slider && this.latestNews.length > 0) {
      const translateValue = -this.currentIndex * 100;
      slider.style.transform = `translateX(${translateValue}%)`;
      console.log('Slider moved to:', translateValue);
    }
  } */


/** Move to the PREVIOUS slide safely */
  prevSlide(): void {
    console.log('prevSlide called, currentIndex:', this.currentIndex);
    
    if (!this.latestNews?.length) {
      console.warn('No news available');
      return;
    }
    
    this.currentIndex = (this.currentIndex - 1 + this.latestNews.length) % this.latestNews.length;
    console.log('New index:', this.currentIndex);
    console.log('Current news:', this.getCurrentNews());
    
    this.cdr.detectChanges(); // إجبار التحديث
    
  }

  nextSlide(): void {
    console.log('nextSlide called, currentIndex:', this.currentIndex);
    
    if (!this.latestNews?.length) {
      console.warn('No news available');
      return;
    }
    
    this.currentIndex = (this.currentIndex + 1) % this.latestNews.length;
    console.log('New index:', this.currentIndex);
    console.log('Current news:', this.getCurrentNews());
    
    this.cdr.detectChanges(); // إجبار التحديث
    
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


