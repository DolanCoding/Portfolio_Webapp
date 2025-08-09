// AI-AGENT CONTEXT: FILE=analyzeWorkspace | ROLE=cli_analysis_tool | PURPOSE=demonstrate_agent_code_analysis_usage

// AI-LOGICAL-REGION: Import Dependencies
import {
  analyzeCodeStructure,
  getComponentInfo,
  findSimilarComponents,
  getArchitectureRecommendations,
  type CodeStructureAnalysis,
  type ArchitecturePattern,
} from "./codeStructureAnalysis";
import { relative } from "path";

// AI-LOGICAL-REGION: Agent Analysis Interface
interface AgentAnalysisRequest {
  action:
    | "overview"
    | "component-details"
    | "find-similar"
    | "get-recommendations"
    | "validate-architecture";
  componentName?: string;
  componentType?: "page" | "component" | "utility" | "type" | "api";
}

// AI-LOGICAL-REGION: Main Agent Analysis Function
export async function runAgentAnalysis(
  projectRoot: string,
  request: AgentAnalysisRequest
): Promise<string> {
  try {
    const analysis = analyzeCodeStructure(projectRoot);

    switch (request.action) {
      case "overview":
        return generateOverviewReport(analysis);

      case "component-details":
        if (!request.componentName) {
          return JSON.stringify({
            error: "MISSING_COMPONENT_NAME",
            required_parameter: "componentName",
          });
        }
        return generateComponentDetailsReport(request.componentName, analysis);

      case "find-similar":
        if (!request.componentType) {
          return JSON.stringify({
            error: "MISSING_COMPONENT_TYPE",
            required_parameter: "componentType",
          });
        }
        return generateSimilarComponentsReport(request.componentType, analysis);

      case "get-recommendations":
        return generateRecommendationsReport(analysis);

      case "validate-architecture":
        return generateArchitectureValidationReport(analysis);

      default:
        return JSON.stringify({
          error: "UNKNOWN_ACTION",
          provided_action: request.action,
          valid_actions: [
            "overview",
            "component-details",
            "find-similar",
            "get-recommendations",
            "validate-architecture",
          ],
        });
    }
  } catch (error) {
    return JSON.stringify({
      error: "ANALYSIS_FAILED",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// AI-LOGICAL-REGION: Report Generation Functions
function generateOverviewReport(analysis: CodeStructureAnalysis): string {
  return JSON.stringify(
    {
      workspace_analysis_overview: {
        project_metrics: {
          total_files: analysis.totalFiles,
          component_count: analysis.componentCount,
          ai_optimization_coverage:
            analysis.aiOptimizationCoverage.totalCoverage,
        },
        architecture_health: {
          compliance_score: analysis.architectureCompliance.score,
          typescript_coverage: analysis.codeQualityMetrics.typeScriptCoverage,
          naming_convention_compliance:
            analysis.codeQualityMetrics.namingConventionCompliance,
        },
        ai_optimization_status: {
          context_tags: analysis.aiOptimizationCoverage.contextTags,
          logical_regions: analysis.aiOptimizationCoverage.logicalRegions,
          dependency_tags: analysis.aiOptimizationCoverage.dependencyTags,
        },
        analysis_insights: {
          architecture_violations:
            analysis.architectureCompliance.violations.length,
          optimization_level:
            analysis.aiOptimizationCoverage.totalCoverage >= 80
              ? "ADEQUATE"
              : "NEEDS_IMPROVEMENT",
        },
      },
    },
    null,
    2
  );
}

function generateComponentDetailsReport(
  componentName: string,
  analysis: CodeStructureAnalysis
): string {
  const component = getComponentInfo(componentName, analysis);

  if (!component) {
    return JSON.stringify({
      error: "COMPONENT_NOT_FOUND",
      component_name: componentName,
    });
  }

  return JSON.stringify(
    {
      component_analysis: {
        component_info: {
          file_path: component.filePath,
          type: component.type,
          ai_optimized: component.hasAIContext,
        },
        dependencies: {
          imports: component.imports,
          exports: component.exports,
          ai_dependencies: component.dependencies,
        },
        compliance_check: {
          ai_context_tag: component.hasAIContext,
          logical_regions: component.hasAILogicalRegion,
          naming_convention: component.followsNamingConvention,
          typescript_compliant: component.isTypeScriptCompliant,
        },
        relationship_context: {
          component_type: component.type,
          follows_ai_patterns: component.hasAIContext,
          reference_quality: component.hasAIContext
            ? "HIGH"
            : "NEEDS_IMPROVEMENT",
        },
      },
    },
    null,
    2
  );
}

function generateSimilarComponentsReport(
  componentType: string,
  analysis: CodeStructureAnalysis
): string {
  const similarComponents = findSimilarComponents(
    componentType as "page" | "component" | "utility" | "type" | "api",
    analysis
  );

  if (similarComponents.length === 0) {
    return JSON.stringify({
      error: "NO_COMPONENTS_FOUND",
      component_type: componentType,
    });
  }

  const optimizedComponents = similarComponents.filter((c) => c.hasAIContext);

  return JSON.stringify(
    {
      pattern_analysis: {
        component_type: componentType.toUpperCase(),
        total_found: similarComponents.length,
        components: similarComponents.map((c) => ({
          name: c.name,
          ai_optimized: c.hasAIContext,
          file_path: c.filePath.split("/").slice(-2).join("/"),
        })),
        recommended_patterns: {
          best_practice_examples: optimizedComponents.slice(0, 3).map((c) => ({
            name: c.name,
            status: "WELL_OPTIMIZED_WITH_AI_TAGS",
          })),
          optimization_status:
            optimizedComponents.length > 0
              ? "EXAMPLES_AVAILABLE"
              : "NO_OPTIMIZED_EXAMPLES",
        },
        agent_guidance: {
          reference_component:
            optimizedComponents.length > 0
              ? optimizedComponents[0].name
              : similarComponents[0].name,
          required_patterns: [
            "AI_AGENT_CONTEXT_TAG",
            "LOGICAL_REGIONS_ORGANIZATION",
            "ESTABLISHED_NAMING_PATTERNS",
          ],
        },
      },
    },
    null,
    2
  );
}

function generateRecommendationsReport(
  analysis: CodeStructureAnalysis
): string {
  const recommendations = getArchitectureRecommendations(analysis);

  return JSON.stringify(
    {
      architecture_recommendations: {
        priority_improvements: recommendations,
        optimization_opportunities: {
          ai_context_coverage: {
            status:
              analysis.aiOptimizationCoverage.totalCoverage < 100
                ? "INCOMPLETE"
                : "COMPLETE",
            files_needing_tags:
              analysis.componentCount -
              analysis.aiOptimizationCoverage.contextTags,
          },
          typescript_adoption: {
            status:
              analysis.codeQualityMetrics.typeScriptCoverage < 100
                ? "INCOMPLETE"
                : "COMPLETE",
            files_needing_improvement: Math.round(
              ((100 - analysis.codeQualityMetrics.typeScriptCoverage) / 100) *
                analysis.componentCount
            ),
          },
        },
        agent_workflow_requirements: [
          "RUN_ANALYSIS_BEFORE_MODIFICATIONS",
          "USE_HIGH_COMPLIANCE_COMPONENT_PATTERNS",
          "VALIDATE_NEW_COMPONENTS_AGAINST_PATTERNS",
          "PRIORITIZE_MISSING_AI_OPTIMIZATION_TAGS",
        ],
      },
    },
    null,
    2
  );
}

function generateArchitectureValidationReport(
  analysis: CodeStructureAnalysis
): string {
  const { score, violations } = analysis.architectureCompliance;
  const health =
    score >= 75 ? "HEALTHY" : score >= 50 ? "MODERATE" : "NEEDS_ATTENTION";

  // Get specific files that need fixes
  const nonCompliantTypeScript = analysis.components
    .filter((c) => !c.isTypeScriptCompliant)
    .map((c) => relative(analysis.projectRoot, c.filePath));

  const nonCompliantNaming = analysis.components
    .filter((c) => !c.followsNamingConvention)
    .map((c) => relative(analysis.projectRoot, c.filePath));

  const missingAIContext = analysis.components
    .filter((c) => !c.hasAIContext)
    .map((c) => relative(analysis.projectRoot, c.filePath));

  return JSON.stringify(
    {
      architecture_validation: {
        overall_health: {
          status: health,
          score: score,
          max_score: 100,
        },
        violations: {
          detected: violations.length > 0,
          count: violations.length,
          list: violations,
        },
        pattern_compliance: analysis.patterns.map(
          (pattern: ArchitecturePattern) => ({
            pattern: pattern.pattern,
            compliance: pattern.compliance,
            description: pattern.description,
            examples_count: pattern.examples.length,
          })
        ),
        // NEW: Specific files that need fixes
        files_needing_fixes: {
          typescript_non_compliant: {
            count: nonCompliantTypeScript.length,
            files: nonCompliantTypeScript,
          },
          naming_convention_violations: {
            count: nonCompliantNaming.length,
            files: nonCompliantNaming,
          },
          missing_ai_context: {
            count: missingAIContext.length,
            files: missingAIContext,
          },
        },
        next_steps: {
          immediate_actions:
            score < 75
              ? ["ADDRESS_PATTERN_VIOLATIONS_BEFORE_NEW_FEATURES"]
              : ["MAINTAIN_CURRENT_ARCHITECTURE_STANDARDS"],
          ongoing_requirements: [
            "USE_COMPLIANT_COMPONENTS_AS_TEMPLATES",
            "VALIDATE_NEW_CODE_AGAINST_PATTERNS",
            "UPDATE_AI_TAGS_AND_LOGICAL_REGIONS_CONSISTENTLY",
          ],
        },
      },
    },
    null,
    2
  );
}

// AI-LOGICAL-REGION: Example Usage Demo
export function demonstrateAgentUsage(): void {
  console.log(`
🤖 DEMONSTRATION: How AI Agents Use Code Structure Analysis

// SCENARIO 1: Agent needs to understand project overview
const overview = await runAgentAnalysis('/project/root', { action: 'overview' });

// SCENARIO 2: Agent needs to modify ProjectCard component
const details = await runAgentAnalysis('/project/root', { 
  action: 'component-details', 
  componentName: 'ProjectCard' 
});

// SCENARIO 3: Agent needs to create a new page component
const similar = await runAgentAnalysis('/project/root', { 
  action: 'find-similar', 
  componentType: 'page' 
});

// SCENARIO 4: Agent wants architecture recommendations
const recommendations = await runAgentAnalysis('/project/root', { 
  action: 'get-recommendations' 
});

This tool helps agents make informed decisions about code structure and patterns!
`);
}

// AI-NAVIGATION: EXPORT=runAgentAnalysis,demonstrateAgentUsage
