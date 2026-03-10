import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Department, DepartmentDetail, DepartmentMember, DepartmentProgram } from '../model/faculty.model';
import { environment } from '../../../../../environments/environment';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** جلب كل الأقسام */
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<{ success: boolean; data: Department[] }>(`${this.baseUrl}departments/getall`)
      .pipe(map(response => {
        return response.data.map(dep => ({
          ...dep,
          slug: slugify(dep.slug || dep.pageTitle)
        }));
      }));
  }

  /** جلب تفاصيل الأقسام */
  getDepartmentDetails(): Observable<DepartmentDetail[]> {
    return this.http.get<{ success: boolean; data: DepartmentDetail[] }>(`${this.baseUrl}departmentdetails/getall`)
      .pipe(map(response => response.data));
  }

  /** جلب أعضاء الأقسام */
  getDepartmentMembers(): Observable<DepartmentMember[]> {
    return this.http.get<{ success: boolean; data: DepartmentMember[] }>(`${this.baseUrl}departmentmembers/getall`)
      .pipe(map(response => response.data));
  }

  /** جلب برامج الأقسام */
  getDepartmentPrograms(): Observable<DepartmentProgram[]> {
    return this.http.get<{ success: boolean; data: DepartmentProgram[] }>(`${this.baseUrl}departmentprograms/getall`)
      .pipe(map(response => {
        return response.data.map(prog => ({
          ...prog,
          slug: slugify(prog.slug || prog.programName)
        }));
      }));
  }

  /** جلب 4 أقسام فقط للصفحة الرئيسية */
  get4Departments(): Observable<Department[]> {
    return this.http.get<{ success: boolean; data: Department[] }>(`${this.baseUrl}departments/getall`)
      .pipe(map(response => {
        return response.data
          .slice(0, 4)
          .map(dep => ({
            ...dep,
            slug: slugify(dep.slug || dep.pageTitle)
          }));
      }));
  }
}
