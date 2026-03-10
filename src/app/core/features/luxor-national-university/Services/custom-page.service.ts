import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CustomPage, ApiResponse } from '../model/custom-page.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomPageService {

  private apiUrl = environment.apiUrl + 'customepages';

  constructor(private http: HttpClient) {}

  // Get all custom pages
  getAllPages(): Observable<CustomPage[]> {
    return this.http.get<ApiResponse<CustomPage[]>>(`${this.apiUrl}/getall`).pipe(
      map(response => response.data)
    );
  }

  // Get single page by slug
  getPageBySlug(slug: string): Observable<CustomPage> {
    return this.http.get<ApiResponse<CustomPage>>(`${this.apiUrl}/get/${slug}`).pipe(
      map(response => response.data)
    );
  }
}
