import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-input-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-area">
      <!-- Dual input for TinyLlama -->
      <div class="input-template" *ngIf="isTinyLlamaModel" id="dualInputTemplate">
        <div class="dual-input-container">
          <textarea 
            #ccpInput
            [(ngModel)]="ccpMessage" 
            placeholder="CCP New Trade Message..."
            (keydown)="handleKeyDown($event)"></textarea>
          <textarea 
            #operationInput
            [(ngModel)]="operationMessage" 
            placeholder="Operation Message..."
            (keydown)="handleKeyDown($event)"></textarea>
        </div>
      </div>
      
      <!-- Single input for other models -->
      <div class="input-template" *ngIf="!isTinyLlamaModel" id="singleInputTemplate">
        <textarea 
          #singleInput
          [(ngModel)]="singleMessage" 
          placeholder="Type your message..."
          (keydown)="handleKeyDown($event)"></textarea>
      </div>
      
      <button id="sendBtn" (click)="sendMessage()">Send</button>
    </div>
  `,
  styles: [`
    .input-area {
      padding: 16px;
      border-top: 1px solid var(--input-border);
      background-color: rgba(0, 0, 0, 0.2);
    }

    .input-template {
      margin-bottom: 12px;
    }

    textarea {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid var(--input-border);
      background-color: var(--input-bg);
      color: var(--text-color);
      resize: none;
      font-size: 15px;
      transition: all 0.2s ease;
    }

    .dual-input-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    textarea:focus {
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.2);
    }

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 6px;
      background-color: var(--accent-color);
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    button:hover {
      background-color: var(--highlight-color);
      transform: translateY(-1px);
    }

    button:active {
      transform: translateY(1px);
    }

    @media (max-width: 768px) {
      .dual-input-container {
        grid-template-columns: 1fr;
      }

      textarea {
        min-height: 60px;
      }
    }
  `]
})
export class InputAreaComponent implements OnInit {
  @ViewChild('ccpInput') ccpInputRef!: ElementRef;
  @ViewChild('operationInput') operationInputRef!: ElementRef;
  @ViewChild('singleInput') singleInputRef!: ElementRef;

  ccpMessage = '';
  operationMessage = '';
  singleMessage = '';
  isTinyLlamaModel = false;

  constructor(
    private chatService: ChatService,
    private modelService: ModelService
  ) {}

  ngOnInit() {
    this.modelService.currentModel$.subscribe(model => {
      this.isTinyLlamaModel = model === 'tinyllama:latest';
      // Focus the appropriate input after rendering
      setTimeout(() => this.focusInput(), 0);
    });
  }

  focusInput() {
    if (this.isTinyLlamaModel && this.ccpInputRef) {
      this.ccpInputRef.nativeElement.focus();
    } else if (!this.isTinyLlamaModel && this.singleInputRef) {
      this.singleInputRef.nativeElement.focus();
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    // Send message when Enter is pressed (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    let prompt = '';

    if (this.isTinyLlamaModel) {
      const ccpMessage = this.ccpMessage.trim();
      const operationMessage = this.operationMessage.trim();
      if (!ccpMessage && !operationMessage) return;
      
      prompt = `CCP New Trade Message: ${ccpMessage} SGW Full Service Operation Message: ${operationMessage}`;
      this.ccpMessage = '';
      this.operationMessage = '';
    } else {
      const message = this.singleMessage.trim();
      if (!message) return;
      
      prompt = message;
      this.singleMessage = '';
    }

    this.chatService.sendMessage(prompt);
    this.focusInput();
  }
}