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

export async function fetchExpenseById(db: SQLiteDatabase, uid: string) {
  const result = await db.getFirstAsync<Expense>(
    `SELECT * FROM expenses WHERE id = ${uid}`
  );
  return result;
}

export async function fetchIncomeById(db: SQLiteDatabase, uid: string) {
  const result = await db.getFirstAsync<Income>(
    `SELECT * FROM incomes WHERE id = ${uid}`
  );
  return result;
}

export async function deleteExpenseById(db: SQLiteDatabase, uid: string) {
  const r = await db.runAsync(`DELETE FROM expenses WHERE id = ${uid}`);
  console.log(r);
}

export async function deleteIncomeById(db: SQLiteDatabase, uid: string) {
  const r = await db.runAsync(`DELETE FROM incomes WHERE id = ${uid}`);
  console.log(r);
}

export async function updateExpenseById(
  db: SQLiteDatabase,
  amount: string,
  category: string,
  description: string,
  uid: string
) {
  const r = await db.runAsync(
    "UPDATE expenses SET amount = ?, category = ?, description = ? WHERE id = ?",
    amount,
    category,
    description,
    uid
  );
  console.log(r);
}

export async function updateIncomeById(
  db: SQLiteDatabase,
  amount: string,
  source: string,
  description: string,
  uid: string
) {
  const r = await db.runAsync(
    "UPDATE incomes SET amount = ?, source = ?, description = ? WHERE id = ?",
    amount,
    source,
    description,
    uid
  );
  console.log(r);
}
