import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SavedStory } from '../../models/saved-story';
import { SavedStoriesApiService } from '../../services/saved-stories-api.service';

@Component({
  selector: 'app-saved-stories-page',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './saved-stories-page.component.html',
  styleUrl: './saved-stories-page.component.css'
})
export class SavedStoriesPageComponent implements OnInit {
  private readonly api = inject(SavedStoriesApiService);

  protected readonly stories = signal<SavedStory[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly editingId = signal<number | null>(null);
  protected readonly updatingId = signal<number | null>(null);
  protected editName = '';
  protected editAiStory = '';

  ngOnInit(): void {
    void this.loadStories();
  }

  protected async loadStories(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      this.stories.set(await firstValueFrom(this.api.list()));
    } catch {
      this.errorMessage.set('Nie udało się pobrać zapisanych opowieści.');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected startEditing(story: SavedStory): void {
    this.editingId.set(story.id);
    this.editName = story.name;
    this.editAiStory = story.aiStory;
    this.errorMessage.set('');
  }

  protected cancelEditing(): void {
    this.editingId.set(null);
    this.editName = '';
    this.editAiStory = '';
  }

  protected async saveChanges(id: number): Promise<void> {
    const name = this.editName.trim();
    const aiStory = this.editAiStory.trim();
    if (!name || !aiStory) {
      this.errorMessage.set('Nazwa i treść opowieści nie mogą być puste.');
      return;
    }

    this.updatingId.set(id);
    this.errorMessage.set('');
    try {
      const updatedStory = await firstValueFrom(this.api.update(id, { name, aiStory }));
      this.stories.update(stories => stories.map(story => story.id === id ? updatedStory : story));
      this.cancelEditing();
    } catch {
      this.errorMessage.set('Nie udało się zapisać zmian.');
    } finally {
      this.updatingId.set(null);
    }
  }

  protected async deleteStory(id: number): Promise<void> {
    this.errorMessage.set('');
    try {
      await firstValueFrom(this.api.delete(id));
      this.stories.update(stories => stories.filter(story => story.id !== id));
      if (this.editingId() === id) this.cancelEditing();
    } catch {
      this.errorMessage.set('Nie udało się usunąć opowieści.');
    }
  }
}