import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonCard, 
        IonCardContent,
        IonCardHeader, 
        IonCardTitle, 
        IonList, 
        IonItem, 
        IonIcon, 
        IonLabel, 
        IonButton, 
        IonAlert} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, addCircleOutline, globe } from 'ionicons/icons';
import { AddModalBalanceComponent } from 'src/app/components/add-modal-balance/add-modal-balance.component';
import { StorageService } from 'src/app/services/storageService/storage-service.service';
import { ITransaction } from 'src/app/models/transaction.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
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
    IonButton,
    IonAlert
  ]
})
export class DashboardPage implements OnInit{
  income: number = 0;
  spent: number = 0;
  message: string = '';
  error: boolean = false;
  isAlertOpen = false;
  public alertButtons = ['OK'];

  constructor(
    private modalCtrl : ModalController,
    private storageService : StorageService) {
    addIcons({
      'cash-outline': cashOutline,
      'add-circle-outline': addCircleOutline,
      'globe': globe
    })
   }

  async ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      // Cargar income
      const savedIncome = await this.storageService.getName('income');
      if (savedIncome) {
        let transactions: ITransaction[] = [];
        try {
          const parsed = JSON.parse(savedIncome);
          transactions = Array.isArray(parsed) ? parsed : [];
          this.income = transactions.length > 0 ? 
            transactions.reduce((acc, curr) => acc + curr.amount, 0) : 0;
        } catch (e) {
          console.error('Error parsing income:', e);
          this.income = 0;
        }
      }
  
      // Cargar expenses
      const savedExpenses = await this.storageService.getName('expenses');
      if (savedExpenses) {
        let transactions: ITransaction[] = [];
        try {
          const parsed = JSON.parse(savedExpenses);
          transactions = Array.isArray(parsed) ? parsed : [];
          this.spent = transactions.length > 0 ? 
            transactions.reduce((acc, curr) => acc + curr.amount, 0) : 0;
        } catch (e) {
          console.error('Error parsing expenses:', e);
          this.spent = 0;
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.income = 0;
      this.spent = 0;
    }
  }

  // Agregar método para manejar alert
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  async addIncome(data: any){
      try {
        let savedIncomes = await this.storageService.getName('income');
        console.log('Saved incomes:', savedIncomes);
        
        // Asegurar que es un array
        let incomes: ITransaction[] = [];
        
        if (savedIncomes) {
          try {
            const parsed = JSON.parse(savedIncomes);
            incomes = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error('Error parsing incomes:', e);
            incomes = [];
          }
        }
        
        // Crear nueva transacción
        const newTransaction: ITransaction = {
          amount: data.amount,
          transaction: data.transaction,
          date: new Date().toISOString()
        };
        
        incomes.push(newTransaction);
        
        await this.storageService.setName({
          key: 'income',
          value: JSON.stringify(incomes)
        });
        
        this.income += data.amount;
        await this.loadData(); // Recargar datos
        
      } catch (error) {
        console.error('Error handling income:', error);
      }
  }

  async addExpenses(data: any){
      try {
        // Validar saldo
        if (data.amount > this.income) {
          this.error = true;
          this.setOpen(true);
          return;
        }
    
        // 1. Actualizar expenses
        let savedExpenses = await this.storageService.getName('expenses');
        let expenses: ITransaction[] = [];
        
        if (savedExpenses) {
          try {
            const parsed = JSON.parse(savedExpenses);
            expenses = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error('Error parsing expenses:', e);
            expenses = [];
          }
        }
    
        const newExpense: ITransaction = {
          amount: data.amount,
          transaction: data.transaction,
          category: data.category,
          date: new Date().toISOString()
        };
    
        expenses.push(newExpense);
    
        // 2. Actualizar income
        let savedIncomes = await this.storageService.getName('income');
        let incomes: ITransaction[] = [];
        
        if (savedIncomes) {
          try {
            const parsed = JSON.parse(savedIncomes);
            incomes = Array.isArray(parsed) ? parsed : [];
            // Actualizar último income
            if (incomes.length > 0) {
              incomes[incomes.length - 1].amount -= data.amount;
            }
          } catch (e) {
            console.error('Error parsing incomes:', e);
          }
        }
    
        // 3. Guardar cambios
        await Promise.all([
          this.storageService.setName({
            key: 'expenses',
            value: JSON.stringify(expenses)
          }),
          this.storageService.setName({
            key: 'income',
            value: JSON.stringify(incomes)
          })
        ]);
    
        // 4. Actualizar vista
        this.spent += data.amount;
        this.income -= data.amount;
        
        await this.loadData();
    
      } catch (error) {
        console.error('Error handling expense:', error);
      }
  }


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddModalBalanceComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log(`Data recibida ${JSON.stringify(data)}`)

    if(data === null){
      return;
    }
    if(data.transaction === 'income'){
      this.addIncome(data);
    } else{
      this.addExpenses(data)
    }}
}