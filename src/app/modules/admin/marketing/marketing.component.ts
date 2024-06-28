import { Component, inject } from '@angular/core';
import {  MatDialog } from '@angular/material/dialog';
import { MarketingPopupComponent } from './marketing-popup/marketing-popup.component'; 

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrl: './marketing.component.scss'
})
export class MarketingComponent {
  readonly dialog = inject(MatDialog);

  editMarkiting(){
    console.log('Edit user button clicked!');
    const dialogRef = this.dialog.open(MarketingPopupComponent);
    hasBackdrop : true
  }
}
