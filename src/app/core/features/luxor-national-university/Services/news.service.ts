import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { News } from '../model/news.model';
import { environment } from '../../../../../environments/environment';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = environment.apiUrl + 'posts';

  constructor(private http: HttpClient) {}

  /** جلب كل الأخبار مع توليد slug */
  getAllNews(): Observable<News[]> {
    return this.http.get<{ success: boolean; data: News[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => {
        return response.data.map(post => ({
          ...post,
          slug: slugify(post.urlTitleEn || post.title)
        }));
      }));
  }

  /** فلترة الأخبار حسب التصنيف */
  getNewsByCategory(categoryName: string): Observable<News[]> {
    return this.getAllNews().pipe(
      map(posts => posts.filter(post =>
        post.postCategories.some(cat => cat.categoryName === categoryName)
      ))
    );
  }

  /** جلب خبر واحد بالـ slug */
  getNewsBySlug(slug: string): Observable<News | undefined> {
    return this.getAllNews().pipe(
      map(posts => posts.find(post => post.slug === slug))
    );
  }

  /** باقي الميثودات (related, prev, next, latest) زي ما هي */


  /** جلب خبر واحد بالـ id */
  getNewsById(id: string): Observable<News | undefined> {
    return this.getAllNews().pipe(
      map(posts => posts.find(post => post.id === id))
    );
  }

  /** جلب الأخبار المرتبطة */
  getRelatedNews(newsId: string, limit: number = 4): Observable<News[]> {
    return this.getAllNews().pipe(
      map(posts => {
        const current = posts.find(p => p.id === newsId);
        if (!current) return [];
        const categoryIds = current.postCategories.map(c => c.categoryId);
        return posts
          .filter(p => p.id !== newsId && p.postCategories.some(c => categoryIds.includes(c.categoryId)))
          .slice(0, limit);
      })
    );
  }

  /** جلب الخبر السابق */
  getPreviousNews(newsId: string): Observable<News | undefined> {
    return this.getAllNews().pipe(
      map(posts => {
        const index = posts.findIndex(p => p.id === newsId);
        return index > 0 ? posts[index - 1] : undefined;
      })
    );
  }

  /** جلب الخبر التالي */
  getNextNews(newsId: string): Observable<News | undefined> {
    return this.getAllNews().pipe(
      map(posts => {
        const index = posts.findIndex(p => p.id === newsId);
        return index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined;
      })
    );
  }

  /** جلب آخر 4 أخبار للـ Home حسب publishedDate */
  getLatestNews(limit: number = 4): Observable<News[]> {
    return this.getAllNews().pipe(
      map(posts =>
        posts
          .filter(p => p.type === 'News')
          .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
          .slice(0, limit)
      )
    );
  }

  /** جلب آخر 4 أحداث (Events) */
  getLatestEvents(limit: number = 4): Observable<News[]> {
    return this.getAllNews().pipe(
      map(posts =>
        posts
          .filter(p => p.type === 'Events')
          .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
          .slice(0, limit)
      )
    );
  }
}
