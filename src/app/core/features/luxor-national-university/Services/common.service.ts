import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContactInfo, Language } from '../model/common.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private currentLanguageSubject = new BehaviorSubject<string>('ar');
  public currentLanguage$: Observable<string> = this.currentLanguageSubject.asObservable();

  constructor() {}

  getContactInfo(): ContactInfo {
    return {
      phone: '+20 88 123 4567',
      email: 'info@lnu.edu.eg',
      website: 'www.lnu.edu.eg'
    };
  }

  getLanguages(): Language[] {
    return [
      { code: 'en', name: 'EN', active: false },
      { code: 'ar', name: 'عربي', active: true }
    ];
  }

  switchLanguage(languageCode: string): void {
    this.currentLanguageSubject.next(languageCode);
    // Implement language switching logic here
    document.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }
}