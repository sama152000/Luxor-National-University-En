import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../Services/news.service';
import { News } from '../../model/news.model';
import { Category } from '../../model/category.model';
import { CleanHtmlPipe } from "../../../../pipes/clean-html.pipe";

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe, RouterLink],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news: News[] = [];
  categories: Category[] = [];
  selectedCategory: string | null = null;
  isLoading: boolean = true;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadNews();
  }

  /** تحميل التصنيفات */
  loadCategories(): void {
    this.newsService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  /** تحميل الأخبار/الأحداث/الأنشطة */
  loadNews(): void {
    this.isLoading = true;

    // فلتر الباك إند
    const filter: any = {
      status: 'Published'
    };

    // لو فيه تصنيف محدد
    if (this.selectedCategory) {
      filter.categoryId = this.selectedCategory;
    }

    // جلب الصفحة الحالية فقط من الباك إند (Server-side pagination)
    this.newsService.getPagedNews(this.currentPage, this.itemsPerPage, filter).subscribe({
      next: (result) => {
        this.news = result.items; // Items are already sorted by the service
        this.totalItems = result.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching news', err);
        this.isLoading = false;
      }
    });
  }

  /** فلترة الأخبار حسب التصنيف */
  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadNews();
  }

  /** إلغاء الفلترة */
  clearFilter(): void {
    this.selectedCategory = null;
    this.currentPage = 1;
    this.loadNews();
  }

  /** التنقل بين الصفحات */
  nextPage(): void {
    if (this.canGoNext) {
      this.currentPage++;
      this.loadNews();
    }
  }

  prevPage(): void {
    if (this.canGoPrev) {
      this.currentPage--;
      this.loadNews();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadNews();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  get canGoPrev(): boolean {
    return this.currentPage > 1;
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
