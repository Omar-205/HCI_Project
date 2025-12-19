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
    public dialogRef: DialogRef<string>, // Used to close and return a value
    @Inject(DIALOG_DATA) public data: {
      gates: string[];
    } // Used to receive passed data
  ) {

  }
  where = signal<boolean>(true);

  close(option: string) {
    this.dialogRef.close(option); // Closes dialog and returns "Result Data"
  }


}
