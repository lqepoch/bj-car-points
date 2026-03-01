export type MemberRole = "main" | "spouse" | "other";
export type Half = "first" | "second"; // 上半年/下半年
export type Theme = "light" | "dark" | "auto";

export type Member = {
  id: number;
  role: MemberRole;
  name: string;
  ordinaryStartYear: number | null;
  ordinaryStartHalf: Half;
  queueStartYear: number | null;
  hasC5: boolean;
};

export type ScoreDetail = {
  id: number;
  name: string;
  role: MemberRole;
  base: number;
  ordinaryRounds: number;
  pre2021Rounds: number;
  post2021Rounds: number;
  pre2021Step: number;
  post2021Step: number;
  ordinaryStep: number;
  c5Extra: number;
  queueYears: number;
  queueStep: number;
  stageTotal: number;
  familyYears: number;
  point: number;
};

export type CalculationResult = {
  ok: boolean;
  message: string;
  total: number;
  detail: ScoreDetail[];
  includeSpouse: boolean;
  generations: number;
};