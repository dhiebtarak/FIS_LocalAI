// src/app/services/chat.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { ModelService } from './model.service';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();
  backendUrl: string = environment.BACKEND_URL;

  constructor(private modelService: ModelService) {}

  sendMessage(content: string): void {
    if (!content.trim()) {
      console.warn('Empty message ignored');
      return;
    }

    // Add user message
    const userMessageId = this.addMessage('user', content);

    // Add placeholder for assistant response
    const assistantMessageId = this.addMessage('assistant', 'Thinking…');

    // Stream assistant response
    const model = this.modelService.getCurrentModel();
    this.streamResponse(content, model, assistantMessageId).catch((err) => {
      console.error('Stream failed:', err);
      this.updateAssistantMessage(assistantMessageId, `Error: ${err.message}`);
    });
  }

  private addMessage(sender: 'user' | 'assistant', content: string): number {
    const messages = [...this.messagesSubject.value];
    const id = messages.length; // Simple ID generation; consider UUID for concurrency
    const message: ChatMessage = { id, sender, content };
    messages.push(message);
    this.messagesSubject.next(messages);
    return id;
  }

  private updateAssistantMessage(id: number, content: string): void {
    const messages = [...this.messagesSubject.value];
    const index = messages.findIndex((msg) => msg.id === id);
    if (index === -1) {
      console.warn(`Message with ID ${id} not found`);
      return;
    }
    messages[index] = { ...messages[index], content };
    this.messagesSubject.next(messages);
  }

  private async streamResponse(
    prompt: string,
    model: string,
    assistantMessageId: number
  ): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      this.updateAssistantMessage(assistantMessageId, 'Error: Request timed out');
    }, 30000); // 30-second timeout

    try {
      const response = await fetch(`${this.backendUrl}/stream_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullResponse = '';

      // Clear placeholder
      this.updateAssistantMessage(assistantMessageId, '');

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          clearTimeout(timeoutId);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' without trimming
            if (data === '[DONE]') {
              clearTimeout(timeoutId);
              return;
            }
            fullResponse += data;
            this.updateAssistantMessage(assistantMessageId, fullResponse);
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw new Error(`Stream error: ${err.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}