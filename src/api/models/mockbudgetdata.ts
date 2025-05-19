import { BudgetDto } from './budget';
import { BudgetRecordDto } from './budgetRecord';
import { BudgetResultDto } from './budgetResult';

export const mockBudgets: BudgetDto[] = [
  { id: 1, name: 'Budget 1', creatorId: 1 },
  { id: 2, name: 'Debts', creatorId: 1 },
  { id: 3, name: 'Budget 10', creatorId: 1 },
];

export const mockRecords: BudgetRecordDto[] = [
  {
    id: 1,
    name: 'Products',
    creationDate: new Date('2025-01-12'),
    spendingDate: new Date('2025-01-12'),
    budgetId: 1,
    total: 3500,
    comment: 'Prod',
  },
  {
    id: 2,
    name: 'Utilities',
    creationDate: new Date('2025-04-13'),
    spendingDate: new Date('2025-04-13'),
    budgetId: 1,
    total: 5000,
    comment: 'Bruh so expensive',
  },
  {
    id: 3,
    name: 'ASDFG',
    creationDate: new Date('2025-04-13'),
    spendingDate: new Date('2025-04-13'),
    budgetId: 2,
    total: 5000,
    comment: 'Bruh so expensive',
  },
];

export const mockResult: BudgetResultDto = {
  budgetId: 1,
  totalProfit: 8500,
};
