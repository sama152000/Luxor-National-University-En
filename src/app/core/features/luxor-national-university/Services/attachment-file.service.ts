import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { AttachmentFile, AttachmentFileApiResponse } from '../model/attachment-file.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentFileService {
  private baseUrl = environment.apiUrl + 'attachmentfiles';

  // Cache to avoid duplicate requests across components
  private attachments$: Observable<AttachmentFile[]> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Fetches all public attachment files from the API.
   * Result is cached so multiple subscribers share a single HTTP call.
   */
  getAll(): Observable<AttachmentFile[]> {
    if (!this.attachments$) {
      this.attachments$ = this.http
        .get<AttachmentFileApiResponse>(`${this.baseUrl}/getall`)
        .pipe(
          map(response => response.data),
          shareReplay(1)
        );
    }
    return this.attachments$;
  }

  /**
   * Returns attachment files filtered by folder name (e.g. 'avatars').
   */
  getByFolder(folderName: string): Observable<AttachmentFile[]> {
    return this.getAll().pipe(
      map(files => files.filter(f => f.folderName === folderName))
    );
  }

  /**
   * Clears the in-memory cache so the next call re-fetches from the API.
   */
  clearCache(): void {
    this.attachments$ = null;
  }
}
