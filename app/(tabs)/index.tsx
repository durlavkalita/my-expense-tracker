import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [version, setVersion] = useState("");
  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ "sqlite_version()": string }>(
        "SELECT sqlite_version()"
      );
      setVersion(result!["sqlite_version()"]);
    }
    setup();
  }, []);
  return (
    <SafeAreaView>
      <Text className="text-white">Hello</Text>
      <Text>SQLite version: {version}</Text>
    </SafeAreaView>
  );
}
