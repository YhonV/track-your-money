export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category?: TransactionCategory;
  date: Date;
}

export type TransactionCategory = 'food' | 'transport' | 'entertainment' | 'bills' | 'education' | 'hospital';

export interface CategoryItem {
  value: TransactionCategory;
  icon: string;
  label: string;
}

export interface TransactionFormData {
  transaction: 'income' | 'spent';
  amount: number;
  category?: TransactionCategory;
}

export interface StorageItem {
  key: string;
  value: string;
}