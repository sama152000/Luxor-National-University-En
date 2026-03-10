import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Program } from '../model/program.model';
import { environment } from '../../../../../environments/environment';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private baseUrl = environment.apiUrl + 'program';

  constructor(private http: HttpClient) {}

  /** جلب كل البرامج */
  getAllPrograms(): Observable<Program[]> {
    return this.http.get<{ success: boolean; data: Program[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => {
        return response.data.map(program => ({
          ...program,
          slug: slugify(program.slug || program.pageTitle) // توليد slug لو مش موجود
        }));
      }));
  }

  /** جلب برنامج واحد بالـ slug */
  getProgramBySlug(slug: string): Observable<Program | undefined> {
    return this.getAllPrograms().pipe(
      map(programs => programs.find(p => p.slug === slug))
    );
  }

  /** جلب برنامج واحد بالـ id */
  getProgramById(id: string): Observable<Program | undefined> {
    return this.getAllPrograms().pipe(
      map(programs => programs.find(p => p.id === id))
    );
  }
}
