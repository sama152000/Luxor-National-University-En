// src/app/services/visitors.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VisitorsTotal, VisitorsMonth, VisitorsToday } from '../model/visitors.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitorsService {
  private totalUrl = `${environment.apiUrl}vistors/total`;
  private monthUrl = `${environment.apiUrl}vistors/month`;
  private todayUrl = `${environment.apiUrl}vistors/today`;

  constructor(private http: HttpClient) {}

  getTotalViews(): Observable<VisitorsTotal> {
    return this.http.get<VisitorsTotal>(this.totalUrl);
  }

  getMonthViews(): Observable<VisitorsMonth> {
    return this.http.get<VisitorsMonth>(this.monthUrl);
  }

  getTodayViews(): Observable<VisitorsToday> {
    return this.http.get<VisitorsToday>(this.todayUrl);
  }
}
