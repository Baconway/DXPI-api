import type { circle_rank_info, circle_info } from "../types.js";

export const CIRCLE_RANK_PAGE =
  "https://maimaidx-eng.com/maimai-mobile/circle/circleRanking/";
export const CIRCLE_PAGE = "https://maimaidx-eng.com/maimai-mobile/circle/";

export function parse_circle_standing(
  circle_name: string | undefined,
  circle_points: string | undefined,
): circle_rank_info {
  const defaultObj = { circle_name: "", circle_points: 0 };
  if (!circle_name || !circle_points) return defaultObj;

  return {
    circle_name: circle_name.trim(),
    circle_points: parseInt(circle_points.trim(), 10),
  };
}

export function extractCircleData(
  circle: Element | null,
  points: Element | null,
  rank: Element | null,
): circle_info {
  const infoSetup: circle_info = {
    name: "",
    points: 0,
    code: "ABCDEFGH",
    rank: 0,
  };
  if (!circle || !points || !rank) return infoSetup;

  infoSetup.name = circle
    .querySelector(".circle_profile_circle_name :not([class])")
    ?.textContent.trim() as string;
  infoSetup.code = circle
    .querySelector(".circle_profile_circle_code :not([class])")
    ?.textContent.trim() as string;
  infoSetup.points = parseInt(
    points
      .querySelector(".circle_totalpoint_point :not([class])")
      ?.textContent.trim()
      .replace(/\D/g, "") as string,
    10,
  );
  infoSetup.rank = parseInt(
    rank
      .querySelector(".circle_pointranking_point :not([class])")
      ?.textContent.trim() as string,
    10,
  );

  return infoSetup;
}
