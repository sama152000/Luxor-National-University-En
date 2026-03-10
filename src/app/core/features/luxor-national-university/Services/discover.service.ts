import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Journal } from '../model/discover.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscoverService {
  private baseUrl = environment.apiUrl + 'journals';

  constructor(private http: HttpClient) {}

  /** جلب كل المجلات */
  getAllJournals(): Observable<Journal[]> {
    return this.http.get<{ success: boolean; data: Journal[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => response.data));
  }

  /** جلب مجلة واحدة بالـ id */
  getJournalById(id: string): Observable<Journal | undefined> {
    return this.getAllJournals().pipe(
      map(journals => journals.find(j => j.id === id))
    );
  }

  /** جلب أحدث مجلة */
  getLatestJournal(): Observable<Journal | undefined> {
    return this.getAllJournals().pipe(
      map(journals => {
        return journals.sort((a, b) => 
          new Date(b.pubishedDate).getTime() - new Date(a.pubishedDate).getTime()
        )[0];
      })
    );
  }
}
