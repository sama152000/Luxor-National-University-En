import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stat } from '../model/stats.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private baseUrl = environment.apiUrl + 'statistics';

  constructor(private http: HttpClient) {}

  getAllStats(): Observable<Stat[]> {
    return this.http.get<{ success: boolean; data: Stat[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => response.data));
  }
}
