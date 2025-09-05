// filepath: c:\Users\sascha fischer\Documents\VSCode\Portfolio_AI_Driven\my-portfolio-frontend\src\setupTests.ts
// AI-AGENT CONTEXT: FILE=setupTests | ROLE=Test_Configuration | PURPOSE=Jest_Test_Setup
// AI-NAVIGATION: IMPORTS=[jest-dom]
// AI-DEPENDENCY: Jest,Testing-Library
// AI-PERFORMANCE: TEST_SETUP

// AI-LOGICAL-REGION: Test_Setup_Configuration
import "@testing-library/jest-dom";

// Additional test setup configuration can be added here
// This file is run before each test file

// Configure Jest DOM matchers for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// AI-AGENT END OF FILE
