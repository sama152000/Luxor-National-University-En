import { Component, HostListener, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { LoaderConfig } from './core/features/luxor-national-university/model/home.model';
import { LoaderComponent } from './core/features/luxor-national-university/Pages/shared/loader/loader.component';
import { HomeService } from './core/features/luxor-national-university/Services/home.service';

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
  
  constructor(private homeService: HomeService) {}
  
  ngOnInit() {
    this.loaderConfig = this.homeService.getLoaderConfig();
    this.showLoader = this.loaderConfig.enabled;
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
