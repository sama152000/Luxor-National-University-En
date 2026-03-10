import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../Services/contact.service';
import { Contact } from '../../../model/contact.model';
import { Language } from '../../../model/common.model';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent implements OnInit {
  contactInfo: Contact | null = null;
  languages: Language[] = [
    { code: 'en', name: 'EN', active: false },
    { code: 'ar', name: 'عربي', active: true }
  ];

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.contactService.getAllContacts().subscribe({
      next: (contacts: Contact[]) => {
        if (contacts && contacts.length > 0) {
          this.contactInfo = contacts[0];
        }
      }
    });
  }

  switchLanguage(languageCode: string) {
    this.languages = this.languages.map(lang => ({
      ...lang,
      active: lang.code === languageCode
    }));
  }
}
