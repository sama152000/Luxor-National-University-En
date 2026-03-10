import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AboutUniversityService } from '../../Services/about-university.service';
import { AboutUniversitySection } from '../../model/about-university.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-about-university',
  standalone: true,
  imports: [CommonModule, RouterLink, CleanHtmlPipe],
  templateUrl: './about-university.component.html',
  styleUrls: ['./about-university.component.css']
})
export class AboutUniversityComponent implements OnInit {
  section: AboutUniversitySection | null = null;
  activeTab: string = 'overview';
  isLoading = false;

  tabs = [
    { id: 'overview', title: 'نبذة عامة', icon: 'pi pi-home' },
    { id: 'vision', title: 'الرؤية', icon: 'pi pi-eye' },
    { id: 'mission', title: 'الرسالة', icon: 'pi pi-flag' },
    { id: 'goals', title: 'الأهداف', icon: 'pi pi-bullseye' },
    { id: 'history', title: 'تاريخ الجامعة', icon: 'pi pi-clock' }
  ];

  constructor(
    private aboutService: AboutUniversityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.route.url.subscribe(urlSegments => {
      const tab = urlSegments[1]?.path || 'overview';
      this.setActiveTab(tab);
    });
  }

  loadData(): void {
    this.aboutService.getAboutData().subscribe(data => {
      this.section = data;
    });
  }

  setActiveTab(tabId: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.activeTab = tabId;
      this.isLoading = false;
    }, 200);
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }
}
