import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NewSavedStory, SavedStory, SavedStoryUpdate } from '../models/saved-story';

@Injectable({ providedIn: 'root' })
export class SavedStoriesApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/stories';

  list(): Observable<SavedStory[]> {
    return this.http.get<SavedStory[]>(this.endpoint);
  }

  get(id: number): Observable<SavedStory> {
    return this.http.get<SavedStory>(`${this.endpoint}/${id}`);
  }

  create(story: NewSavedStory): Observable<SavedStory> {
    return this.http.post<SavedStory>(this.endpoint, story);
  }

  update(id: number, updates: SavedStoryUpdate): Observable<SavedStory> {
    return this.http.patch<SavedStory>(`${this.endpoint}/${id}`, updates);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}