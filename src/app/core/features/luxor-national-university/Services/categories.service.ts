import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** جلب كل التصنيفات */
  getCategories(): Observable<Category[]> {
    return this.http.get<{ success: boolean; data: Category[] }>(
      `${this.baseUrl}categories/getall`
    ).pipe(map(res => res.data));
  }

  /** جلب تصنيف واحد بالـ id */
  getCategoryById(id: string): Observable<Category | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(c => c.id === id))
    );
  }

  /** جلب تصنيف واحد بالاسم */
  getCategoryByName(name: string): Observable<Category | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(c => c.name === name))
    );
  }
}
