import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, signal } from '@angular/core';

@Component({
  selector: 'app-map-modal',
  imports: [],
  templateUrl: './map-modal.html',
  styleUrl: './map-modal.css',
})
export class MapModal {
  constructor(
    public dialogRef: DialogRef<any[]>, // Used to close and return a value
    @Inject(DIALOG_DATA) public data: {
      gates: string[];
    } // Used to receive passed data
  ) {

  }
  where = signal<boolean>(true);

  Map: any[] = [];
  close(option: string) {
    if (option == "Tram" || option === 'Bus') {
      this.Procede.set(true)
      this.Map.push(option)
    }
    else {
      this.Map.push(option)
      this.dialogRef.close(this.Map);
    }// Closes dialog and returns "Result Data"
  }

  Tram_Bus = signal<boolean>(false);
  Procede = signal<boolean>(false);
}
