// AI-AGENT CONTEXT: FILE=codeStructureAnalysis | ROLE=utility_functions | PURPOSE=Code_Structure_Analysis_and_Validation
// AI-NAVIGATION: IMPORTS=[]
/// AI-DEPENDENCY: TypeScript
// AI-PERFORMANCE: STATIC_ANALYSIS,ARCHITECTURE_VALIDATION,ENHANCED_PATTERN_DETECTION

// AI-LOGICAL-REGION: Import and Type Definitions
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, relative, dirname, basename } from "path";

export interface ComponentInfo {
  filePath: string;
  name: string;
  type: "page" | "component" | "utility" | "type" | "api" | "unknown";
  imports: string[];
  exports: string[];
  dependencies: string[];
  hasAIContext: boolean;
  hasAILogicalRegion: boolean;
  hasAIDependency: boolean;
  followsNamingConvention: boolean;
  isTypeScriptCompliant: boolean;
  // T013: Enhanced analysis fields
  aiContextDetails: {
    file: string;
    role: string;
    purpose: string;
  } | null;
  logicalRegions: string[];
  componentComplexity: number;
  codeQualityScore: number;
  securityScore: number;
  performanceScore: number;
  architecturalRole: string;
  testCoverage: {
    hasTest: boolean;
    testFilePath?: string;
  };
}

export interface ArchitecturePattern {
  pattern: string;
  description: string;
  examples: string[];
  compliance: boolean;
  // T013: Enhanced pattern analysis
  severity: "critical" | "important" | "minor";
  automationPossible: boolean;
  agentGuidance: string;
}

interface ComponentRelationship {
  from: string;
  to: string;
  relationshipType: "imports" | "exports" | "dependency" | "test";
  strength: number; // 1-10 scale
}

interface ArchitecturalInsight {
  category: "structure" | "patterns" | "dependencies" | "quality" | "security";
  insight: string;
  impact: "high" | "medium" | "low";
  actionable: boolean;
  agentRecommendation: string;
}

export interface CodeStructureAnalysis {
  projectRoot: string;
  totalFiles: number;
  componentCount: number;
  aiOptimizationCoverage: {
    contextTags: number;
    logicalRegions: number;
    dependencyTags: number;
    totalCoverage: number;
    // T013: Enhanced coverage metrics
    contextQuality: number; // Average quality of AI context tags
    tagConsistency: number; // Consistency across similar components
    coverageGaps: string[]; // Files that should have tags but don't
  };
  components: ComponentInfo[];
  patterns: ArchitecturePattern[];
  dependencyGraph: Record<string, string[]>;
  // T013: Enhanced relationship analysis
  componentRelationships: ComponentRelationship[];
  architecturalInsights: ArchitecturalInsight[];
  codeSmells: {
    circularDependencies: string[][];
    orphanedComponents: string[];
    oversizedComponents: string[];
    underdocumentedComponents: string[];
  };
  architectureCompliance: {
    score: number;
    violations: string[];
    recommendations: string[];
    // T013: Enhanced compliance tracking
    patternMaturity: Record<string, number>;
    complianceTrends: string[];
  };
  codeQualityMetrics: {
    typeScriptCoverage: number;
    componentIsolationScore: number;
    namingConventionCompliance: number;
    // T013: Enhanced quality metrics
    maintainabilityIndex: number;
    technicalDebtScore: number;
    aiAgentOptimizationScore: number;
  };
  // T013: New workspace intelligence features
  workspaceIntelligence: {
    hotspots: string[]; // Files that change frequently or are central
    recommendations: {
      priority: "high" | "medium" | "low";
      action: string;
      impact: string;
      effort: "low" | "medium" | "high";
    }[];
    developmentPatterns: {
      pattern: string;
      frequency: number;
      recommendation: string;
    }[];
  };
}

// AI-LOGICAL-REGION: Enhanced File System Analysis Functions
function getProjectFiles(
  rootPath: string,
  extensions: string[] = [".ts", ".tsx", ".js", ".jsx"]
): string[] {
  const files: string[] = [];

  function scanDirectory(dirPath: string): void {
    try {
      const items = readdirSync(dirPath);

      for (const item of items) {
        const fullPath = join(dirPath, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules, build, and deprecated folders
          if (
            ![
              "node_modules",
              "build",
              "dist",
              "Falsely Focused Changes",
              ".git",
              "coverage",
            ].includes(item)
          ) {
            scanDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
    }
  }

  scanDirectory(rootPath);
  return files;
}

// AI-LOGICAL-REGION: Enhanced Content Analysis
function analyzeFileContent(
  filePath: string,
  allFiles: string[]
): ComponentInfo {
  try {
    const content = readFileSync(filePath, "utf-8");
    const fileName = filePath.split(/[/\\]/).pop() || "";
    const componentName = fileName.replace(/\.(ts|tsx|js|jsx)$/, "");

    // AI-LOGICAL-REGION: Basic Content Analysis
    const imports = extractImports(content);
    const exports = extractExports(content);
    const dependencies = extractDependencies(content);

    // AI-LOGICAL-REGION: Enhanced AI Tag Analysis
    const hasAIContext = /\/\/ AI-AGENT CONTEXT:/.test(content);
    const hasAILogicalRegion = /\/\/ AI-LOGICAL-REGION:/.test(content);
    const hasAIDependency = /\/\/ AI-DEPENDENCY:/.test(content);

    const aiContextDetails = extractAIContextDetails(content);
    const logicalRegions = extractLogicalRegions(content);

    // AI-LOGICAL-REGION: Enhanced Pattern Compliance Analysis
    const followsNamingConvention = checkNamingConvention(fileName, filePath);
    const isTypeScriptCompliant = checkTypeScriptCompliance(content, filePath);
    const componentType = determineComponentType(filePath, content);

    // T013: New Enhanced Analysis
    const componentComplexity = calculateComponentComplexity(content);
    const codeQualityScore = calculateCodeQualityScore(content, filePath);
    const securityScore = calculateSecurityScore(content);
    const performanceScore = calculatePerformanceScore(content);
    const architecturalRole = determineArchitecturalRole(
      filePath,
      content,
      imports,
      exports
    );
    const testCoverage = analyzeTestCoverage(filePath, componentName, allFiles);

    return {
      filePath,
      name: componentName,
      type: componentType,
      imports,
      exports,
      dependencies,
      hasAIContext,
      hasAILogicalRegion,
      hasAIDependency,
      followsNamingConvention,
      isTypeScriptCompliant,
      // T013: Enhanced fields
      aiContextDetails,
      logicalRegions,
      componentComplexity,
      codeQualityScore,
      securityScore,
      performanceScore,
      architecturalRole,
      testCoverage,
    };
  } catch (error) {
    console.warn(`Warning: Could not analyze file ${filePath}:`, error);
    return createDefaultComponentInfo(filePath);
  }
}

function createDefaultComponentInfo(filePath: string): ComponentInfo {
  const fileName = filePath.split(/[/\\]/).pop() || "";
  const componentName = fileName.replace(/\.(ts|tsx|js|jsx)$/, "");

  return {
    filePath,
    name: componentName,
    type: "unknown",
    imports: [],
    exports: [],
    dependencies: [],
    hasAIContext: false,
    hasAILogicalRegion: false,
    hasAIDependency: false,
    followsNamingConvention: false,
    isTypeScriptCompliant: false,
    aiContextDetails: null,
    logicalRegions: [],
    componentComplexity: 0,
    codeQualityScore: 0,
    securityScore: 50, // Default neutral score
    performanceScore: 50, // Default neutral score
    architecturalRole: "unknown",
    testCoverage: { hasTest: false },
  };
}

// AI-LOGICAL-REGION: T013 Enhanced Analysis Functions
function extractAIContextDetails(
  content: string
): ComponentInfo["aiContextDetails"] {
  const contextMatch = content.match(
    /\/\/ AI-AGENT CONTEXT:\s*FILE=([^|]+)\|\s*ROLE=([^|]+)\|\s*PURPOSE=(.+)/
  );
  if (!contextMatch) return null;

  return {
    file: contextMatch[1].trim(),
    role: contextMatch[2].trim(),
    purpose: contextMatch[3].trim(),
  };
}

function extractLogicalRegions(content: string): string[] {
  const regionMatches = content.match(/\/\/ AI-LOGICAL-REGION:\s*(.+)/g);
  if (!regionMatches) return [];

  return regionMatches.map((match) =>
    match.replace(/\/\/ AI-LOGICAL-REGION:\s*/, "").trim()
  );
}

function calculateComponentComplexity(content: string): number {
  let complexity = 1; // Base complexity

  // Count decision points
  const decisionPoints = [
    /if\s*\(/g,
    /else\s+if/g,
    /switch\s*\(/g,
    /case\s+/g,
    /while\s*\(/g,
    /for\s*\(/g,
    /\?\s*:/g, // Ternary operators
    /&&/g,
    /\|\|/g,
  ];

  decisionPoints.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) complexity += matches.length;
  });

  return complexity;
}

function calculateCodeQualityScore(content: string, filePath: string): number {
  let score = 100; // Start with perfect score

  // Deduct for code smells
  if (content.includes("any")) score -= 10;
  if (content.includes("// TODO") || content.includes("// FIXME")) score -= 5;
  if (content.length > 500 && !content.includes("AI-LOGICAL-REGION"))
    score -= 15;
  if (!/\/\/ AI-AGENT CONTEXT:/.test(content)) score -= 20;

  // Add points for good practices
  if (content.includes("interface") || content.includes("type")) score += 5;
  if (content.includes("React.FC")) score += 5;
  if (/export\s+default/.test(content)) score += 5;

  return Math.max(0, Math.min(100, score));
}

function calculateSecurityScore(content: string): number {
  let score = 100;

  // Check for security concerns
  const securityConcerns = [
    /dangerouslySetInnerHTML/g,
    /eval\(/g,
    /innerHTML\s*=/g,
    /document\.write/g,
    /window\.location\s*=/g,
  ];

  securityConcerns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) score -= matches.length * 20;
  });

  // Check for security-positive patterns
  if (content.includes("// AI-SECURITY:")) score += 10;
  if (
    content.includes("validateProject") ||
    content.includes("validateCertificate")
  )
    score += 10;

  return Math.max(0, Math.min(100, score));
}

function calculatePerformanceScore(content: string): number {
  let score = 100;

  // Performance concerns
  if (content.includes("console.log") && !content.includes("development"))
    score -= 5;
  if (content.match(/useEffect\s*\(\s*\(\s*\)\s*=>/)) score -= 10; // Missing deps

  // Performance positives
  if (
    content.includes("React.memo") ||
    content.includes("useMemo") ||
    content.includes("useCallback")
  )
    score += 10;
  if (content.includes("React.lazy")) score += 15;
  if (content.includes("// AI-PERFORMANCE:")) score += 10;

  return Math.max(0, Math.min(100, score));
}

function determineArchitecturalRole(
  filePath: string,
  content: string,
  imports: string[],
  exports: string[]
): string {
  if (filePath.includes("App.tsx")) return "application-root";
  if (filePath.includes("/pages/")) return "page-component";
  if (filePath.includes("/components/") && exports.length > 0)
    return "reusable-component";
  if (filePath.includes("/types/")) return "type-definition";
  if (filePath.includes("/api/")) return "api-layer";
  if (filePath.includes("/utils/")) {
    if (content.includes("validate") || content.includes("check"))
      return "validation-utility";
    if (content.includes("analyze") || content.includes("structure"))
      return "analysis-utility";
    return "helper-utility";
  }
  if (filePath.includes("config")) return "configuration";
  return "unknown";
}

function analyzeTestCoverage(
  filePath: string,
  componentName: string,
  allFiles: string[]
): ComponentInfo["testCoverage"] {
  const possibleTestPaths = [
    filePath.replace(/\.(tsx?|jsx?)$/, ".test.$1"),
    filePath.replace(/\.(tsx?|jsx?)$/, ".spec.$1"),
    join(dirname(filePath), "__tests__", basename(filePath)),
    join(dirname(filePath), `${componentName}.test.ts`),
    join(dirname(filePath), `${componentName}.test.tsx`),
  ];

  for (const testPath of possibleTestPaths) {
    if (allFiles.includes(testPath)) {
      return { hasTest: true, testFilePath: testPath };
    }
  }

  return { hasTest: false };
}

// AI-LOGICAL-REGION: Content Parsing Utilities
function extractImports(content: string): string[] {
  const importRegex = /import\s+(?:.*?\s+from\s+)?['"`]([^'"`]+)['"`]/g;
  const imports: string[] = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

function extractExports(content: string): string[] {
  const exports: string[] = [];

  // Default exports
  const defaultExportRegex = /export\s+default\s+(\w+)/g;
  let match;
  while ((match = defaultExportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  // Named exports
  const namedExportRegex =
    /export\s+(?:const|function|class|interface|type)\s+(\w+)/g;
  while ((match = namedExportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  return exports;
}

function extractDependencies(content: string): string[] {
  const dependencies: string[] = [];

  // Look for AI-DEPENDENCY tags
  const aiDepRegex = /\/\/ AI-DEPENDENCY:\s*(.+)/g;
  let match;
  while ((match = aiDepRegex.exec(content)) !== null) {
    const deps = match[1].split(",").map((dep) => dep.trim());
    dependencies.push(...deps);
  }

  return dependencies;
}

// AI-LOGICAL-REGION: Pattern Recognition Functions
function determineComponentType(
  filePath: string,
  content: string
): ComponentInfo["type"] {
  // Normalize path separators for cross-platform compatibility
  const normalizedPath = filePath.replace(/\\/g, "/");

  if (normalizedPath.includes("/pages/")) {
    return "page";
  }
  if (normalizedPath.includes("/components/")) {
    return "component";
  }
  if (normalizedPath.includes("/types/")) {
    return "type";
  }
  if (normalizedPath.includes("/api/")) {
    return "api";
  }
  if (normalizedPath.includes("/utils/")) {
    return "utility";
  }

  return "unknown";
}

function checkNamingConvention(fileName: string, filePath: string): boolean {
  // Check if file follows PascalCase for components or camelCase for utilities
  const nameWithoutExt = fileName.replace(/\.(ts|tsx|js|jsx)$/, "");

  // Normalize path separators for cross-platform compatibility
  const normalizedPath = filePath.replace(/\\/g, "/");

  // Special cases that are always valid
  if (nameWithoutExt === "App") return true; // App.tsx is a valid root component name
  if (nameWithoutExt.endsWith(".d")) return true; // Declaration files like declarations.d.ts
  if (nameWithoutExt.includes(".config") || nameWithoutExt.includes(".setup"))
    return true; // Config files
  if (nameWithoutExt === "main" || nameWithoutExt === "index") return true; // Entry point files

  // Frontend component and page naming (PascalCase)
  if (
    normalizedPath.includes("/components/") ||
    normalizedPath.includes("/pages/")
  ) {
    // Components should be PascalCase - allow compound words
    return /^[A-Z][a-zA-Z0-9]*$/.test(nameWithoutExt);
  }

  // Backend database files (snake_case is acceptable)
  if (normalizedPath.includes("/db/") || normalizedPath.includes("-backend/")) {
    // Backend files can use snake_case or camelCase
    return /^[a-z][a-zA-Z0-9_]*$/.test(nameWithoutExt);
  }

  // Frontend utilities and other files (camelCase)
  if (
    normalizedPath.includes("/utils/") ||
    normalizedPath.includes("/api/") ||
    normalizedPath.includes("/types/")
  ) {
    // Utilities should be camelCase - allow compound words
    return /^[a-z][a-zA-Z0-9]*$/.test(nameWithoutExt);
  }

  // Default: allow both camelCase and PascalCase for flexibility
  return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(nameWithoutExt);
}

function checkTypeScriptCompliance(content: string, filePath: string): boolean {
  const isTypeScriptFile =
    filePath.endsWith(".ts") || filePath.endsWith(".tsx");
  if (!isTypeScriptFile) return false;

  // Check for basic TypeScript patterns
  const hasTypedParams = /:\s*\w+/.test(content);
  const noAnyTypes = !/:\s*any/.test(content);
  const hasTypeDeclarations = /interface\s+\w+|type\s+\w+/.test(content);

  return hasTypedParams && noAnyTypes && hasTypeDeclarations;
}

// AI-LOGICAL-REGION: Architecture Pattern Analysis
function analyzeArchitecturePatterns(
  components: ComponentInfo[]
): ArchitecturePattern[] {
  const patterns: ArchitecturePattern[] = [
    {
      pattern: "Component Co-location",
      description: "Components should be co-located with their CSS files",
      examples: components
        .filter((c) => c.type === "component" || c.type === "page")
        .filter((c) => {
          // Check if this component is actually co-located
          const componentDir = dirname(c.filePath);
          const cssFileName = `${c.name}.css`;
          try {
            const dirContents = readdirSync(componentDir);
            return dirContents.includes(cssFileName);
          } catch {
            return false;
          }
        })
        .map((c) => c.filePath),
      compliance: checkComponentColocation(components),
      severity: "important",
      automationPossible: false,
      agentGuidance: "Ensure components are in the same folder as their styles",
    },
    {
      pattern: "AI Context Tags",
      description: "All files should have AI-AGENT CONTEXT tags",
      examples: components.filter((c) => c.hasAIContext).map((c) => c.filePath),
      compliance:
        components.filter((c) => c.hasAIContext).length / components.length >
        0.8,
      severity: "critical",
      automationPossible: true,
      agentGuidance:
        "Add AI-AGENT CONTEXT tags to all files, specifying role and purpose",
    },
    {
      pattern: "TypeScript Strict Mode",
      description: "All TypeScript files should follow strict typing",
      examples: components
        .filter((c) => c.isTypeScriptCompliant)
        .map((c) => c.filePath),
      compliance:
        components.filter((c) => c.isTypeScriptCompliant).length /
          components.length >
        0.9,
      severity: "important",
      automationPossible: false,
      agentGuidance:
        "Review TypeScript files for strict typing compliance, especially function parameters",
    },
    {
      pattern: "Naming Conventions",
      description: "Files should follow established naming conventions",
      examples: components
        .filter((c) => c.followsNamingConvention)
        .map((c) => c.filePath),
      compliance:
        components.filter((c) => c.followsNamingConvention).length /
          components.length >
        0.8,
      severity: "minor",
      automationPossible: true,
      agentGuidance:
        "Rename files to follow naming conventions: PascalCase for components, camelCase for utilities",
    },
  ];

  return patterns;
}

function checkComponentColocation(components: ComponentInfo[]): boolean {
  // Check both components and pages for CSS co-location
  const componentFiles = components.filter(
    (c) => c.type === "component" || c.type === "page"
  );
  let colocatedCount = 0;

  // Debug: Let's track which components are co-located
  const colocatedComponents: string[] = [];

  for (const component of componentFiles) {
    // Check if corresponding CSS file exists in the same directory
    const componentDir = dirname(component.filePath);
    const cssFileName = `${component.name}.css`;

    try {
      // Check if CSS file exists by reading the file system
      const dirContents = readdirSync(componentDir);
      const hasCssFile = dirContents.includes(cssFileName);

      if (hasCssFile) {
        colocatedCount++;
        colocatedComponents.push(component.name);
      }
    } catch (error) {
      // If we can't read the directory, assume not co-located
      continue;
    }
  }

  // All components should be co-located for 100% compliance
  return colocatedCount === componentFiles.length;
}

// AI-LOGICAL-REGION: Dependency Graph Generation
function buildDependencyGraph(
  components: ComponentInfo[]
): Record<string, string[]> {
  const graph: Record<string, string[]> = {};

  for (const component of components) {
    const componentKey = relative(process.cwd(), component.filePath);
    graph[componentKey] = [];

    // Add import dependencies
    for (const importPath of component.imports) {
      if (importPath.startsWith("./") || importPath.startsWith("../")) {
        // Resolve relative imports to component names
        const resolvedComponents = components.filter((c) =>
          c.filePath.includes(importPath.replace("./", "").replace("../", ""))
        );
        graph[componentKey].push(...resolvedComponents.map((c) => c.name));
      }
    }

    // Add AI-DEPENDENCY tag dependencies
    graph[componentKey].push(...component.dependencies);
  }

  return graph;
}

// AI-LOGICAL-REGION: Main Analysis Function
export function analyzeCodeStructure(
  projectRoot: string
): CodeStructureAnalysis {
  try {
    const files = getProjectFiles(projectRoot);
    const components = files.map((file) => analyzeFileContent(file, files));

    // AI-LOGICAL-REGION: Calculate Enhanced Metrics
    const aiOptimizationCoverage = {
      contextTags: components.filter((c) => c.hasAIContext).length,
      logicalRegions: components.filter((c) => c.hasAILogicalRegion).length,
      dependencyTags: components.filter((c) => c.hasAIDependency).length,
      totalCoverage:
        (components.filter((c) => c.hasAIContext).length / components.length) *
        100,
      // T013: Enhanced coverage metrics
      contextQuality:
        (components.filter((c) => c.aiContextDetails !== null).length /
          Math.max(1, components.filter((c) => c.hasAIContext).length)) *
        100,
      tagConsistency:
        (components.filter((c) => c.hasAIContext && c.hasAILogicalRegion)
          .length /
          Math.max(1, components.filter((c) => c.hasAIContext).length)) *
        100,
      coverageGaps: components
        .filter((c) => !c.hasAIContext)
        .map((c) => relative(projectRoot, c.filePath)),
    };

    const patterns = analyzeArchitecturePatterns(components);
    const dependencyGraph = buildDependencyGraph(components);

    // T013: Enhanced relationship and insight analysis
    const componentRelationships = buildComponentRelationships(components);
    const architecturalInsights = generateArchitecturalInsights(components);
    const codeSmells = detectCodeSmells(components);

    // AI-LOGICAL-REGION: Enhanced Architecture Compliance Assessment
    const complianceScore = patterns.reduce((acc, pattern) => {
      const weight =
        pattern.severity === "critical"
          ? 40
          : pattern.severity === "important"
            ? 25
            : 15;
      return acc + (pattern.compliance ? weight : 0);
    }, 0);

    const violations: string[] = [];
    const recommendations: string[] = [];
    const patternMaturity: Record<string, number> = {};
    const complianceTrends: string[] = [];

    patterns.forEach((pattern) => {
      const compliancePercentage =
        (pattern.examples.length / components.length) * 100;
      patternMaturity[pattern.pattern] = compliancePercentage;

      if (!pattern.compliance) {
        violations.push(`Pattern violation: ${pattern.pattern}`);
        recommendations.push(pattern.agentGuidance);

        if (pattern.severity === "critical") {
          complianceTrends.push(
            `Critical: ${pattern.pattern} needs immediate attention`
          );
        }
      } else {
        complianceTrends.push(`Good: ${pattern.pattern} is well-established`);
      }
    });

    const codeQualityMetrics = {
      typeScriptCoverage:
        (components.filter((c) => c.isTypeScriptCompliant).length /
          components.length) *
        100,
      componentIsolationScore: patterns.find(
        (p) => p.pattern === "Component Co-location"
      )?.compliance
        ? 100
        : 50,
      namingConventionCompliance:
        (components.filter((c) => c.followsNamingConvention).length /
          components.length) *
        100,
      // T013: Enhanced quality metrics
      maintainabilityIndex: calculateMaintainabilityIndex(components),
      technicalDebtScore: calculateTechnicalDebt(components),
      aiAgentOptimizationScore: calculateAIAgentOptimization(components),
    };

    return {
      projectRoot,
      totalFiles: files.length,
      componentCount: components.length,
      aiOptimizationCoverage,
      components,
      patterns,
      dependencyGraph,
      // T013: Enhanced analysis features
      componentRelationships,
      architecturalInsights,
      codeSmells,
      architectureCompliance: {
        score: Math.min(100, complianceScore),
        violations,
        recommendations,
        // T013: Enhanced compliance tracking
        patternMaturity,
        complianceTrends,
      },
      codeQualityMetrics,
      // T013: Enhanced workspace intelligence
      workspaceIntelligence: {
        hotspots: identifyHotspots(components),
        recommendations: generateEnhancedRecommendations(
          components,
          architecturalInsights
        ),
        developmentPatterns: analyzeDevelopmentPatterns(components),
      },
    };
  } catch (error) {
    throw new Error(`Failed to analyze code structure: ${error}`);
  }
}

// AI-LOGICAL-REGION: T013 Enhanced Relationship Analysis
function buildComponentRelationships(
  components: ComponentInfo[]
): ComponentRelationship[] {
  const relationships: ComponentRelationship[] = [];

  components.forEach((component) => {
    // Import relationships
    component.imports.forEach((importPath) => {
      if (importPath.startsWith("./") || importPath.startsWith("../")) {
        const targetComponent = components.find((c) =>
          c.filePath.includes(importPath.replace("./", "").replace("../", ""))
        );
        if (targetComponent) {
          relationships.push({
            from: component.name,
            to: targetComponent.name,
            relationshipType: "imports",
            strength: 8, // High strength for direct imports
          });
        }
      }
    });

    // AI-DEPENDENCY relationships
    component.dependencies.forEach((dep) => {
      const targetComponent = components.find((c) => c.name === dep);
      if (targetComponent) {
        relationships.push({
          from: component.name,
          to: targetComponent.name,
          relationshipType: "dependency",
          strength: 6, // Medium strength for AI dependencies
        });
      }
    });

    // Test relationships
    if (component.testCoverage.hasTest) {
      relationships.push({
        from: `${component.name}.test`,
        to: component.name,
        relationshipType: "test",
        strength: 5, // Medium strength for test relationships
      });
    }
  });

  return relationships;
}

// AI-LOGICAL-REGION: T013 Enhanced Architectural Insights
function generateArchitecturalInsights(
  components: ComponentInfo[]
): ArchitecturalInsight[] {
  const insights: ArchitecturalInsight[] = [];

  // Analyze component distribution
  const componentsByType = components.reduce(
    (acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (componentsByType.page && componentsByType.component) {
    const ratio = componentsByType.component / componentsByType.page;
    if (ratio < 2) {
      insights.push({
        category: "structure",
        insight: `Low reusable component ratio (${ratio.toFixed(1)}:1). Consider extracting more reusable components.`,
        impact: "medium",
        actionable: true,
        agentRecommendation:
          "Look for repeated patterns in pages and extract them into reusable components",
      });
    }
  }

  // Analyze AI optimization gaps
  const unoptimizedComponents = components.filter((c) => !c.hasAIContext);
  if (unoptimizedComponents.length > 0) {
    insights.push({
      category: "patterns",
      insight: `${unoptimizedComponents.length} components lack AI optimization tags`,
      impact: "high",
      actionable: true,
      agentRecommendation: `Add AI-AGENT CONTEXT tags to: ${unoptimizedComponents
        .slice(0, 3)
        .map((c) => c.name)
        .join(", ")}`,
    });
  }

  // Analyze complexity distribution
  const highComplexityComponents = components.filter(
    (c) => c.componentComplexity > 10
  );
  if (highComplexityComponents.length > 0) {
    insights.push({
      category: "quality",
      insight: `${highComplexityComponents.length} components have high complexity (>10)`,
      impact: "medium",
      actionable: true,
      agentRecommendation:
        "Consider breaking down complex components into smaller, focused components",
    });
  }

  // Analyze security patterns
  const lowSecurityComponents = components.filter((c) => c.securityScore < 70);
  if (lowSecurityComponents.length > 0) {
    insights.push({
      category: "security",
      insight: `${lowSecurityComponents.length} components have security concerns`,
      impact: "high",
      actionable: true,
      agentRecommendation:
        "Review components for security patterns and add AI-SECURITY tags where needed",
    });
  }

  // Analyze dependency patterns
  const heavyDependencyComponents = components.filter(
    (c) => c.dependencies.length > 5
  );
  if (heavyDependencyComponents.length > 0) {
    insights.push({
      category: "dependencies",
      insight: `${heavyDependencyComponents.length} components have heavy dependency loads`,
      impact: "medium",
      actionable: true,
      agentRecommendation:
        "Review and optimize component dependencies to reduce coupling",
    });
  }

  return insights;
}

// AI-LOGICAL-REGION: T013 Enhanced Code Smell Detection
function detectCodeSmells(components: ComponentInfo[]): {
  circularDependencies: string[][];
  orphanedComponents: string[];
  oversizedComponents: string[];
  underdocumentedComponents: string[];
} {
  const circularDependencies: string[][] = [];
  const orphanedComponents: string[] = [];
  const oversizedComponents: string[] = [];
  const underdocumentedComponents: string[] = [];

  // Detect circular dependencies (simplified)
  components.forEach((component) => {
    component.dependencies.forEach((dep) => {
      const depComponent = components.find((c) => c.name === dep);
      if (depComponent && depComponent.dependencies.includes(component.name)) {
        circularDependencies.push([component.name, dep]);
      }
    });
  });

  // Detect orphaned components (no imports, no exports to other components)
  components.forEach((component) => {
    const isImported = components.some((c) =>
      c.imports.some((imp) => imp.includes(component.name))
    );
    const isInDependencies = components.some((c) =>
      c.dependencies.includes(component.name)
    );

    if (
      !isImported &&
      !isInDependencies &&
      component.exports.length === 0 &&
      component.type !== "page"
    ) {
      orphanedComponents.push(component.name);
    }
  });

  // Detect oversized components
  components.forEach((component) => {
    if (component.componentComplexity > 15) {
      oversizedComponents.push(component.name);
    }
  });

  // Detect underdocumented components
  components.forEach((component) => {
    if (!component.hasAIContext || component.logicalRegions.length === 0) {
      underdocumentedComponents.push(component.name);
    }
  });

  return {
    circularDependencies,
    orphanedComponents,
    oversizedComponents,
    underdocumentedComponents,
  };
}

// AI-LOGICAL-REGION: T013 Enhanced Recommendation Generation
function generateEnhancedRecommendations(
  components: ComponentInfo[],
  insights: ArchitecturalInsight[]
): {
  priority: "high" | "medium" | "low";
  action: string;
  impact: string;
  effort: "low" | "medium" | "high";
}[] {
  const recommendations = [];

  // High priority: AI optimization gaps
  const unoptimizedComponents = components.filter((c) => !c.hasAIContext);
  if (unoptimizedComponents.length > 0) {
    recommendations.push({
      priority: "high" as const,
      action: `Add AI-AGENT CONTEXT tags to ${unoptimizedComponents.length} components`,
      impact:
        "Dramatically improves AI agent understanding and workspace navigation",
      effort: "low" as const,
    });
  }

  // High priority: Security concerns
  const securityIssues = components.filter((c) => c.securityScore < 60);
  if (securityIssues.length > 0) {
    recommendations.push({
      priority: "high" as const,
      action: `Review security patterns in ${securityIssues.length} components`,
      impact: "Prevents potential security vulnerabilities",
      effort: "medium" as const,
    });
  }

  // Medium priority: Complexity issues
  const complexComponents = components.filter(
    (c) => c.componentComplexity > 10
  );
  if (complexComponents.length > 0) {
    recommendations.push({
      priority: "medium" as const,
      action: `Refactor ${complexComponents.length} high-complexity components`,
      impact: "Improves maintainability and reduces bug potential",
      effort: "high" as const,
    });
  }

  // Medium priority: TypeScript compliance
  const nonCompliantTS = components.filter((c) => !c.isTypeScriptCompliant);
  if (nonCompliantTS.length > 0) {
    recommendations.push({
      priority: "medium" as const,
      action: `Improve TypeScript compliance in ${nonCompliantTS.length} files`,
      impact: "Enhances type safety and development experience",
      effort: "medium" as const,
    });
  }

  // Low priority: Test coverage
  const untestedComponents = components.filter(
    (c) => !c.testCoverage.hasTest && c.type === "component"
  );
  if (untestedComponents.length > 0) {
    recommendations.push({
      priority: "low" as const,
      action: `Add tests for ${untestedComponents.length} components`,
      impact: "Improves code reliability and refactoring confidence",
      effort: "high" as const,
    });
  }

  // Add insight-based recommendations
  insights.forEach((insight) => {
    if (insight.actionable) {
      recommendations.push({
        priority:
          insight.impact === "high"
            ? "high"
            : insight.impact === "medium"
              ? "medium"
              : "low",
        action: insight.agentRecommendation,
        impact: insight.insight,
        effort: "medium" as const,
      });
    }
  });

  return recommendations.slice(0, 10); // Limit to top 10 recommendations
}

// AI-LOGICAL-REGION: T013 Missing Helper Functions Implementation
function calculateMaintainabilityIndex(components: ComponentInfo[]): number {
  let totalScore = 0;

  components.forEach((component) => {
    let score = 100;

    // Deduct for complexity
    score -= Math.min(component.componentComplexity * 2, 30);

    // Deduct for poor documentation
    if (!component.hasAIContext) score -= 20;
    if (component.logicalRegions.length === 0) score -= 10;

    // Add for good practices
    if (component.isTypeScriptCompliant) score += 10;
    if (component.testCoverage.hasTest) score += 15;

    totalScore += Math.max(0, Math.min(100, score));
  });

  return totalScore / components.length;
}

function calculateTechnicalDebt(components: ComponentInfo[]): number {
  let debtScore = 0;

  components.forEach((component) => {
    // Add debt for missing AI optimization
    if (!component.hasAIContext) debtScore += 10;
    if (!component.hasAILogicalRegion) debtScore += 5;

    // Add debt for poor quality
    if (!component.isTypeScriptCompliant) debtScore += 8;
    if (component.componentComplexity > 10) debtScore += 12;
    if (!component.followsNamingConvention) debtScore += 3;

    // Add debt for security/performance issues
    if (component.securityScore < 70) debtScore += 15;
    if (component.performanceScore < 70) debtScore += 8;
  });

  // Return as percentage (0-100, where 100 is maximum debt)
  return Math.min(100, debtScore / components.length);
}

function calculateAIAgentOptimization(components: ComponentInfo[]): number {
  let optimizationScore = 0;

  components.forEach((component) => {
    let score = 0;

    // AI optimization features
    if (component.hasAIContext) score += 25;
    if (component.aiContextDetails) score += 10; // Well-formed context
    if (component.hasAILogicalRegion) score += 15;
    if (component.hasAIDependency) score += 10;

    // Code quality features that help agents
    if (component.isTypeScriptCompliant) score += 15;
    if (component.followsNamingConvention) score += 10;
    if (component.codeQualityScore > 80) score += 10;

    // Architectural clarity
    if (component.architecturalRole !== "unknown") score += 5;

    optimizationScore += Math.min(100, score);
  });

  return optimizationScore / components.length;
}

function identifyHotspots(components: ComponentInfo[]): string[] {
  const hotspots: string[] = [];

  // Components with high complexity are hotspots
  components
    .filter((c) => c.componentComplexity > 10)
    .forEach((c) =>
      hotspots.push(`${c.name} (high complexity: ${c.componentComplexity})`)
    );

  // Components with many dependencies are hotspots
  components
    .filter((c) => c.dependencies.length > 3)
    .forEach((c) =>
      hotspots.push(`${c.name} (heavy dependencies: ${c.dependencies.length})`)
    );

  // Application root components are always hotspots
  components
    .filter((c) => c.architecturalRole === "application-root")
    .forEach((c) => hotspots.push(`${c.name} (application root)`));

  // Components with poor AI optimization are hotspots for improvement
  components
    .filter((c) => !c.hasAIContext && c.type !== "unknown")
    .forEach((c) => hotspots.push(`${c.name} (needs AI optimization)`));

  return hotspots.slice(0, 10); // Limit to top 10 hotspots
}

function analyzeDevelopmentPatterns(components: ComponentInfo[]): {
  pattern: string;
  frequency: number;
  recommendation: string;
}[] {
  const patterns = [];

  // Analyze AI optimization patterns
  const aiOptimizedCount = components.filter((c) => c.hasAIContext).length;
  const totalCount = components.length;

  patterns.push({
    pattern: "AI Context Tag Usage",
    frequency: (aiOptimizedCount / totalCount) * 100,
    recommendation:
      aiOptimizedCount < totalCount * 0.8
        ? "Increase AI tag usage for better agent understanding"
        : "Maintain excellent AI optimization coverage",
  });

  // Analyze TypeScript usage patterns
  const tsCompliantCount = components.filter(
    (c) => c.isTypeScriptCompliant
  ).length;
  patterns.push({
    pattern: "TypeScript Strict Compliance",
    frequency: (tsCompliantCount / totalCount) * 100,
    recommendation:
      tsCompliantCount < totalCount * 0.9
        ? "Improve TypeScript strict mode compliance"
        : "Excellent TypeScript usage throughout codebase",
  });

  // Analyze component complexity patterns
  const highComplexityCount = components.filter(
    (c) => c.componentComplexity > 10
  ).length;
  patterns.push({
    pattern: "High Complexity Components",
    frequency: (highComplexityCount / totalCount) * 100,
    recommendation:
      highComplexityCount > totalCount * 0.2
        ? "Consider refactoring complex components for better maintainability"
        : "Good complexity distribution across components",
  });

  // Analyze naming convention patterns
  const namingCompliantCount = components.filter(
    (c) => c.followsNamingConvention
  ).length;
  patterns.push({
    pattern: "Naming Convention Compliance",
    frequency: (namingCompliantCount / totalCount) * 100,
    recommendation:
      namingCompliantCount < totalCount * 0.8
        ? "Standardize naming conventions across the codebase"
        : "Consistent naming patterns established",
  });

  // Analyze test coverage patterns
  const testedComponentCount = components.filter(
    (c) => c.testCoverage.hasTest
  ).length;
  patterns.push({
    pattern: "Test Coverage",
    frequency: (testedComponentCount / totalCount) * 100,
    recommendation:
      testedComponentCount < totalCount * 0.5
        ? "Increase test coverage for better code reliability"
        : "Good test coverage across components",
  });

  return patterns;
}

// AI-LOGICAL-REGION: Agent Helper Functions
export function getComponentInfo(
  componentName: string,
  analysis: CodeStructureAnalysis
): ComponentInfo | null {
  return analysis.components.find((c) => c.name === componentName) || null;
}

export function findSimilarComponents(
  componentType: ComponentInfo["type"],
  analysis: CodeStructureAnalysis
): ComponentInfo[] {
  return analysis.components.filter((c) => c.type === componentType);
}

export function getArchitectureRecommendations(
  analysis: CodeStructureAnalysis
): string[] {
  return analysis.architectureCompliance.recommendations;
}

export function validateNewComponentPattern(
  componentPath: string,
  componentContent: string,
  analysis: CodeStructureAnalysis
): { isValid: boolean; suggestions: string[] } {
  const suggestions: string[] = [];
  let isValid = true;

  // Check AI context tag
  if (!/\/\/ AI-AGENT CONTEXT:/.test(componentContent)) {
    isValid = false;
    suggestions.push("Add AI-AGENT CONTEXT tag at the top of the file");
  }

  // Check naming convention
  const fileName = componentPath.split(/[/\\]/).pop() || "";
  if (!checkNamingConvention(fileName, componentPath)) {
    isValid = false;
    suggestions.push(
      "Follow naming convention: PascalCase for components, camelCase for utilities"
    );
  }

  // Check TypeScript compliance
  if (!checkTypeScriptCompliance(componentContent, componentPath)) {
    isValid = false;
    suggestions.push('Ensure proper TypeScript typing and avoid "any" types');
  }

  // T013: Enhanced validation checks
  const aiContextDetails = extractAIContextDetails(componentContent);
  if (
    !aiContextDetails ||
    !aiContextDetails.role ||
    !aiContextDetails.purpose
  ) {
    isValid = false;
    suggestions.push(
      "Ensure AI-AGENT CONTEXT includes FILE, ROLE, and PURPOSE fields"
    );
  }

  const logicalRegions = extractLogicalRegions(componentContent);
  if (componentContent.length > 300 && logicalRegions.length === 0) {
    isValid = false;
    suggestions.push("Add AI-LOGICAL-REGION tags to organize code sections");
  }

  const complexity = calculateComponentComplexity(componentContent);
  if (complexity > 15) {
    suggestions.push(
      "Consider breaking down this complex component (complexity: " +
        complexity +
        ")"
    );
  }

  const securityScore = calculateSecurityScore(componentContent);
  if (securityScore < 70) {
    suggestions.push("Review component for security concerns");
  }

  return { isValid, suggestions };
}

// AI-LOGICAL-REGION: T013 New Export Functions for Enhanced Analysis
export function getComponentRelationships(
  analysis: CodeStructureAnalysis
): ComponentRelationship[] {
  return analysis.componentRelationships;
}

export function getArchitecturalInsights(
  analysis: CodeStructureAnalysis
): ArchitecturalInsight[] {
  return analysis.architecturalInsights;
}

export function getCodeSmells(
  analysis: CodeStructureAnalysis
): CodeStructureAnalysis["codeSmells"] {
  return analysis.codeSmells;
}

export function getWorkspaceIntelligence(
  analysis: CodeStructureAnalysis
): CodeStructureAnalysis["workspaceIntelligence"] {
  return analysis.workspaceIntelligence;
}

export function generateDetailedComponentReport(
  componentName: string,
  analysis: CodeStructureAnalysis
): string {
  const component = getComponentInfo(componentName, analysis);
  if (!component) {
    return `❌ Component "${componentName}" not found in analysis`;
  }

  const relationships = analysis.componentRelationships.filter(
    (r) => r.from === componentName || r.to === componentName
  );

  return `
🔍 ENHANCED COMPONENT ANALYSIS - ${componentName}

📁 BASIC INFO:
  • File: ${relative(analysis.projectRoot, component.filePath)}
  • Type: ${component.type}
  • Architectural Role: ${component.architecturalRole}

🤖 AI OPTIMIZATION STATUS:
  • AI Context: ${component.hasAIContext ? "✅" : "❌"}
  • Context Details: ${component.aiContextDetails ? `${component.aiContextDetails.role} | ${component.aiContextDetails.purpose}` : "None"}
  • Logical Regions: ${component.logicalRegions.length} (${component.logicalRegions.join(", ")})
  • AI Dependencies: ${component.dependencies.length > 0 ? component.dependencies.join(", ") : "None"}

📊 QUALITY METRICS:
  • Complexity Score: ${component.componentComplexity}/20
  • Code Quality: ${component.codeQualityScore}/100
  • Security Score: ${component.securityScore}/100
  • Performance Score: ${component.performanceScore}/100
  • TypeScript Compliant: ${component.isTypeScriptCompliant ? "✅" : "❌"}

🔗 RELATIONSHIPS (${relationships.length}):
${
  relationships.length > 0
    ? relationships
        .map(
          (r) =>
            `  • ${r.relationshipType}: ${r.from} → ${r.to} (strength: ${r.strength}/10)`
        )
        .join("\n")
    : "  • No direct relationships found"
}

🧪 TEST COVERAGE:
  • Has Tests: ${component.testCoverage.hasTest ? "✅" : "❌"}
  ${component.testCoverage.testFilePath ? `• Test File: ${component.testCoverage.testFilePath}` : ""}

🎯 RECOMMENDATIONS:
${!component.hasAIContext ? "  • Add AI-AGENT CONTEXT tag for better agent understanding" : ""}
${component.componentComplexity > 10 ? "  • Consider breaking down this complex component" : ""}
${!component.isTypeScriptCompliant ? "  • Improve TypeScript compliance" : ""}
${component.securityScore < 70 ? "  • Review for security concerns" : ""}
${!component.testCoverage.hasTest && component.type === "component" ? "  • Add unit tests" : ""}
`;
}

// AI-NAVIGATION: EXPORT=analyzeCodeStructure,getComponentInfo,findSimilarComponents,getArchitectureRecommendations,validateNewComponentPattern,getComponentRelationships,getArchitecturalInsights,getCodeSmells,getWorkspaceIntelligence,generateDetailedComponentReport
