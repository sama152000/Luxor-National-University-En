import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../../Services/gallery.service';
import { GalleryAttachment } from '../../../model/gallery.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  galleryItems: GalleryAttachment[] = [];
  selectedImage: GalleryAttachment | null = null;
  currentImageIndex: number = 0;
  isLightboxOpen: boolean = false;
  private subscription = new Subscription();

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.loadGalleryImages();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadGalleryImages(): void {
    const sub = this.galleryService.getAllGalleryAttachments().subscribe({
      next: (images) => {
        this.galleryItems = images;
        // Add staggered animation delay
        setTimeout(() => {
          this.addStaggeredAnimation();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading gallery images:', error);
      }
    });
    this.subscription.add(sub);
  }

  private addStaggeredAnimation(): void {
    const imageElements = document.querySelectorAll('.gallery-item');
    imageElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('fade-in');
      }, index * 100);
    });
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isLightboxOpen) return;

    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
    }
  }

  onLightboxBackgroundClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeLightbox();
    }
  }
}
