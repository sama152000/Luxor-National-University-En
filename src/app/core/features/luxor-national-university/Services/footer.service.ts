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
      socialLinks.push({ platform: 'Facebook', url: contact.facebook, icon: 'fab fa-facebook-f' });
    }
    if (contact?.whatsApp) {
      socialLinks.push({ platform: 'WhatsApp', url: contact.whatsApp, icon: 'fab fa-whatsapp' });
    }

    return {
      id: '1',
      logo: {
        src: './assets/lnu.logo.png',
        alt: 'Luxor National University',
        title: 'University Logo'
      },
      description: 'Luxor National University is committed to academic excellence, scientific research, and community service.',
      sections: [
        {
          title: 'Important Links',
          links: [
            { label: 'About the University', url: '/about' },
            { label: 'Faculties', url: '/faculties' },
            { label: 'News and Events', url: '/news' },
            { label: 'Contact Us', url: '/contactInfo' }
          ]
        }
      ],
      socialLinks: socialLinks,
      copyright: 'Luxor National University. All rights reserved.',
      year: new Date().getFullYear()
    };
  }
}
