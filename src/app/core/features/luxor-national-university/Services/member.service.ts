import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Member } from '../model/member.model';
import { environment } from '../../../../../environments/environment';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private baseUrl = environment.apiUrl + 'member';

  constructor(private http: HttpClient) {}

  /** جلب كل الأعضاء */
  getAllMembers(): Observable<Member[]> {
    return this.http.get<{ success: boolean; data: Member[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => {
        return response.data.map(member => ({
          ...member,
          slug: slugify(member.fullName) // توليد slug من الاسم الكامل
        }));
      }));
  }

  /** جلب الرئيس فقط */
  getPresident(): Observable<Member | undefined> {
    return this.getAllMembers().pipe(
      map(members => members.find(m => m.isPresident))
    );
  }

  /** جلب الأعضاء حسب النوع */
  getMembersByType(type: string): Observable<Member[]> {
    return this.getAllMembers().pipe(
      map(members => members.filter(m => m.memberType === type))
    );
  }

  /** جلب عضو واحد بالـ id */
  getMemberById(id: string): Observable<Member | undefined> {
    return this.getAllMembers().pipe(
      map(members => members.find(m => m.id === id))
    );
  }
}
