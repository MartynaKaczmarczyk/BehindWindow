import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ExploreResponse } from '../../models/travel';
import { TravelSessionService } from '../../services/travel-session.service';
import { SavedStoriesApiService } from '../../../saved-stories/services/saved-stories-api.service';
import { ModeSelectorComponent } from '../mode-selector/mode-selector.component';
import { StoryPanelComponent } from '../story-panel/story-panel.component';
import { VoiceToggleComponent } from '../voice-toggle/voice-toggle.component';
import { MusicPlayerComponent } from '../../../../shared/components/music-player/music-player.component';

@Component({
  selector: 'app-travel-page',
  standalone: true,
  imports: [ModeSelectorComponent, StoryPanelComponent, VoiceToggleComponent, MusicPlayerComponent],
  templateUrl: './travel-page.component.html',
  styleUrl: './travel-page.component.css'
})
export class TravelPageComponent {
  protected readonly session = inject(TravelSessionService);
  private readonly savedStoriesApi = inject(SavedStoriesApiService);
  protected readonly isSavingStory = signal(false);
  protected readonly saveMessage = signal('');

  protected async saveStory(story: ExploreResponse): Promise<void> {
    this.isSavingStory.set(true);
    this.saveMessage.set('');

    try {
      await firstValueFrom(this.savedStoriesApi.create({
        name: story.featuredPlace ? `${story.town} — ${story.featuredPlace.title}` : story.town,
        town: story.town,
        aiStory: story.aiStory,
        featuredPlace: story.featuredPlace
      }));
      this.saveMessage.set('Opowieść zapisana.');
    } catch {
      this.saveMessage.set('Nie udało się zapisać opowieści. Spróbuj ponownie.');
    } finally {
      this.isSavingStory.set(false);
    }
  }
}