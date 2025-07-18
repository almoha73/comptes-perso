export interface Transaction {
  id: string;
  amount: number;
  accountId: string;
  category: string;
  type: 'expense' | 'income';
}
