import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar-component',
  imports: [],
  templateUrl: './snack-bar-component.html',
  styleUrl: './snack-bar-component.css',
})
export class SnackBarComponent {
  mydata = ""
  constructor(
    public snackRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: string
  ) {
    this.mydata = data
  }

}
