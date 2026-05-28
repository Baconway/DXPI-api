import type { AchievementItem, basic_user_info, photoData } from "../types.js";

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

export function parse_user_stats(achivementBlock: Element): {
  name: string;
  values: AchievementItem;
} {
  const img = achivementBlock.querySelector(".musiccount_img_block img");
  const achievement_count = achivementBlock.querySelector(
    ".musiccount_counter_block",
  )?.innerHTML;

  if (!img || !achievement_count)
    return { name: "", values: { icon: "", count: "" } };

  const imgURL = img.getAttribute("src") || "";

  const achievement_name =
    imgURL
      .split("/")
      .pop()
      ?.split("?")[0]
      ?.replace("music_icon_", "")
      .replace(".png", "") || "";

  return {
    name: achievement_name,
    values: { icon: imgURL, count: achievement_count },
  };
}

export function parse_user_photo(photo_box: Element): photoData {
  const defaultDate = new Date("2026/06/07 07:27");
  const defaultLocation = "nowhere";

  const defaultReturn = {
    date: defaultDate,
    link: ALBUM_USER_PAGE,
    location: defaultLocation,
  };

  const dateTakenHeader = photo_box.querySelector(".block_info");
  const downloadSection = photo_box.querySelector(".col2.f_l");
  const locationSection = photo_box.querySelector(".col2.f_r");

  if (!dateTakenHeader || !downloadSection || !locationSection)
    return defaultReturn;
  const src = downloadSection.querySelector("a"); // href has the img link
  const locationTaken = locationSection.querySelector(".see_through_block");

  defaultReturn.date = new Date(dateTakenHeader.textContent);
  defaultReturn.link = src
    ? (src.getAttribute("href") as string)
    : ALBUM_USER_PAGE;
  defaultReturn.location = locationTaken
    ? locationTaken.textContent
    : defaultLocation;

  return defaultReturn;
}
