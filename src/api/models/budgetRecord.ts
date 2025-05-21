export type BudgetRecordDto = {
  id?: number;
  name: string;
  creationDate: Date;
  spendingDate: Date;
  budgetId: number;
  total: number;
  comment?: string;
};
