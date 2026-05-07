import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin, of } from 'rxjs';
import { News, PostCategory } from '../model/news.model';
import { Category } from '../model/category.model';
import { environment } from '../../../../../environments/environment';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = environment.apiUrl + 'posts';
  private categoriesUrl = environment.apiUrl + 'categories';

  constructor(private http: HttpClient) {}

  /** جلب الأخبار بالـ pagination مع فلترة */
  getPagedNews(pageNumber: number, pageSize: number, filter: any = {}): Observable<{ items: News[]; totalCount: number }> {
    const body = {
      pageNumber,
      pageSize,
      filter,
      orderByValue: [
        { colId: 'publishedDate', sort: 'desc' }
      ]
    };

    return this.http.post<any>(`${this.baseUrl}/getpaged`, body).pipe(
      map(response => {
        // API returns paginated and filtered data
        const items = (Array.isArray(response.data) ? response.data : response.data.items || []).map((post: News) => ({
          ...post,
          slug: slugify(post.urlTitleEn || post.title)
        }));

        return {
          items,
          totalCount: response.totalCount || items.length
        };
      })
    );
  }

  /** جلب كل التصنيفات */
  getCategories(): Observable<Category[]> {
    return this.http.get<{ success: boolean; data: Category[] }>(`${this.categoriesUrl}/getall`).pipe(
      map(response => response.data)
    );
  }

  /** جلب خبر واحد بالـ id */
  getNewsById(id: string): Observable<News> {
    return this.http.get<{ success: boolean; data: News }>(`${this.baseUrl}/get/${id}`).pipe(
      map(response => ({
        ...response.data,
        slug: slugify(response.data.urlTitleEn || response.data.title)
      }))
    );
  }

  /** الأخبار المرتبطة */
  getRelatedNews(newsId: string, limit: number = 4): Observable<News[]> {
    return this.getPagedNews(1, 50).pipe(
      map(result => {
        const posts = result.items;
        const current = posts.find((p: News) => p.id === newsId);
        if (!current) return [];
        const categoryIds = current.postCategories.map((c: PostCategory) => c.categoryId);
        return posts
          .filter((p: News) => p.id !== newsId && p.postCategories.some((c: PostCategory) => categoryIds.includes(c.categoryId)))
          .slice(0, limit);
      })
    );
  }

  /** الخبر السابق */
  getPreviousNews(newsId: string): Observable<News | undefined> {
    return this.getPagedNews(1, 50).pipe(
      map(result => {
        const posts = result.items;
        const index = posts.findIndex((p: News) => p.id === newsId);
        return index > 0 ? posts[index - 1] : undefined;
      })
    );
  }

  /** الخبر التالي */
  getNextNews(newsId: string): Observable<News | undefined> {
    return this.getPagedNews(1, 50).pipe(
      map(result => {
        const posts = result.items;
        const index = posts.findIndex((p: News) => p.id === newsId);
        return index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined;
      })
    );
  }

  /** جلب آخر الأخبار للـ Home */
  getLatestNews(limit: number = 4): Observable<News[]> {
    return this.getPagedNews(1, limit, { type: 'News', status: 'Published' }).pipe(
      map(result =>
        result.items.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      )
    );
  }

  /** جلب آخر الأحداث (Events) */
  getLatestEvents(limit: number = 4): Observable<News[]> {
    return this.getPagedNews(1, limit, { type: 'Events', status: 'Published' }).pipe(
      map(result =>
        result.items.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      )
    );
  }
}
