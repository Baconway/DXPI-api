export type Achivement = Record<string, AchievementItem>;
export type circleRanking = Record<string, circle>;

export interface AchievementItem {
  count: string;
  icon: string;
}

export interface network_check_result {
  status: number;
  message: string;
  cookies: string[];
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

export interface basic_user_info {
  name: string;
  rating: number;
  rating_wrapper: string;
  stars: number;
  icon: string;
  course_dan: string;
  otomodachi_class: string;
}

export interface credit {
  track: number;
  timestamp: string;
  name: string;
}

export interface tour_member {
  portrait: string;
  level: number;
  leader: boolean;
}

export interface songType {
  name: string;
  artist: string;
  version: string;

  jacket: string;

  trunc_level: {
    basic: string | 0;
    advanced: string | 0;
    expert: string | 0;
    master: string | 0;

    dx_basic: string | 0;
    dx_adv: string | 0;
    dx_exp: string | 0;
    dx_mas: string | 0;
  };

  const_level: {
    basic: number;
    advanced: number;
    expert: number;
    master: number;

    dx_basic: number;
    dx_adv: number;
    dx_exp: number;
    dx_mas: number;
  };
}

export interface best50Song {
  songTitle: string;
  trunc_lev: string;
  song_score: string;
}

export interface b50_holder {
  ["New"]: best50Song[];
  ["Others"]: best50Song[];
}
