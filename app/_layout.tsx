import { convertToISOFormat } from "@/lib/utility";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="finance.db" onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="transaction" options={{ title: "Add" }} />
        <Stack.Screen
          name="expense/[id]"
          options={{ title: "Expense Record" }}
        />
        <Stack.Screen name="income/[id]" options={{ title: "Income Record" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SQLiteProvider>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2; // increment this on new changes

  // Get the current version
  const user_version = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  const currentDbVersion = user_version?.user_version || 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // Set PRAGMA journal_mode for consistency
  await db.execAsync(`PRAGMA journal_mode = 'wal';`);

  // Migration 1: Create initial tables if they don't exist
  if (currentDbVersion < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS incomes (
        id INTEGER PRIMARY KEY NOT NULL,
        source TEXT NOT NULL,
        amount TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY NOT NULL,
        category TEXT NOT NULL,
        amount TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);
  }

  // Migration 2: Add payment_method to expenses and update date format
  if (currentDbVersion < 2) {
    // Add new column 'payment_method' to expenses table
    await db.execAsync(`
      ALTER TABLE expenses
      ADD COLUMN payment_method TEXT DEFAULT 'cash';
    `);

    // Update the date format of existing records
    const existingExpenses: { date: string; id: number }[] =
      await db.getAllAsync("SELECT id, date FROM expenses");

    for (const row of existingExpenses) {
      const newDate = convertToISOFormat(row.date); // Function to convert old date format to ISO
      await db.runAsync("UPDATE expenses SET date = ? WHERE id = ?", [
        newDate,
        row.id,
      ]);
    }

    // Update the date format of existing records
    const existingIncomes: { date: string; id: number }[] =
      await db.getAllAsync("SELECT id, date FROM incomes");

    for (const row of existingIncomes) {
      const newDate = convertToISOFormat(row.date); // Function to convert old date format to ISO
      await db.runAsync("UPDATE incomes SET date = ? WHERE id = ?", [
        newDate,
        row.id,
      ]);
    }
  }

  // Update database version
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
