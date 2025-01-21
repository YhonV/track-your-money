export interface ITransaction {
    amount: number;
    category?: string;
    transaction: 'income' | 'spent';
    date: string;
  }