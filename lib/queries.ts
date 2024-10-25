import { SQLiteDatabase } from "expo-sqlite";
import { getCurrentDateTimeISO } from "./utility";

export async function fetchExpenses(
  db: SQLiteDatabase,
  filter: "all" | "month" | "week" = "month"
) {
  let query = "";

  switch (filter) {
    case "month":
      query =
        "SELECT * FROM expenses WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now') ORDER BY date DESC";
      break;
    case "week":
      query =
        "SELECT * FROM expenses WHERE date >= date('now', '-7 days') ORDER BY date DESC";
      break;
    case "all":
    default:
      query = "SELECT * FROM expenses ORDER BY date DESC";
      break;
  }
  const result = await db.getAllAsync<Expense>(query);
  return result;
}

export async function fetchIncomes(
  db: SQLiteDatabase,
  filter: "all" | "month" | "week" = "month"
) {
  let query = "";

  switch (filter) {
    case "month":
      query =
        "SELECT * FROM incomes WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now') ORDER BY date DESC";
      break;
    case "week":
      query =
        "SELECT * FROM incomes WHERE date >= date('now', '-7 days') ORDER BY date DESC";
      break;
    case "all":
    default:
      query = "SELECT * FROM incomes ORDER BY date DESC";
      break;
  }

  const result = await db.getAllAsync<Income>(query);
  return result;
}
export async function createExpense(
  db: SQLiteDatabase,
  category: string,
  amount: string,
  description: string,
  paymentMethod: string
) {
  const r = await db.runAsync(
    "INSERT INTO expenses (category, amount, date, description, payment_method) VALUES (?, ?, ?, ?, ?)",
    category,
    amount,
    getCurrentDateTimeISO(),
    description,
    paymentMethod
  );
  console.log(r);
}

export async function createIncome(
  db: SQLiteDatabase,
  category: string,
  amount: string,
  description: string
) {
  const r = await db.runAsync(
    "INSERT INTO incomes (source, amount, date, description) VALUES (?, ?, ?, ?)",
    category,
    amount,
    getCurrentDateTimeISO(),
    description
  );
  console.log(r);
}
