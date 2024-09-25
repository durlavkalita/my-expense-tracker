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
        <Stack.Screen name="+not-found" />
      </Stack>
    </SQLiteProvider>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  // if (currentDbVersion >= DATABASE_VERSION) {
  //   return;
  // }

  await db.execAsync(`
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS incomes (id INTEGER PRIMARY KEY NOT NULL, source TEXT NOT NULL, amount TEXT NOT NULL, date TEXT NOT NULL, description TEXT NOT NULL);
  `);
  await db.execAsync(`
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY NOT NULL, category TEXT NOT NULL, amount TEXT NOT NULL, date TEXT NOT NULL, description TEXT NOT NULL);
  `);

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
