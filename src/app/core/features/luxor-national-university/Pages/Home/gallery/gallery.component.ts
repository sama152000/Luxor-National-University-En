import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../../Services/gallery.service';
import { GalleryAttachment } from '../../../model/gallery.model';
import { Subscription } from 'rxjs';

const IMAGES_PER_SLIDE_DESKTOP = 8;
const IMAGES_PER_SLIDE_MOBILE  = 1;
const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  galleryItems: GalleryAttachment[] = [];
  slides: GalleryAttachment[][] = [];
  currentSlide: number = 0;
  isAnimating: boolean = false;
  slideDirection: 'next' | 'prev' = 'next';
  isMobile: boolean = false;

  selectedImage: GalleryAttachment | null = null;
  currentImageIndex: number = 0;
  isLightboxOpen: boolean = false;

  private subscription = new Subscription();

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    this.loadGalleryImages();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadGalleryImages(): void {
    const sub = this.galleryService.getAllGalleryAttachments().subscribe({
      next: (images) => {
        this.galleryItems = images;
        this.buildSlides();
      },
      error: (error) => {
        console.error('Error loading gallery images:', error);
      }
    });
    this.subscription.add(sub);
  }

  private buildSlides(): void {
    const imagesPerSlide = this.isMobile ? IMAGES_PER_SLIDE_MOBILE : IMAGES_PER_SLIDE_DESKTOP;
    this.slides = [];
    for (let i = 0; i < this.galleryItems.length; i += imagesPerSlide) {
      this.slides.push(this.galleryItems.slice(i, i + imagesPerSlide));
    }
    this.currentSlide = 0;
  }

  get totalSlides(): number {
    return this.slides.length;
  }

  goToSlide(index: number): void {
    if (this.isAnimating || index === this.currentSlide) return;
    this.slideDirection = index > this.currentSlide ? 'next' : 'prev';
    this.isAnimating = true;
    this.currentSlide = index;
    setTimeout(() => (this.isAnimating = false), 400);
  }

  prevSlide(): void {
    const target = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(target);
  }

  nextSlide(): void {
    const target = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(target);
  }

  openLightbox(image: GalleryAttachment): void {
    this.selectedImage = image;
    this.currentImageIndex = this.galleryItems.findIndex(item => item.id === image.id);
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    this.selectedImage = null;
    document.body.style.overflow = 'auto';
  }

  previousImage(): void {
    if (this.galleryItems.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
      this.selectedImage = this.galleryItems[this.currentImageIndex];
    }
  }

  nextImage(): void {
    if (this.galleryItems.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryItems.length;
      this.selectedImage = this.galleryItems[this.currentImageIndex];
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    if (wasMobile !== this.isMobile) {
      this.buildSlides();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.isLightboxOpen) {
      switch (event.key) {
        case 'Escape':   this.closeLightbox();   break;
        case 'ArrowLeft':  this.previousImage(); break;
        case 'ArrowRight': this.nextImage();     break;
      }
    } else {
      switch (event.key) {
        case 'ArrowLeft':  this.prevSlide(); break;
        case 'ArrowRight': this.nextSlide(); break;
      }
    }
  }

  onLightboxBackgroundClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeLightbox();
    }
  }
}
