import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeroSection } from '../model/hero-section.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroSectionsService {
  private baseUrl = environment.apiUrl + 'herosections';

  constructor(private http: HttpClient) {}

  getAllHeroSections(): Observable<HeroSection[]> {
    return this.http.get<{ success: boolean; data: HeroSection[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => response.data));
  }
}
