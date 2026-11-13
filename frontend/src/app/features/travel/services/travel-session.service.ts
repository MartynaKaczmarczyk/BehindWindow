import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ExploreResponse, StoryState, TravelMode } from '../models/travel';
import { SIMULATION_ROUTE } from '../config/simulation-route';
import { GeolocationService } from './geolocation.service';
import { SpeechService } from './speech.service';
import { TravelApiService } from './travel-api.service';

@Injectable({ providedIn: 'root' })
export class TravelSessionService {
  private readonly api = inject(TravelApiService);
  private readonly geolocation = inject(GeolocationService);
  private readonly speech = inject(SpeechService);

  readonly activeMode = signal<TravelMode>(null);
  readonly voiceEnabled = signal(true);
  readonly storyState = signal<StoryState>({ kind: 'idle' });
  readonly isLoading = computed(() => this.storyState().kind === 'loading');
  readonly statusText = computed(() => {
    switch (this.activeMode()) {
      case 'gps': return 'Tryb GPS';
      case 'simulation': return 'Symulacja';
      default: return 'Wybierz tryb';
    }
  });
  readonly statusClass = computed(() => `status status--${this.activeMode() ?? 'idle'}`);

  private currentRouteStep = 0;

  selectMode(mode: Exclude<TravelMode, null>): void {
    if (mode === 'gps') {
      void this.startGpsMode();
      return;
    }

    void this.startSimulationMode();
  }

  setVoiceEnabled(enabled: boolean): void {
    this.voiceEnabled.set(enabled);
    if (!enabled) this.speech.stop();
  }

  private async startGpsMode(): Promise<void> {
    this.activeMode.set('gps');
    this.storyState.set({ kind: 'loading', message: 'Pobieram pozycję GPS…' });

    try {
      const position = await this.geolocation.getCurrentPosition();
      await this.loadStory(position.latitude, position.longitude, 'Twoja lokalizacja GPS');
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
      this.currentRouteStep = 0;
    }

    const stop = SIMULATION_ROUTE[this.currentRouteStep];
    const stopNumber = this.currentRouteStep + 1;
    this.currentRouteStep = (this.currentRouteStep + 1) % SIMULATION_ROUTE.length;
    const label = `${stop.name} · przystanek ${stopNumber} z ${SIMULATION_ROUTE.length}`;
    await this.loadStory(stop.latitude, stop.longitude, label);
  }

  private async loadStory(latitude: number, longitude: number, label: string): Promise<void> {
    const loadingMessage = label === 'Twoja lokalizacja GPS'
      ? 'Pobieram miejscowość i przygotowuję opowieść…'
      : `Pobieram dane dla: ${label}…`;
    this.storyState.set({ kind: 'loading', message: loadingMessage });

    try {
      const response: ExploreResponse = await firstValueFrom(this.api.explore(latitude, longitude));
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