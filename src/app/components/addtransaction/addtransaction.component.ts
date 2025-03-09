import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonIcon,
  IonNote,
  IonButtons,
  IonCard,
  IonCardContent,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  restaurantOutline,
  carOutline,
  gameControllerOutline,
  receiptOutline,
  schoolOutline,
  medicalOutline,
  saveOutline,
  closeOutline,
  arrowDownCircleOutline,
  arrowUpCircleOutline
} from 'ionicons/icons';
import { CategoryItem, TransactionCategory, TransactionFormData } from 'src/app/models/interfaces';

@Component({
  selector: 'app-addtransaction',
  templateUrl: './addtransaction.component.html',
  styleUrls: ['./addtransaction.component.scss'],
  standalone: true,
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
    IonIcon,
    IonNote,
    IonButtons,
    IonCard,
    IonCardContent,
    IonSegment,
    IonSegmentButton
  ]
})
export class AddtransactionComponent  implements OnInit {

  expense: TransactionFormData = {
    transaction: 'income',
    amount: 0,
    category: undefined
  };


  categories: CategoryItem[] = [
    { value: 'food', icon: 'restaurant', label: 'Comida' },   
    { value: 'transport', icon: 'car', label: 'Transporte' },
    { value: 'entertainment', icon: 'game-controller', label: 'Entretenimiento' },
    { value: 'bills', icon: 'receipt', label: 'Facturas' },
    { value: 'education', icon: 'school', label: 'Educación' },
    { value: 'hospital', icon: 'medical', label: 'Hospital' }
  ] as const;

  constructor(private modalController: ModalController) {
    addIcons({
      restaurantOutline,   
      carOutline,
      gameControllerOutline,
      receiptOutline,
      schoolOutline,
      medicalOutline,
      saveOutline,
      closeOutline,
      arrowDownCircleOutline,
      arrowUpCircleOutline
    });

  }

  ngOnInit() {
    console.log('Categories:', this.categories);
    console.log('Es array?:', Array.isArray(this.categories));  }

  isValid(): boolean {
    const isValidAmount = this.expense.amount > 0;
    const isValidCategory = this.expense.transaction === 'income' ||
                          (this.expense.transaction === 'spent' && !!this.expense.category)
    return isValidAmount && isValidCategory;
  }

  async save(){
    if (!this.isValid()) return;

    const transaction = {
      id: Date.now().toString(),
      type: this.expense.transaction === 'income' ? 'income' : 'expense',
      amount: this.expense.amount,
      category: this.expense.category,
      date: new Date()
    };

    await this.modalController.dismiss(transaction);
  }

  cancel() {
    this.modalController.dismiss();
  }

  trackByFn(index: number, item: any): string {
    return item.value;
  }
}
