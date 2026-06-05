import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { GalleryAttachment } from '../model/gallery.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private baseUrl = environment.apiUrl + 'gallaryattachments';

  // Cache the HTTP result so re-subscribing (e.g. on component re-init) reuses
  // the same response instead of firing a new request and re-shuffling images.
  private attachments$: Observable<GalleryAttachment[]> | null = null;

  constructor(private http: HttpClient) {}

  getAllGalleryAttachments(): Observable<GalleryAttachment[]> {
    if (!this.attachments$) {
      this.attachments$ = this.http
        .get<{ success: boolean; data: GalleryAttachment[] }>(`${this.baseUrl}/getall`)
        .pipe(
          map(response => response.data),
          // Shuffle once here so every subscriber gets the same stable order
          map(data => [...data].sort(() => Math.random() - 0.5)),
          shareReplay(1)
        );
    }
    return this.attachments$;
  }
}
