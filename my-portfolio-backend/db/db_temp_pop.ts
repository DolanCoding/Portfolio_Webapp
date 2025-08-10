// AI-AGENT CONTEXT: FILE=db_temp_pop | ROLE=Database_Population | PURPOSE=Initial_Data_Loading_JSON_Import
// AI-DEPENDENCY: fs,sqlite
// AI-SECURITY: FILE_VALIDATION,JSON_PARSING_SAFETY

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
}

interface JsonRowData {
  [key: string]: string | number | string[] | number[];
}

type JsonData = JsonRowData[];

// AI-LOGICAL-REGION: Import_Dependencies
import fs from "fs";

// AI-LOGICAL-REGION: Table_Population_Function
export async function populateTables(
  db: DatabaseInstance,
  tables: TableInfo[]
): Promise<void> {
  console.log("****_____----------------_____****");
  console.log("Populating tables with default data...");

  for (const tableInfo of tables) {
    const name: string = tableInfo.name;
    const tableCountRow = await db.get(`SELECT COUNT(*) as count FROM ${name}`);
    const tableCount: number = tableCountRow?.count || 0;

    if (tableCount === 0) {
      console.log(`Table ${name} was empty, Populating...`);
      const columns: TableColumn[] = tableInfo.columns;
      const jsonFilePath: string = `./db/Data/init_pop/${name}.json`;

      try {
        const data: string = fs.readFileSync(jsonFilePath, "utf8");
        const jsonData: JsonData = JSON.parse(data);

        if (jsonData.length > 0) {
          const insertSql: string = `INSERT INTO ${name} (${columns
            .map((col: TableColumn) => col.name)
            .join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`;

          for (const row of jsonData) {
            const values: (string | number)[] = columns.map(
              (col: TableColumn) => {
                let value = row[col.name];
                if (Array.isArray(value)) {
                  value = JSON.stringify(value);
                }
                return value as string | number;
              }
            );
            await db.run(insertSql, values);
          }
          console.log(`Inserted ${jsonData.length} rows into ${name} table.`);
        } else {
          console.log(`No data found in ${jsonFilePath}.`);
        }
      } catch (error) {
        console.error(`Error reading or parsing ${jsonFilePath}:`, error);
      }
    } else {
      console.log(`Table ${name} already has data, skipping...`);
    }
  }
}

// AI-NAVIGATION: EXPORT=populateTables
