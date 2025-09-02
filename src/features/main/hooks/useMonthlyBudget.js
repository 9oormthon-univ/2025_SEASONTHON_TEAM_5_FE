import { useMemo } from "react";
import { useExpenseStore } from "../store/expenseStore";
import { useBudgetStore } from "../../budget/store/budgetStore";

export default function useMonthlyBudget() {
  const expenses = useExpenseStore((s) => s.expenses);
  const budget = useBudgetStore((s) => s.monthlyBudget);

  const now = new Date();
  const monthItems = useMemo(
    () =>
      expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }),
    [expenses]
  );

  const monthTotal = useMemo(
    () => monthItems.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [monthItems]
  );

  const remain = Math.max((Number(budget) || 0) - monthTotal, 0);
  const recent = monthItems
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return { monthTotal, remain, recent, budget };
}
