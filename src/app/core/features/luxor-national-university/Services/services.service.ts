import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Service } from '../model/service.model';
import { environment } from '../../../../../environments/environment';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private baseUrl = environment.apiUrl + 'services';

  constructor(private http: HttpClient) {}

  /** جلب كل الخدمات */
  getAllServices(): Observable<Service[]> {
    return this.http.get<{ success: boolean; data: Service[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => {
        return response.data.map(service => ({
          ...service,
          slug: slugify(service.slug || service.title)
        }));
      }));
  }

  /** جلب خدمة واحدة بالـ slug */
  getServiceBySlug(slug: string): Observable<Service | undefined> {
    return this.getAllServices().pipe(
      map(services => services.find(s => s.slug === slug))
    );
  }

  /** جلب الخدمات النشطة فقط */
  getActiveServices(): Observable<Service[]> {
    return this.getAllServices().pipe(
      map(services => services.filter(s => s.isActive))
    );
  }
}
