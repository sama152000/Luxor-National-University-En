/**
 * Error Handler Service
 * Centralized error handling and logging
 */
import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { HttpStatus } from '../../../../core/enums/app.enums';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private messageService = inject(MessageService, { optional: true });

  /**
   * Handle HTTP errors
   */
  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client Error:', error.error.message);
    } else {
      // Server-side error
      errorMessage = this.getServerErrorMessage(error);
      console.error(`Server Error: ${error.status}\nMessage: ${error.message}`);
    }

    // Show error toast
    this.showErrorToast(errorMessage);
  }

  /**
   * Get user-friendly error message based on status code
   */
  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case HttpStatus.BAD_REQUEST:
        return error.error?.message || 'Invalid request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized access';
      case HttpStatus.FORBIDDEN:
        return 'Access denied';
      case HttpStatus.NOT_FOUND:
        return 'Requested content not found';
      case HttpStatus.REQUEST_TIMEOUT:
        return 'Request timed out';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Server error';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'Service is currently unavailable';
      case 0:
        return 'Unable to connect to the server. Please check your internet connection';
      default:
        return error.error?.message || 'An unexpected error occurred';
    }
  }

  /**
   * Show error toast notification
   */
  private showErrorToast(message: string): void {
    if (this.messageService) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    }
  }

  /**
   * Handle custom errors
   */
  handleCustomError(message: string): void {
    console.error('Custom Error:', message);
    this.showErrorToast(message);
  }
}
