import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHtml',
  standalone: true,
  pure: true,
})
export class TruncateHtmlPipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    limit: number = 150,
    trail: string = '...'
  ): string {
    if (!value) return '';

    // Strip HTML tags first
    const strippedHtml = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    if (strippedHtml.length <= limit) {
      return strippedHtml;
    }

    // Truncate and add trail
    return strippedHtml.substring(0, limit).trim() + trail;
  }
}
