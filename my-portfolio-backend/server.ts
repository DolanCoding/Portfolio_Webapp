/*
---
agent:
  file: server.ts
  role: Express_Server
  purpose: Portfolio_Backend_API_SQLite_Database
owner: TBD
stability: alpha
dependencies:
  - dotenv
  - express
  - cors
  - sqlite
  - sqlite3
  - path
  - ./db/init_db
  - shared-types
contracts:
  routes:
    - "GET /api/projects -> Project[]"
    - "GET /api/certificates -> Certificate[]"
security:
  - CORS_CONFIGURATION
  - SQL_INJECTION_PREVENTION
  - ERROR_SANITIZATION
tags:
  - backend
  - api
---
*/

// ⛳ AGENT-ENTRYPOINT
// 📎 CONTEXT: Express server entry; serves API + static assets. ENV: PORT, DB_PATH.
// TODO(ai): [type=doc] [impact=low] [rationale=Anchor placement for agents] [plan=Maintain anchors across refactors]

// AI-AGENT CONTEXT: FILE=server | ROLE=Express_Server | PURPOSE=Portfolio_Backend_API_SQLite_Database
// AI-DEPENDENCY: express,cors,sqlite,sqlite3,path,dotenv, sharedTypes
// AI-SECURITY: CORS_CONFIGURATION,SQL_INJECTION_PREVENTION,ERROR_SANITIZATION

// AI-LOGICAL-REGION: Type_Definitions
interface DatabaseRow {
  id: number | string;
  [key: string]: string | number | undefined;
}

// AI-LOGICAL-REGION: Import_Dependencies
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import { initializeDatabase } from "./db/init_db";
// 🔒 INVARIANTS: Use shared types for API contracts; import as type-only to avoid runtime coupling
import type { Project, Certificate } from "../shared-types";

dotenv.config();
const app = express();
// 🔒 INVARIANTS: PORT must be a valid integer; default 3001
const port: number = parseInt(process.env.PORT || "3001");

let db: Database; // Variable to hold the database connection instance

// AI-LOGICAL-REGION: Database_Connection
async function openDatabase(): Promise<void> {
  // Initialize the database (create tables, etc.)
  await initializeDatabase();
  // 🔒 INVARIANTS: DB_PATH resolves to a readable SQLite file; defaults under ../db/portfolio.db
  const DATABASE_PATH: string =
    process.env.DB_PATH ?? path.resolve(__dirname, "../db/portfolio.db");
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
// 🧪 CONTRACT: GET /api/projects -> Project[]
app.get("/api/projects", async (_req: Request, res: Response): Promise<void> => {
  console.log("Received request for projects");
  try {
    const projects: DatabaseRow[] = await db.all("SELECT * FROM projects");
    const projectsWithStringId: Project[] = projects.map(
      (project: DatabaseRow) =>
        ({
          ...project,
          id: String(project.id),
        }) as Project
    );
    res.json(projectsWithStringId);
  } catch (err: unknown) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🧪 CONTRACT: GET /api/certificates -> Certificate[]
app.get("/api/certificates", async (_req: Request, res: Response): Promise<void> => {
  console.log("Received request for certificates");
  try {
    const certificates: DatabaseRow[] = await db.all("SELECT * FROM certificates");
    res.json(certificates as unknown as Certificate[]);
  } catch (err: unknown) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
// TODO(ai): [type=test] [impact=med] [rationale=Add contract tests for routes] [plan=Jest+supertest in Phase 1]
