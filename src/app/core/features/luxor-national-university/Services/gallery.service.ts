import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GalleryAttachment } from '../model/gallery.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private baseUrl = environment.apiUrl + 'gallaryattachments';

  constructor(private http: HttpClient) {}

  getAllGalleryAttachments(): Observable<GalleryAttachment[]> {
    return this.http.get<{ success: boolean; data: GalleryAttachment[] }>(`${this.baseUrl}/getall`)
      .pipe(map(response => response.data));
  }
}
