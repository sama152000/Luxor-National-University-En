import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../Services/news.service';
import { CategoriesService } from '../../Services/categories.service';
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
  filteredNews: News[] = [];
  categories: Category[] = [];
  selectedCategory: string | null = null;
  isLoading: boolean = true;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6; // عدد الأخبار في الصفحة
  totalItems: number = 0;
  paginatedNews: News[] = [];
  usePagination: boolean = true; // دايمًا نستخدم pagination

  constructor(
    private newsService: NewsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadNews();
  }

  /** تحميل التصنيفات من الـ API */
  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  /** تحميل الأخبار من الـ API */
  loadNews(): void {
    this.isLoading = true;
    this.newsService.getAllNews().subscribe({
      next: (data) => {
        // ترتيب الأخبار من الأحدث للأقدم
        this.news = data.sort((a, b) => 
          new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
        );
        this.filteredNews = this.news; 
        this.currentPage = 1;
        this.updatePagination();
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
    this.filteredNews = this.news.filter(post =>
      post.postCategories.some(cat => cat.categoryId === categoryId)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  /** إلغاء الفلترة */
  clearFilter(): void {
    this.selectedCategory = null;
    this.filteredNews = this.news;
    this.currentPage = 1;
    this.updatePagination();
  }

  /** تحديث التقسيم على الصفحات */
  updatePagination(): void {
    this.totalItems = this.filteredNews.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedNews = this.filteredNews.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  get canGoPrev(): boolean {
    return this.currentPage > 1;
  }
}
