import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { NavigationItem, NavigationData } from '../model/navigation.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private http: HttpClient) {}

  getNavigationItems(): Observable<NavigationItem[]> {
    return this.http.get<NavigationData>(`${environment.apiUrl}menus/getall`).pipe(
      map(res => {
        // ✅ تصفية العناصر التي لها parentId (التي هي عناصر فرعية) وإبقاء فقط العناصر الرئيسية + العناصر الفرعية المضافة كأولاد
        const filteredItems = res.data.filter(item => !item.parentId);
        
        // ✅ ترتيب العناصر حسب الـ order
        return filteredItems.sort((a, b) => a.order - b.order);
      })
    );
  }
}
