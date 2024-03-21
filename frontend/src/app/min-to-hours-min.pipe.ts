import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'minToHoursMin'
})
export class MinToHoursMinPipe implements PipeTransform {

  transform(value: number): string {
    if (value === null || value === undefined) return '';

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    // Format: "XhY" - e.g., "2h15"
    return `${hours}h${minutes}`;
  }
}
