import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { InputAreaComponent } from './components/input-area/input-area.component';
import { FuturisticCubeComponent } from './components/futuristic-cube/futuristic-cube.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ChatWindowComponent,
    InputAreaComponent,
    FuturisticCubeComponent
  ],
  template: `
    <app-futuristic-cube></app-futuristic-cube>
    <div class="app-container">
      <app-navbar></app-navbar>
      <div class="main-container">
        <div class="chat-layout">
          <app-chat-window></app-chat-window>
          <app-input-area></app-input-area>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      width: 100vw;
      position: relative;
      z-index: 1;
    }

    .main-container {
      flex: 1;
      padding: 16px;
      overflow: auto;
      display: flex;
      justify-content: center;
    }

    .chat-layout {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 1000px;
      
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      box-shadow: 0 4px 12px var(--shadow-color);
      overflow: auto;
    }

    @media (max-width: 768px) {
      .main-container {
        padding: 8px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Initialize the theme from localStorage
    this.themeService.initializeTheme();
  }
}