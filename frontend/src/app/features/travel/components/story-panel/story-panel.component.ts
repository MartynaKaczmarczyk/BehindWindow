import { Component, Input } from '@angular/core';
import { StoryState } from '../../models/travel';
import { PlaceListComponent } from '../place-list/place-list.component';

@Component({
  selector: 'app-story-panel',
  standalone: true,
  imports: [PlaceListComponent],
  templateUrl: './story-panel.component.html',
  styleUrl: './story-panel.component.css'
})
export class StoryPanelComponent {
  @Input({ required: true }) state: StoryState = { kind: 'idle' };
}