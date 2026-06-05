import { Component, HostListener, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { Meta } from '@angular/platform-browser';
import { LoaderConfig } from './core/features/luxor-national-university/model/home.model';
import { LoaderComponent } from './core/features/luxor-national-university/Pages/shared/loader/loader.component';
import { HomeService } from './core/features/luxor-national-university/Services/home.service';
import { LogosService } from './core/features/luxor-national-university/Services/logos.service';
import { Logo } from './core/features/luxor-national-university/model/logo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected title = 'Luxor National University';
  showScrollButton = false;
  showLoader: boolean = true;
  loaderConfig!: LoaderConfig;
  
  constructor(private homeService: HomeService, private meta: Meta, private logosService: LogosService) {}
  
  ngOnInit() {
    this.loaderConfig = this.homeService.getLoaderConfig();
    this.showLoader = this.loaderConfig.enabled;

    this.logosService.getAllLogos().subscribe({
      next: (logos: Logo[]) => {
        if (logos?.length > 0) {
          this.meta.updateTag({ property: 'og:image', content: logos[0].url });
          this.meta.updateTag({ name: 'twitter:image', content: logos[0].url });
          const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (favicon) {
            favicon.href = logos[0].url;
          }
        }
      },
      error: (err) => console.error('Error fetching logos', err)
    });
  }

  onLoadingComplete() {
    this.showLoader = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
