export interface AboutUniversityGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

export interface AboutUniversitySection {
  id: string;
  content: string;
  mission: string;
  vision: string;
  history: string;
  goals: AboutUniversityGoal[];
  pageId: string;
  pageType: string;
  pageName: string;
  pageNameEn: string;
}
