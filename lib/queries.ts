export async function fetchExpenses(
  db: any,
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
