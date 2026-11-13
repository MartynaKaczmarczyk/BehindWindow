import { Component, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ExploreResponse, StoryState, TravelMode } from './models/travel';
import { GeolocationService } from './services/geolocation.service';
import { SpeechService } from './services/speech.service';
import { TravelApiService } from './services/travel-api.service';
import { ModeSelectorComponent } from './components/mode-selector/mode-selector.component';
import { StoryPanelComponent } from './components/story-panel/story-panel.component';
import { VoiceToggleComponent } from './components/voice-toggle/voice-toggle.component';

@Component({
  selector: 'app-root',
  imports: [ModeSelectorComponent, StoryPanelComponent, VoiceToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  private readonly api = inject(TravelApiService);
  private readonly geolocation = inject(GeolocationService);
  private readonly speech = inject(SpeechService);

  protected readonly activeMode = signal<TravelMode>(null);
  protected readonly voiceEnabled = signal(true);
  protected readonly storyState = signal<StoryState>({ kind: 'idle' });
  protected readonly isLoading = computed(() => this.storyState().kind === 'loading');
  protected readonly statusText = computed(() => {
    switch (this.activeMode()) {
      case 'gps': return 'Tryb GPS';
      case 'simulation': return 'Symulacja';
      default: return 'Wybierz tryb';
    }
  });
  protected readonly statusClass = computed(() => `status status--${this.activeMode() ?? 'idle'}`);

  private currentStep = 0;
  private readonly routeStops = [
    { name: 'Gdańsk Główny', lat: 54.3520, lon: 18.6466 },
    { name: 'Pruszcz Gdański', lat: 54.2602, lon: 18.6368 },
    { name: 'Tczew', lat: 54.0924, lon: 18.7778 },
    { name: 'Malbork', lat: 54.0359, lon: 19.0266 },
    { name: 'Iława Główna', lat: 53.7570, lon: 19.5731 }
  ];

  protected onModeSelected(mode: Exclude<TravelMode, null>): void {
    if (mode === 'gps') {
      void this.startGpsMode();
      return;
    }

    void this.startSimulationMode();
  }

  protected onVoiceChanged(enabled: boolean): void {
    this.voiceEnabled.set(enabled);
    if (!enabled) this.speech.stop();
  }

  private async startGpsMode(): Promise<void> {
    this.activeMode.set('gps');
    this.storyState.set({ kind: 'loading', message: 'Pobieram pozycję GPS…' });

    try {
      const position = await this.geolocation.getCurrentPosition();
      await this.fetchStory(position.latitude, position.longitude, 'Twoja lokalizacja GPS');
    } catch (error) {
      this.storyState.set({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Nie udało się pobrać lokalizacji GPS.'
      });
    }
  }

  private async startSimulationMode(): Promise<void> {
    if (this.activeMode() !== 'simulation') {
      this.activeMode.set('simulation');
      this.currentStep = 0;
    }

    const stop = this.routeStops[this.currentStep];
    const label = `${stop.name} · przystanek ${this.currentStep + 1} z ${this.routeStops.length}`;
    this.currentStep = (this.currentStep + 1) % this.routeStops.length;
    await this.fetchStory(stop.lat, stop.lon, label);
  }

  private async fetchStory(lat: number, lon: number, label: string): Promise<void> {
    const message = label === 'Twoja lokalizacja GPS'
      ? 'Pobieram miejscowość i przygotowuję opowieść…'
      : `Pobieram dane dla: ${label}…`;
    this.storyState.set({ kind: 'loading', message });

    try {
      const response: ExploreResponse = await firstValueFrom(this.api.explore(lat, lon));
      this.storyState.set({ kind: 'story', label, data: response });
      if (this.voiceEnabled()) this.speech.speak(`${response.town}. ${response.aiStory}`);
    } catch {
      this.storyState.set({
        kind: 'error',
        message: 'Nie udało się pobrać opowieści. Sprawdź połączenie z serwerem i spróbuj ponownie.'
      });
    }
  }
}
