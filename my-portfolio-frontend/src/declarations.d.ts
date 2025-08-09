// AI-AGENT CONTEXT: FILE=declarations | ROLE=Type_Definitions | PURPOSE=Global_Type_Declarations
// AI-NAVIGATION: IMPORTS=[]
// AI-DEPENDENCY: TypeScript
// AI-PERFORMANCE: STATIC_ANALYSIS

// AI-LOGICAL-REGION: Type_Definitions
type ImageModule = string;
type StyleModule = { [className: string]: string };

// AI-LOGICAL-REGION: Global Type Declarations
declare module "*.png" {
  const value: ImageModule;
  export default value;
}

declare module "*.jpg" {
  const value: ImageModule;
  export default value;
}

declare module "*.jpeg" {
  const value: ImageModule;
  export default value;
}

declare module "*.gif" {
  const value: ImageModule;
  export default value;
}

declare module "*.svg" {
  const value: ImageModule;
  export default value;
}

declare module "*.css" {
  const content: StyleModule;
  export default content;
}

// AI-AGENT END OF FILE
