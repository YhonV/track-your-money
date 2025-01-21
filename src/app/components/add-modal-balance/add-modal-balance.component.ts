import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { 
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonCard, 
  IonCardContent,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonToast
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowDownOutline, 
  arrowUpOutline, 
  carOutline, 
  gameControllerOutline, 
  medicalOutline, 
  receiptOutline, 
  restaurantOutline, 
  schoolOutline,
  globe } from 'ionicons/icons';

@Component({
  selector: 'app-add-modal-balance',
  templateUrl: './add-modal-balance.component.html',
  styleUrls: ['./add-modal-balance.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonToast
  ],
  standalone: true,
})
export class AddModalBalanceComponent  implements OnInit {
  expense = {
    amount: 0,
    category: 'Select Category',
    transaction: 'Select a transaction'
  };

  constructor(private modalCtrl: ModalController) {
    addIcons({
      'restaurant-outline': restaurantOutline,
      'medical-outline': medicalOutline,
      'receipt-outline': receiptOutline,
      'game-controller-outline': gameControllerOutline,
      'car-outline': carOutline,
      'arrow-up-outline': arrowUpOutline,
      'school-outline': schoolOutline,
      'arrow-down-outline': arrowDownOutline,
      'globe': globe
    })
   }

  ngOnInit() {}

  isValid(): boolean {
    return this.expense.transaction !== 'Select a transaction' &&
    this.expense.amount > 0 &&
    (this.expense.transaction === 'income' || (this.expense.transaction === 'spent' && this.expense.category !== 'Select Category'))
  }

  async save() {
    await this.modalCtrl.dismiss(this.expense);
  }

  async cancel() {
    await this.modalCtrl.dismiss(null);
  }
}
