// AI-AGENT CONTEXT: FILE=init_db | ROLE=Database_Initialization | PURPOSE=SQLite_Database_Setup_Table_Creation
// AI-DEPENDENCY: sqlite,sqlite3,db_schema,db_temp_pop
// AI-SECURITY: DATABASE_VALIDATION,SAFE_INITIALIZATION

// AI-LOGICAL-REGION: Type_Definitions
interface TableColumn {
  name: string;
  type: string;
}

interface TableInfo {
  name: string;
  columns: TableColumn[];
}

interface DatabaseInstance {
  get: (query: string) => Promise<{ count: number } | undefined>;
  run: (query: string, values: (string | number)[]) => Promise<any>;
  all: (query: string) => Promise<any[]>;
  exec: (query: string) => Promise<void>;
  close: () => Promise<void>;
}

// AI-LOGICAL-REGION: Import_Dependencies
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import * as schema from "./db_schema";
import { populateTables } from "./db_temp_pop";

const DATABASE = "./db/portfolio.db";

// AI-LOGICAL-REGION: Database_Initialization
export async function initializeDatabase(): Promise<void> {
  let db: Database | undefined = undefined;
  console.log("Schema loaded:", schema.tables);
  try {
    db = await open({ filename: DATABASE, driver: sqlite3.Database });
    console.log(`Database ${DATABASE} opened successfully.`);

    // Create tables
    for (const tableInfo of schema.tables) {
      const createTableSql = `
        CREATE TABLE IF NOT EXISTS ${tableInfo.name} (
          ${tableInfo.columns
            .map((col: TableColumn) => `${col.name} ${col.type}`)
            .join(", ")}
        )
      `;
      await db.exec(createTableSql);
      console.log(`${tableInfo.name} table created or already exists.`);
    }

    // Add initial data
    await populateTables(db, schema.tables);
  } catch (e) {
    console.error("An error occurred during database initialization:", e);
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// AI-NAVIGATION: EXPORT=initializeDatabase
