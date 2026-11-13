import { Component, inject } from '@angular/core';
import { ModeSelectorComponent } from './features/travel/components/mode-selector/mode-selector.component';
import { StoryPanelComponent } from './features/travel/components/story-panel/story-panel.component';
import { VoiceToggleComponent } from './features/travel/components/voice-toggle/voice-toggle.component';
import { MusicPlayerComponent } from './shared/components/music-player/music-player.component';
import { TravelSessionService } from './features/travel/services/travel-session.service';

@Component({
  selector: 'app-root',
  imports: [ModeSelectorComponent, StoryPanelComponent, VoiceToggleComponent, MusicPlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  protected readonly travelSession = inject(TravelSessionService);
}
