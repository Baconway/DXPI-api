export type Achivement = Record<string, AchievementItem>;
export type circleRanking = Record<string, circle>;

export interface AchievementItem {
  count: string;
  icon: string;
}

export interface circle {
  name: string;
  points: number;
}
