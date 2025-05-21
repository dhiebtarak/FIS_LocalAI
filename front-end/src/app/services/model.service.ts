import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private modelSubject = new BehaviorSubject<string>('Clearing-workflow');
  currentModel$ = this.modelSubject.asObservable();
  
  private availableModelsSubject = new BehaviorSubject<string[]>([]);
  availableModels$ = this.availableModelsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchAvailableModels();
  }

  getCurrentModel(): string {
    return this.modelSubject.value;
  }

  setCurrentModel(model: string): void {
    this.modelSubject.next(model);
  }

  fetchAvailableModels(): void {
    this.http.get<{ models: string[] }>('http://localhost:5000/models')
      .pipe(
        tap(response => console.log('API Response:', response)), // Add this line to log the raw response
        map(response => response.models),
        tap(models => console.log('Processed Models:', models)) // Add this line to log the processed models
      )
      .subscribe({
        next: (models) => {
          this.availableModelsSubject.next(models);
          console.log('Models available:', models); // Log when models are successfully received
          
          // Set first model as default if current model is not in the list
          if (models.length > 0 && !models.includes(this.getCurrentModel())) {
            console.log('Setting default model to:', models[0]);
            this.setCurrentModel(models[0]);
          }
        },
        error: (error) => {
          console.error('Failed to fetch models:', error);
          // Fallback to default models if API fails
          const fallbackModels = [
            'Clearing-workflow',
            'llama3:8b',
            'gemma:7b',
            'mixtral:8x7b'
          ];
          console.log('Using fallback models:', fallbackModels);
          this.availableModelsSubject.next(fallbackModels);
        }
      });
  }
}