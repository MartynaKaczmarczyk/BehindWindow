import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExploreResponse, StoryState } from '../../models/travel';
import { PlaceListComponent } from '../place-list/place-list.component';
import { SaveStoryButtonComponent } from '../save-story-button/save-story-button.component';

@Component({
  selector: 'app-story-panel',
  standalone: true,
  imports: [PlaceListComponent, SaveStoryButtonComponent],
  templateUrl: './story-panel.component.html',
  styleUrl: './story-panel.component.css'
})
export class StoryPanelComponent {
  @Input({ required: true }) state: StoryState = { kind: 'idle' };
  @Input() saving = false;
  @Input() saveMessage = '';
  @Output() saveRequested = new EventEmitter<ExploreResponse>();
}