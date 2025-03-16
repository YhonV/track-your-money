import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { IonContent } from '@ionic/angular/standalone';
import {
      IonCard, 
      IonCardContent,
      IonCardHeader, 
      IonCardTitle, 
      IonList, 
      IonItem, 
      IonIcon, 
      IonLabel, 
      IonGrid,
      IonRow,
      IonCol,
      IonNote,
      IonFab,
      IonFabButton} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, addCircleOutline, add, walletOutline, alertOutline } from 'ionicons/icons';
import { StorageService } from 'src/app/services/storageService/storage-service.service';
import { Transaction } from 'src/app/models/interfaces';
import { BehaviorSubject } from 'rxjs';
import { AddtransactionComponent } from 'src/app/components/addtransaction/addtransaction.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    CommonModule, 
    FormsModule, 
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonNote,
    IonFab,
    IonFabButton,
    NgxPaginationModule
  ]
})
export class DashboardPage implements OnInit {
  // Variables para almacenar datos de balance y transacciones
  income: number = 0;
  expenses: number = 0;
  balance: number = 0;
  transactions: Transaction[] = [];
  items: any[] = [];
  currentPage: number = 1; 
  itemsPerPage: number = 5;

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) {
    addIcons({add,alertOutline,cashOutline,addCircleOutline,walletOutline});
  }

  async ngOnInit() {
    await this.loadData();
  }
  
  async ionViewWillEnter() {
    await this.loadData();
  }

  private async loadData() {
    try {
      // Cargar transacciones
      this.transactions = await this.storageService.getTransactions();
      
      // Procesar transacciones para la visualización
      this.transactions = this.transactions.map(t => ({
        ...t,
        amount: typeof t.amount === 'string' ? Number(t.amount) : t.amount,
        date: new Date(t.date)
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Obtener balance
      const balanceData = await this.storageService.getBalance();
      this.income = balanceData.income;
      this.expenses = balanceData.expenses;
      this.balance = balanceData.total;
      
      console.log('Datos cargados:', {
        income: this.income,
        expenses: this.expenses,
        balance: this.balance,
        transactions: this.transactions.length
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }

  async openTransactionModal() {
    const modal = await this.modalCtrl.create({
      component: AddtransactionComponent
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        await this.handleNewTransaction(result.data);
      }
    });

    return await modal.present();
  }

  private async handleNewTransaction(transaction: Transaction) {
    try {
      // Verificar fondos suficientes
      if (transaction.type === 'expense') {
        const currentBalance = await this.storageService.getBalance();
        const transactionAmount = typeof transaction.amount === 'string' ? 
          Number(transaction.amount) : transaction.amount;
          
        if (transactionAmount > currentBalance.total) {
          await this.showErrorAlert();
          return;
        }
      }

      // Guardar la transacción
      await this.storageService.saveTransactions(transaction);
      
      // Recargar datos
      await this.loadData();
      
      // Mostrar confirmación
      await this.showSuccessToast();
    } catch (error) {
      console.error('Error al manejar transacción:', error);
      await this.showErrorAlert();
    }
  }

  private async showErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Warning!!',
      subHeader: 'Invalid Amount',
      message: 'You can\'t spend more than your balance',
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showSuccessToast() {
    const toast = await this.toastController.create({
      header: 'Transaction saved successfully',
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }

  async cleanTransactions() {
    this.storageService.clearStorage();
  }
}