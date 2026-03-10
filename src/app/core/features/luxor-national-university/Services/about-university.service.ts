import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AboutUniversitySection } from '../model/about-university.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AboutUniversityService {
  private baseUrl = environment.apiUrl + 'about';

  constructor(private http: HttpClient) {}

  getAboutData(): Observable<AboutUniversitySection> {
    return this.http.get<{ success: boolean; data: AboutUniversitySection[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => response.data[0]));
  }
}
