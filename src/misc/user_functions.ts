import type { basic_user_info } from "../types.js";

export const MAIN_USER_PAGE = "https://maimaidx-eng.com/maimai-mobile/home/";
export const STATS_USER_PAGE =
  "https://maimaidx-eng.com/maimai-mobile/playerData/";
export const ALBUM_USER_PAGE =
  "https://maimaidx-eng.com/maimai-mobile/playerData/photo/";

export function parse_user_main(user_profile: Element): basic_user_info {
  const holder: basic_user_info = {
    name: "",
    rating: 0,
    rating_wrapper: "",
    stars: 0,
    icon: "",
    course_dan: "",
    otomodachi_class: "",
  };

  holder.name = user_profile.querySelector(".name_block")?.innerHTML as string;
  holder.rating = parseInt(
    user_profile.querySelector(".rating_block")?.innerHTML as string,
    10,
  );
  holder.rating_wrapper = user_profile
    .querySelector("img[src*='rating_base_']")
    ?.getAttribute("src") as string;
  holder.stars = parseInt(
    (
      user_profile.querySelector(".p_l_10.f_l.f_14")?.textContent as string
    ).replace(/\D/g, ""),
    10,
  );
  holder.icon = user_profile
    .querySelector(".basic_block img.w_112")
    ?.getAttribute("src") as string;
  holder.course_dan = user_profile
    .querySelector("img[src*='/course/']")
    ?.getAttribute("src") as string;
  holder.otomodachi_class = user_profile
    .querySelector("img[src*='/class/']")
    ?.getAttribute("src") as string;

  return holder;
}
