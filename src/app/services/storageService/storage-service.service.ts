import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Transaction } from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEYS = {
    TRANSACTIONS: 'transactions',
    USER_SETTINGS: 'userSettings'
  }
  
  async setItem<T>(key: string, value: T): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value)
    });
  }

  async getItem<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  }

  async removeName(key: string): Promise<void> {
    await Preferences.remove({ key });
  }
  
  async clearStorage(): Promise<void> {
    await Preferences.clear();
  }

  // Método corregido para calcular el balance actual
  async getBalance(): Promise<{ income: number; expenses: number; total: number }> {
    try {
      const transactions = await this.getTransactions();
      
      // Inicializar los acumuladores
      let income = 0;
      let expenses = 0;
      
      // Procesar cada transacción
      transactions.forEach(transaction => {
        // Asegurar que amount es un número
        const amount = typeof transaction.amount === 'string' ? 
          Number(transaction.amount) : transaction.amount;
          
        if (transaction.type === 'income') {
          income += amount;
        } else if (transaction.type === 'expense') {
          expenses += amount;
        }
      });
      
      // Calcular el total (ingresos - gastos)
      const total = income - expenses;
      
      const balance = {
        income: income,
        expenses: expenses,
        total: total
      };
      
      return balance;
    } catch (error) {
      console.error('Error al calcular el balance:', error);
      return { income: 0, expenses: 0, total: 0 };
    }
  }
  
  // Método para guardar una nueva transacción
  async saveTransactions(newTransaction: Transaction): Promise<void> {
    try {
      const currentTransactions = await this.getTransactions();
      const transactionsArray = Array.isArray(currentTransactions) ? currentTransactions : [];
      
      // Asegurar que amount es número
      const transactionToSave = {
        ...newTransaction,
        amount: typeof newTransaction.amount === 'string' ? 
          Number(newTransaction.amount) : newTransaction.amount
      };
      
      const updatedTransactions = [...transactionsArray, transactionToSave];
  
      await Preferences.set({
        key: this.STORAGE_KEYS.TRANSACTIONS,
        value: JSON.stringify(updatedTransactions)
      });
  
      // Calcular y mostrar el balance actualizado
      const balance = await this.getBalance();
    } catch (error) {
      console.error('Error guardando transacción:', error);
      throw error;
    }
  }

  // Método para obtener todas las transacciones
  async getTransactions(): Promise<Transaction[]> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEYS.TRANSACTIONS });
      if (!value) return [];
      
      const parsed = JSON.parse(value);
      // Si es un objeto único, convertirlo en array
      if (!Array.isArray(parsed)) {
        return parsed.id ? [parsed] : [];
      }
      return parsed;
    } catch (error) {
      console.error('Error obteniendo transacciones:', error);
      return [];
    }
  }

  // Método para limpiar todas las transacciones
  async clearTransactions(): Promise<void> {
    try {
      await Preferences.remove({ key: this.STORAGE_KEYS.TRANSACTIONS });
    } catch (error) {
      console.error('Error al limpiar transacciones:', error);
      throw error;
    }
  }
}