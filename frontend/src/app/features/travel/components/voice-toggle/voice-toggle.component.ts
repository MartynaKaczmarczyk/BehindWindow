import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-voice-toggle',
  standalone: true,
  templateUrl: './voice-toggle.component.html',
  styleUrl: './voice-toggle.component.css'
})
export class VoiceToggleComponent {
  @Input() enabled = true;
  @Output() enabledChange = new EventEmitter<boolean>();

  protected onChange(event: Event): void {
    this.enabledChange.emit((event.target as HTMLInputElement).checked);
  }
}