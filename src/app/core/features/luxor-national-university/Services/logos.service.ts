import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logo } from '../model/logo.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogosService {
  private baseUrl = environment.apiUrl + 'logos';

  constructor(private http: HttpClient) {}

  getAllLogos(): Observable<Logo[]> {
    return this.http.get<{ success: boolean; data: Logo[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => response.data));
  }
}
