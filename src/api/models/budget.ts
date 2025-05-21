export type BudgetDto = {
  id?: number;
  name?: string;
  startDate?: Date;
  finishDate?: Date;
  description?: string;
  creatorId: number;
};
