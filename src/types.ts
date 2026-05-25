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

export interface photoData {
  date: string;
  link: string;
  location: string;
}

export interface credit {
  track: number;
  timestamp: string;
  name: string;
}
