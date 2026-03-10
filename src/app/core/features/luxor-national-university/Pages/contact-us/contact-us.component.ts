import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContactService } from '../../Services/contact.service';
import { LogosService } from '../../Services/logos.service';
import { Contact } from '../../model/contact.model';
import { Logo } from '../../model/logo.model';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  contacts: Contact[] = [];
  logo: string = './assets/lnu.logo.png';
  isSubmitting = false;
  isSubmitted = false;
  private destroy$ = new Subject<void>();
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private logosService: LogosService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadContactData();
    this.loadLogo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  private loadContactData(): void {
    this.contactService.getAllContacts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.contacts = data,
        error: (err) => console.error('Error fetching contacts', err)
      });
  }

  private loadLogo(): void {
    const sub = this.logosService.getAllLogos().subscribe({
      next: (logos: Logo[]) => {
        if (logos && logos.length > 0) {
          this.logo = logos[0].url || './assets/lnu.logo.png';
        }
      },
      error: (error) => {
        console.error('Error loading logo:', error);
      }
    });
    this.subscription.add(sub);
  }

  // onSubmit(): void {
  //   if (this.contactForm.valid && !this.isSubmitting) {
  //     this.isSubmitting = true;
  //     const formData = this.contactForm.value;

  //     // هنا ممكن تبعت الفورم للـ API لو عندك endpoint خاص بالـ contact form
  //     this.contactService.submitContactForm(formData)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: () => {
  //           this.isSubmitted = true;
  //           this.isSubmitting = false;
  //           this.contactForm.reset();
  //         },
  //         error: () => {
  //           this.isSubmitting = false;
  //         }
  //       });
  //   }
  // }

  // getFieldError(fieldName: string): string {
  //   const field = this.contactForm.get(fieldName);
  //   if (field && field.errors && field.touched) {
  //     if (field.errors['required']) return `${fieldName} مطلوب`;
  //     if (field.errors['email']) return 'البريد الإلكتروني غير صحيح';
  //     if (field.errors['minlength']) return `${fieldName} قصير جداً`;
  //   }
  //   return '';
  // }

  // isFieldInvalid(fieldName: string): boolean {
  //   const field = this.contactForm.get(fieldName);
  //   return !!(field && field.errors && field.touched);
  // }

  trackByContact(index: number, contact: Contact): string {
    return contact.id;
  }
}
