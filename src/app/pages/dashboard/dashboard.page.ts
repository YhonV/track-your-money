import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { IonContent, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, add, walletOutline, alertOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { StorageService } from 'src/app/services/storageService/storage-service.service';
import { Transaction } from 'src/app/models/interfaces';
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
    IonIcon,
    IonGrid,
    IonRow, 
    IonCol,
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
    addIcons({chevronBackOutline,chevronForwardOutline,add,alertOutline,cashOutline,walletOutline});
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

  // Función para calcular el número total de páginas
  getPageCount(): number {
    return Math.ceil(this.transactions.length / this.itemsPerPage);
  }

  // Función para generar el array de paginación (1, 2, ..., n)
  getPaginationArray(): (number | string)[] {
    const pageCount = this.getPageCount();
    
    // Si hay pocas páginas, mostrar todas
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    
    // Si hay muchas páginas, mostrar 1, 2, ..., n-1, n
    const pages: (number | string)[] = [];
    
    // Siempre mostrar la primera página
    pages.push(1);
    
    // Mostrar páginas alrededor de la página actual
    if (this.currentPage > 2) {
      pages.push(2);
    }
    
    if (this.currentPage > 3) {
      pages.push('...');
    }
    
    // Páginas cercanas a la actual
    for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(pageCount - 1, this.currentPage + 1); i++) {
      if (i > 2 && i < pageCount - 1) {
        pages.push(i);
      }
    }
    
    if (this.currentPage < pageCount - 2) {
      pages.push('...');
    }
    
    if (this.currentPage < pageCount - 1) {
      pages.push(pageCount - 1);
    }
    
    // Siempre mostrar la última página
    pages.push(pageCount);
    
    return pages;
  }

  // Función para manejar el cambio de página
  changePage(page: string | number) {
    // Validar que la página esté dentro del rango válido
    if (typeof page === 'string') {
      return;
    }
    
    // Validar que la página esté dentro del rango válido
    if (page < 1 || page > this.getPageCount()) {
      return;
    }
    
    this.currentPage = page;
  }

  // Función para ver todas las transacciones (puedes implementarla como necesites)
  viewAllTransactions() {
    // Por ejemplo, podrías navegar a una página de transacciones o mostrar un modal
    console.log('Ver todas las transacciones');
    
    // Actualiza esta implementación según tus necesidades
    this.itemsPerPage = this.transactions.length;
    this.currentPage = 1;
  }
}