import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="navbar">
      <div class="left-nav">
        <div class="avatar">R1</div>
        <h2>Local AI Chat</h2>
      </div>
      <div class="right-nav">
        <div class="datetime" id="datetimeDisplay">{{ currentDateTime }}</div>
        <select 
          id="modelSelect" 
          [(ngModel)]="selectedModel" 
          (change)="onModelChange()">
          <option *ngFor="let model of availableModels" [value]="model">
            {{ model }}
          </option>
        </select>
        <select 
          id="themeSelect" 
          [(ngModel)]="selectedTheme" 
          (change)="onThemeChange()">
          <option *ngFor="let theme of availableThemes" [value]="theme.value">
            {{ theme.label }}
          </option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px var(--shadow-color);
      z-index: 10;
    }

    .left-nav, .right-nav {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--accent-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 14px;
    }

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .datetime {
      font-size: 14px;
      color: var(--text-color);
      opacity: 0.8;
    }

    select {
      padding: 6px 12px;
      border-radius: 4px;
      background-color: var(--input-bg);
      border: 1px solid var(--input-border);
      color: #bb86fc;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    select:hover {
      border-color: var(--accent-color);
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 8px 16px;
        flex-direction: column;
        gap: 8px;
      }

      .left-nav, .right-nav {
        width: 100%;
        justify-content: space-between;
      }

      .datetime {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentDateTime = '';
  selectedModel = '';
  selectedTheme = '';
  availableModels: string[] = [];
  
  availableThemes = [
    { value: 'theme-futuristic', label: 'Futuristic' },
    { value: 'theme-dark', label: 'Dark' },
  ];

  constructor(
    private themeService: ThemeService,
    private modelService: ModelService
  ) {}

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    
    this.modelService.currentModel$.subscribe(model => {
      this.selectedModel = model;
    });

    this.modelService.availableModels$.subscribe(models => {
      this.availableModels = models;
    });
    
    this.selectedTheme = this.themeService.getCurrentTheme();
  }

  updateDateTime() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    this.currentDateTime = now.toLocaleDateString('en-US', options);
  }

  onModelChange() {
    this.modelService.setCurrentModel(this.selectedModel);
  }

  onThemeChange() {
    this.themeService.setTheme(this.selectedTheme);
  }
}