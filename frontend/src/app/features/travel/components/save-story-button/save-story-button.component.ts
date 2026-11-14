import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-save-story-button',
  standalone: true,
  templateUrl: './save-story-button.component.html',
  styleUrl: './save-story-button.component.css'
})
export class SaveStoryButtonComponent {
  @Input() saving = false;
  @Input() message = '';
  @Output() saveRequested = new EventEmitter<void>();
}