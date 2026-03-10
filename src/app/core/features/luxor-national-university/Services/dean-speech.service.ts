import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DeanSpeech } from '../model/dean-speech.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeanSpeechService {
  private baseUrl = environment.apiUrl + 'deanspeechs';

  constructor(private http: HttpClient) {}

  /** جلب كل خطابات العميد */
  getAllDeanSpeeches(): Observable<DeanSpeech[]> {
    return this.http.get<{ success: boolean; data: DeanSpeech[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => response.data));
  }

  /** جلب خطاب عميد واحد بالـ memberId */
  getDeanSpeechByMemberId(memberId: string): Observable<DeanSpeech | undefined> {
    return this.getAllDeanSpeeches().pipe(
      map(speeches => speeches.find(s => s.memberId === memberId))
    );
  }

  /** جلب أول خطاب (مثلاً الرئيسي) */
  getMainDeanSpeech(): Observable<DeanSpeech | undefined> {
    return this.getAllDeanSpeeches().pipe(
      map(speeches => speeches.length > 0 ? speeches[0] : undefined)
    );
  }
}
