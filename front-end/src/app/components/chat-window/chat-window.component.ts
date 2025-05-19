import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat-message.model';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chat-container">
      <div class="chat-window" #chatWindow>
        <div class="message-list">
          <div class="message {{ message.sender }}" *ngFor="let message of messages; trackBy: trackByFn">
            <p>{{ message.content }}</p>
          </div>
          <div class="scroll-anchor" #scrollAnchor></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    .chat-window {
      flex: 1;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      scrollbar-gutter: stable;
      position: relative;
    }

    .message-list {
      display: flex;
      flex-direction: column;
      padding: 16px;
      gap: 12px;
      /* Removed min-height to avoid forcing full height */
    }

    .message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 1px 2px var(--shadow-color);
      position: relative;
      /* Removed animation to prevent layout shifts */
    }

    .message.user {
      align-self: flex-end;
      background-color: var(--user-message-bg);
      border-bottom-right-radius: 2px;
      margin-left: auto;
    }

    .message.assistant {
      align-self: flex-start;
      background-color: var(--assistant-message-bg);
      border-bottom-left-radius: 2px;
      margin-right: auto;
    }

    .message p {
      margin: 0;
      line-height: 1.5;
      word-break: break-word;
    }

    .scroll-anchor {
      width: 1px;
      height: 1px;
      opacity: 0;
    }

    @media (max-width: 768px) {
      .message {
        max-width: 85%;
      }
    }

    /* Ensure consistent scrollbar styling */
    .chat-window::-webkit-scrollbar {
      width: 8px; /* Slightly wider for better visibility */
    }

    .chat-window::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }

    .chat-window::-webkit-scrollbar-thumb {
      background: var(--accent-color);
      border-radius: 4px;
    }

    .chat-window::-webkit-scrollbar-thumb:hover {
      background: var(--highlight-color);
    }
  `]
})
export class ChatWindowComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatWindow') private chatWindowRef!: ElementRef;
  @ViewChild('scrollAnchor') private scrollAnchorRef!: ElementRef;
  messages: ChatMessage[] = [];
  private shouldScrollToBottom = true;
  private isUserScrolling = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.messages$.subscribe(messages => {
      const chatWindow = this.chatWindowRef?.nativeElement;
      if (chatWindow) {
        // Only set shouldScrollToBottom if user is near the bottom or it's a new session
        this.shouldScrollToBottom = this.isScrolledToBottom(chatWindow) || messages.length === 0;
      }
      this.messages = messages;
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom && !this.isUserScrolling) {
      this.scrollToBottom();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const chatWindow = this.chatWindowRef.nativeElement;
    this.isUserScrolling = !this.isScrolledToBottom(chatWindow);
    if (!this.isUserScrolling) {
      this.shouldScrollToBottom = true;
    }
  }

  trackByFn(index: number, message: ChatMessage): string {
    return `${message.sender}-${index}`; // Use timestamp if available
  }

  private isScrolledToBottom(element: HTMLElement): boolean {
    const threshold = 50; // Reduced threshold for more precise detection
    return element.scrollHeight - element.scrollTop - element.clientHeight <= threshold;
  }

  private scrollToBottom(): void {
    try {
      const chatWindow = this.chatWindowRef.nativeElement;
      // Use scrollTop for instant scroll to avoid smooth scroll conflicts
      chatWindow.scrollTop = chatWindow.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}