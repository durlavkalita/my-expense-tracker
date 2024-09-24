declare interface Income {
  id: string;
  source: string; // e.g., Salary, Freelance, Rental Income
  amount: string; // The amount of money received
  date: string; // The date the income was received
  description: string; // Optional, details about the income (e.g., "July Salary")
}

declare enum ExpenseCategory {
  Groceries = "Groceries",
  Rent = "Rent",
  Utilities = "Utilities",
  Transportation = "Transportation",
  Insurance = "Insurance",
  Healthcare = "Healthcare",
  Dining = "Dining",
  Entertainment = "Entertainment",
  Shopping = "Shopping",
  Education = "Education",
  DebtPayments = "Debt Payments",
  Savings = "Savings",
  Investments = "Investments",
  Subscriptions = "Subscriptions",
  PersonalCare = "Personal Care",
  GiftsDonations = "Gifts/Donations",
  Household = "Household",
  Travel = "Travel",
  Childcare = "Childcare",
  Miscellaneous = "Miscellaneous",
}

declare enum IncomeSource {
  Salary = "Salary",
  Business = "Business",
  Freelance = "Freelance",
  Investments = "Investments",
  RentalIncome = "Rental Income",
  Gifts = "Gifts",
  Dividends = "Dividends",
  Interest = "Interest",
  Pension = "Pension",
  SocialSecurity = "Social Security",
  Royalties = "Royalties",
  TaxRefunds = "Tax Refunds",
  Miscellaneous = "Miscellaneous",
}

declare interface Expense {
  id: string;
  category: string; // e.g., Salary, Freelance, Rental Income
  amount: string; // The amount of money received
  date: string; // The date the income was received
  description: string; // Optional, details about the income (e.g., "July Salary")
}
