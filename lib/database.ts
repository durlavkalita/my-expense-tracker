import * as SQLite from "expo-sqlite";

// Open or create the SQLite database
const db = SQLite.openDatabaseSync("finance.db");
