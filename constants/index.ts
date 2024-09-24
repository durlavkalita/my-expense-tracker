import income from "@/assets/icons/income.png";
import expenses from "@/assets/icons/expenses.png";
import add from "@/assets/icons/add.png";
import grocery from "@/assets/icons/grocery.png";
import miscellaneous from "@/assets/icons/miscellaneous.png";
import rupee from "@/assets/icons/rupee-indian.png";

export const icons = {
  income,
  expenses,
  add,
  grocery,
  miscellaneous,
  rupee,
};

const incomeData = [
  {
    id: "1",
    source: "Salary",
    amount: "3000",
    date: "2024-09-22",
    description: "September Salary",
  },
  {
    id: "2",
    source: "Freelance",
    amount: "500",
    date: "2024-09-15",
    description: "Website Design",
  },
];

const expenseData = [
  {
    id: "1",
    category: "Groceries",
    amount: "150",
    date: "2024-09-20",
    description: "Weekly grocery shopping",
  },
  {
    id: "2",
    category: "Rent",
    amount: "1200",
    date: "2024-09-01",
    description: "Monthly apartment rent",
  },
  {
    id: "3",
    category: "Utilities",
    amount: "100",
    date: "2024-09-05",
    description: "Electricity bill for September",
  },
  {
    id: "4",
    category: "Transportation",
    amount: "50",
    date: "2024-09-15",
    description: "Gas refill for the car",
  },
  {
    id: "5",
    category: "Dining",
    amount: "60",
    date: "2024-09-18",
    description: "Dinner at a restaurant",
  },
  {
    id: "6",
    category: "Entertainment",
    amount: "20",
    date: "2024-09-12",
    description: "Movie tickets for two",
  },
  {
    id: "7",
    category: "Insurance",
    amount: "200",
    date: "2024-09-10",
    description: "Monthly health insurance premium",
  },
  {
    id: "8",
    category: "Personal Care",
    amount: "40",
    date: "2024-09-17",
    description: "Haircut and grooming",
  },
  {
    id: "9",
    category: "Subscriptions",
    amount: "15",
    date: "2024-09-07",
    description: "Monthly Netflix subscription",
  },
  {
    id: "10",
    category: "Shopping",
    amount: "250",
    date: "2024-09-19",
    description: "Bought new shoes and clothes",
  },
];

export const dummyData = {
  incomeData,
  expenseData,
};
