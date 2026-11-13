import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NearbyPlace } from '../../models/travel';

@Component({
  selector: 'app-place-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './place-list.component.html',
  styleUrl: './place-list.component.css'
})
export class PlaceListComponent {
  @Input() places: NearbyPlace[] = [];
}