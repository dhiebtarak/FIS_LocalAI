import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('theme-futuristic');
  currentTheme$ = this.themeSubject.asObservable();

  constructor() {}

  initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'theme-futuristic';
    this.setTheme(savedTheme);
  }

  getCurrentTheme(): string {
    return this.themeSubject.value;
  }

  setTheme(theme: string): void {
    // Remove all theme classes
    document.documentElement.className = '';
    
    // Add the new theme class
    document.documentElement.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update the subject
    this.themeSubject.next(theme);
  }
}