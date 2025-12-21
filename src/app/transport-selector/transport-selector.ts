import { Component } from '@angular/core';

@Component({
  selector: 'app-transport-selector',
  templateUrl: './transport-selector.html',
  styleUrls: ['./transport-selector.css']
})
export class TransportSelectorComponent {
  selected: 'bus' | 'tram' | 'train' = 'train';
  select(mode: 'bus' | 'tram' | 'train') {
    this.selected = mode;
    // In real app: emit event or navigate to different data
  }
}
