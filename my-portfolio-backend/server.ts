// AI-AGENT CONTEXT: FILE=server | ROLE=Express_Server | PURPOSE=Portfolio_Backend_API_SQLite_Database
// AI-DEPENDENCY: express,cors,sqlite,sqlite3,path
// AI-SECURITY: CORS_CONFIGURATION,SQL_INJECTION_PREVENTION,ERROR_SANITIZATION

// AI-LOGICAL-REGION: Type_Definitions
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  github_link: string;
  live_link: string;
  tags: string;
  starting_date: string;
  finished_date: string;
  timespan: number;
  hours_per_day: number;
  reason: string;
  learned_things: string;
  key_features: string;
  notes: string;
}

interface Certificate {
  id: string;
  title: string;
  type: string;
  date: string;
}

interface DatabaseRow {
  id: number | string;
  [key: string]: string | number | undefined;
}

interface ApiResponse<T> {
  message?: string;
  error?: string;
  data?: T;
}

type ServerPort = number;
type DatabasePath = string;

// AI-LOGICAL-REGION: Import_Dependencies
import express, { Request, Response } from "express";
import cors from "cors";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import { initializeDatabase } from "./db/init_db";

const app = express();
const port: number = parseInt(process.env.PORT || "3001");

let db: Database; // Variable to hold the database connection instance

// AI-LOGICAL-REGION: Database_Connection
async function openDatabase(): Promise<void> {
  // Initialize the database (create tables, etc.)
  await initializeDatabase();
  const DATABASE_PATH: string = path.resolve(__dirname, "../db/portfolio.db");
  try {
    db = await open({
      filename: DATABASE_PATH,
      driver: sqlite3.Database,
    });
  } catch (e: unknown) {
    console.error("Error opening database:", e);
    process.exit(1);
  }
}

// AI-LOGICAL-REGION: Middleware_Setup
app.use(cors());
app.use(express.json());
app.use(
  "/images/project_images",
  express.static(path.join(__dirname, "../db/Data/images/project_images"))
);
app.use(
  "/images/Certificates",
  express.static(path.join(__dirname, "../db/Data/images/Certificates"))
);

// AI-LOGICAL-REGION: API_Routes
app.get("/api/projects", async (req: Request, res: Response): Promise<void> => {
  console.log("Received request for projects");
  try {
    const projects: DatabaseRow[] = await db.all("SELECT * FROM projects");
    const projectsWithStringId: Project[] = projects.map(
      (project: DatabaseRow) =>
        ({
          ...project,
          id: String(project.id),
        } as Project)
    );
    res.json(projectsWithStringId);
  } catch (err: unknown) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get(
  "/api/certificates",
  async (req: Request, res: Response): Promise<void> => {
    console.log("Received request for certificates");
    try {
      const certificates: DatabaseRow[] = await db.all(
        "SELECT * FROM certificates"
      );
      res.json(certificates);
    } catch (err: unknown) {
      console.error("Error executing query", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// AI-LOGICAL-REGION: Server_Startup
async function startServer(): Promise<void> {
  await openDatabase();
  app.listen(port, (): void => {
    console.log(`Server listening on port ${port}`);
    console.log("----------------------------------------------");
    console.log("----------------------------------------------");
  });
}

startServer();

// AI-NAVIGATION: EXPORT=None (Server Entry Point)
