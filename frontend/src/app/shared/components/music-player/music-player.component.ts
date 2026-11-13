import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-music-player',
  standalone: true,
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.css'
})
export class MusicPlayerComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly isPlaying = signal(false);
  protected readonly playerUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube-nocookie.com/embed/mm0QSsRwzUo?autoplay=1&controls=1&playsinline=1&start=389&list=RDmm0QSsRwzUo'
  );

  protected togglePlayback(): void {
    this.isPlaying.update(playing => !playing);
  }
}