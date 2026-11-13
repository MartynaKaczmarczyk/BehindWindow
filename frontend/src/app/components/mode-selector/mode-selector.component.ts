import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TravelMode } from '../../models/travel';

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  templateUrl: './mode-selector.component.html',
  styleUrl: './mode-selector.component.css'
})
export class ModeSelectorComponent {
  @Input() activeMode: TravelMode = null;
  @Input() disabled = false;
  @Output() modeSelected = new EventEmitter<Exclude<TravelMode, null>>();
}