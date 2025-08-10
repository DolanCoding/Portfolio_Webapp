/*
---
agent:
  file: shared-types/index.ts
  role: Shared_Type_Definitions
  purpose: Cross_Project_Type_Sharing
owner: TBD
stability: alpha
dependencies: []
contracts:
  exports:
    - Project
    - Certificate
tags:
  - shared
  - types
---
*/

// AI-AGENT CONTEXT: FILE=sharedTypes | ROLE=Shared_Type_Definitions | PURPOSE=Cross_Project_Type_Sharing
// AI-DEPENDENCY: none

// 🧪 CONTRACT: Shared DTOs used by both backend and frontend
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

// TODO(ai): [type=test] [impact=med] [rationale=Contract tests must assert these shapes] [plan=Add API contract tests in backend]

// AI-NAVIGATION: EXPORT=Project,Certificate
