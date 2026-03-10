import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DiscoverService } from '../../../Services/discover.service';
import { Journal } from '../../../model/discover.model';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  journal: Journal | null = null;
  safePdfUrl: SafeResourceUrl | null = null;

  constructor(
    private discoverService: DiscoverService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.discoverService.getLatestJournal().subscribe({
      next: (data) => {
        this.journal = data || null;
        if (this.journal && this.journal.journalAttachments && this.journal.journalAttachments.length > 0) {
          this.safePdfUrl = this.getSafePdfUrl(this.journal.journalAttachments[0].url);
        }
      },
      error: (err) => console.error('Error fetching journal', err)
    });
  }

  getSafePdfUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
