import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FooterData } from '../model/footer.model';
import { Contact } from '../model/contact.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private baseUrl = environment.apiUrl + 'contacts';

  constructor(private http: HttpClient) {}

  getFooterData(): Observable<FooterData> {
    return this.http.get<{ success: boolean; data: Contact[] }>(`${this.baseUrl}/getall`)
      .pipe(
        map(response => {
          const contact = response.data && response.data.length > 0 ? response.data[0] : null;
          return this.buildFooterData(contact);
        })
      );
  }

  private buildFooterData(contact: Contact | null): FooterData {
    // Build social links from contact info
    const socialLinks = [];
    if (contact?.facebook) {
      socialLinks.push({ platform: 'فيسبوك', url: contact.facebook, icon: 'fab fa-facebook-f' });
    }
    if (contact?.whatsApp) {
      socialLinks.push({ platform: 'واتساب', url: contact.whatsApp, icon: 'fab fa-whatsapp' });
    }

    return {
      id: '1',
      logo: {
        src: './assets/lnu.logo.png',
        alt: 'جامعة الأقصر الوطنية',
        title: 'شعار الجامعة'
      },
      description: 'جامعة الأقصر الوطنية ملتزمة بالتميز الأكاديمي، والبحث العلمي، وخدمة المجتمع.',
      sections: [
        {
          title: 'روابط هامة',
          links: [
            { label: 'عن الجامعة', url: '/about' },
            { label: 'الكليات', url: '/faculties' },
            { label: 'الأخبار والفعاليات', url: '/news' },
            { label: 'تواصل معنا', url: '/contactInfo' }
          ]
        }
      ],
      socialLinks: socialLinks,
      copyright: 'جامعة الأقصر الوطنية. جميع الحقوق محفوظة.',
      year: new Date().getFullYear()
    };
  }
}
