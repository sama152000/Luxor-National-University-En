// src/app/services/visitors.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VisitorsTotal } from '../model/visitors.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitorsService {
  private apiUrl = `${environment.apiUrl}vistors/total`;

  constructor(private http: HttpClient) {}

  getTotalViews(): Observable<VisitorsTotal> {
    return this.http.get<VisitorsTotal>(this.apiUrl);
  }
}
