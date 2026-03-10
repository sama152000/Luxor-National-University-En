import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from '../model/contact.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = environment.apiUrl + 'contacts';

  constructor(private http: HttpClient) {}

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<{ success: boolean; data: Contact[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => response.data));
  }
}
