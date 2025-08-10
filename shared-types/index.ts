// AI-AGENT CONTEXT: FILE=sharedTypes | ROLE=Shared_Type_Definitions | PURPOSE=Cross_Project_Type_Sharing
// AI-DEPENDENCY: none

// AI-LOGICAL-REGION: Project_Interface
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  image2?: string;
  image3?: string;
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

// AI-LOGICAL-REGION: Certificate_Interface
export interface Certificate {
  id: string;
  title: string;
  type: string;
  date: string;
  issuer?: string;
  image?: string;
  link?: string;
  description?: string;
  skills?: string;
}

// AI-NAVIGATION: EXPORT=Project,Certificate
