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
        <Stack.Screen name="+not-found" />
      </Stack>
    </SQLiteProvider>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS incomes (id INTEGER PRIMARY KEY NOT NULL, source TEXT NOT NULL, amount TEXT NOT NULL, date TEXT NOT NULL, description TEXT NOT NULL);
      `);
    await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY NOT NULL, category TEXT NOT NULL, amount TEXT NOT NULL, date TEXT NOT NULL, description TEXT NOT NULL);
        `);
    await db.runAsync(
      "INSERT INTO incomes (source, amount, date, description) VALUES (?, ?, ?, ?)",
      "Salary",
      "35,000.50",
      "31-01-2024",
      "January Month Salary"
    );
    await db.runAsync(
      "INSERT INTO expenses (category, amount, date, description) VALUES (?, ?, ?, ?)",
      "Grocery",
      "5,000",
      "25-01-2024",
      "Bought groceries"
    );
    currentDbVersion = 1;
  }
  if (currentDbVersion === 1) {
    // other migrations
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
