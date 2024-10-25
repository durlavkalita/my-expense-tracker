import { convertToISOFormat } from "@/lib/utility";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="transaction" options={{ title: "Add" }} />
          <Stack.Screen
            name="expense/[id]"
            options={{ title: "Expense Record" }}
          />
          <Stack.Screen
            name="income/[id]"
            options={{ title: "Income Record" }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryClientProvider>
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
  // console.log(currentDbVersion);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // Create initial tables if they don't exist
  if (currentDbVersion == 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS incomes (
        id INTEGER PRIMARY KEY NOT NULL,
        source TEXT NOT NULL,
        amount TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY NOT NULL,
        payment_method TEXT NOT NULL,
        category TEXT NOT NULL,
        amount TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);
  }

  // Migration 1: Add payment_method in expenses table
  if (currentDbVersion == 1) {
    await db.execAsync(`
      ALTER TABLE expenses
      ADD COLUMN payment_method TEXT DEFAULT 'cash';
    `);
  }

  // Update database version
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
