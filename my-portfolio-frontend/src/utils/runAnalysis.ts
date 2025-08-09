#!/usr/bin/env ts-node
// AI-AGENT CONTEXT: FILE=runAnalysis | ROLE=analysis_cli_tool | PURPOSE=workspace_analysis_execution_script
// AI-DEPENDENCY: analyzeWorkspace,path

// AI-LOGICAL-REGION: Type_Definitions
type AnalysisConfig = {
  workspaceRoot: string;
  actions: string[];
};

import { runAgentAnalysis } from "./analyzeWorkspace";
import * as path from "path";

async function main(): Promise<void> {
  try {
    const config: AnalysisConfig = {
      workspaceRoot: path.resolve(__dirname, "../../.."),
      actions: ["overview", "get-recommendations", "validate-architecture"],
    };

    console.log("🔍 Starting AI Agent Workspace Analysis...\n");
    console.log(`📁 Workspace: ${config.workspaceRoot}\n`);

    // Run comprehensive analysis
    const overview = await runAgentAnalysis(config.workspaceRoot, {
      action: "overview",
    });
    console.log(overview);

    const recommendations = await runAgentAnalysis(config.workspaceRoot, {
      action: "get-recommendations",
    });
    console.log(recommendations);

    const validation = await runAgentAnalysis(config.workspaceRoot, {
      action: "validate-architecture",
    });
    console.log(validation);
  } catch (error) {
    console.error("❌ Analysis failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
