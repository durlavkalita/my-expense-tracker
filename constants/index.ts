import income from "@/assets/icons/income.png";
import expenses from "@/assets/icons/expenses.png";
import add from "@/assets/icons/add.png";
import grocery from "@/assets/icons/grocery.png";
import miscellaneous from "@/assets/icons/miscellaneous.png";
import rupee from "@/assets/icons/rupee-indian.png";
import upArrow from "@/assets/icons/up-arrow.png";
import downArrow from "@/assets/icons/arrow-down-sign-to-navigate.png";
import childcare from "@/assets/icons/childcare.png";
import entertainment from "@/assets/icons/cinema.png";
import debt from "@/assets/icons/debt.png";
import dining from "@/assets/icons/dining-table.png";
import education from "@/assets/icons/diploma.png";
import gift from "@/assets/icons/gift.png";
import healthcare from "@/assets/icons/healthcare.png";
import home from "@/assets/icons/home.png";
import household from "@/assets/icons/household.png";
import insurance from "@/assets/icons/insurance.png";
import investment from "@/assets/icons/investment.png";
import savings from "@/assets/icons/piggy-bank.png";
import rent from "@/assets/icons/rent.png";
import shopping from "@/assets/icons/shopping-cart.png";
import subscription from "@/assets/icons/subscription.png";
import utilities from "@/assets/icons/utilities.png";
import transportation from "@/assets/icons/vehicles.png";
import care from "@/assets/icons/care.png";
import travel from "@/assets/icons/travel.png";
import business from "@/assets/icons/business.png";
import freelance from "@/assets/icons/freelancer.png";
import dividends from "@/assets/icons/dividends.png";
import interest from "@/assets/icons/interest-rate.png";
import pension from "@/assets/icons/retirement.png";
import royalties from "@/assets/icons/customer-royalty.png";
import refunds from "@/assets/icons/refund.png";
import salary from "@/assets/icons/salary.png";

export const icons = {
  income,
  expenses,
  add,
  grocery,
  miscellaneous,
  rupee,
  upArrow,
  downArrow,
  home,
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

export const expenseCategory = [
  { name: "Groceries", icon: grocery },
  { name: "Rent", icon: rent },
  { name: "Utilities", icon: utilities },
  { name: "Transportation", icon: transportation },
  { name: "Insurance", icon: insurance },
  { name: "Healthcare", icon: healthcare },
  { name: "Dining", icon: dining },
  { name: "Entertainment", icon: entertainment },
  { name: "Shopping", icon: shopping },
  { name: "Education", icon: education },
  { name: "Debt Payments", icon: debt },
  { name: "Savings", icon: savings },
  { name: "Investments", icon: investment },
  { name: "Subscriptions", icon: subscription },
  { name: "Personal Care", icon: care },
  { name: "Gifts/Donations", icon: gift },
  { name: "Household", icon: household },
  { name: "Travel", icon: travel },
  { name: "Childcare", icon: childcare },
  { name: "Miscellaneous", icon: miscellaneous },
];

export const incomeSource = [
  { name: "Salary", icon: salary },
  { name: "Business", icon: business },
  { name: "Freelance", icon: freelance },
  { name: "Investments", icon: investment },
  { name: "Rental Income", icon: rent },
  { name: "Gifts", icon: gift },
  { name: "Dividends", icon: dividends },
  { name: "Interest", icon: interest },
  { name: "Pension", icon: pension },
  { name: "Royalties", icon: royalties },
  { name: "Tax Refunds", icon: refunds },
  { name: "Miscellaneous", icon: miscellaneous },
];
