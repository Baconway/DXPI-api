import type {
  collection_img,
  collection_partner,
  collection_trophy,
  tour_member,
} from "../types.js";

const TROPHY_BG: Record<string, string> = {
  ["trophy_Normal"]:
    "https://maimaidx-eng.com/maimai-mobile/img/trophy_normal.png",
  ["trophy_Bronze"]:
    "https://maimaidx-eng.com/maimai-mobile/img/trophy_bronze.png",
  ["trophy_Silver"]:
    "https://maimaidx-eng.com/maimai-mobile/img/trophy_silver.png",
  ["trophy_Gold"]: "https://maimaidx-eng.com/maimai-mobile/img/trophy_gold.png",
  ["trophy_Rainbow"]:
    "https://maimaidx-eng.com/maimai-mobile/img/trophy_rainbow.png",
};

const trophy_expression = /trophy_(Normal|Bronze|Silver|Gold|Rainbow)/;

export const TOUR_PARTNER_PAGE =
  "https://maimaidx-eng.com/maimai-mobile/collection/character/";
export const COLLECTION_PAGES = [
  "https://maimaidx-eng.com/maimai-mobile/collection/",
  "https://maimaidx-eng.com/maimai-mobile/collection/nameplate/",
  "https://maimaidx-eng.com/maimai-mobile/collection/frame/",
];
export const COLLECTION_TROPHY_PAGE =
  "https://maimaidx-eng.com/maimai-mobile/collection/trophy/";
export const COLLECTION_PARTNER_PAGE =
  "https://maimaidx-eng.com/maimai-mobile/collection/partner/";

export function extract_tourMembers(
  tour_mem_parent: Element | null,
): tour_member[] | null {
  const tourMembers: tour_member[] = [];
  if (!tour_mem_parent) return null;
  const tour_member_holder = tour_mem_parent
    .querySelectorAll(".p_r.f_0.col5.d_ib")
    .forEach((tour_mem) => {
      const member: tour_member = {
        portrait: "",
        level: 1,
        leader: false,
      };
      member.portrait = tour_mem
        .querySelector(".chara_cycle_img")
        ?.getAttribute("src") as string;
      member.level = parseInt(
        tour_mem
          .querySelector(".collection_chara_lv_block")
          ?.textContent.replace("Lv", "")
          .trim() as string,
        10,
      );
      member.leader = tour_mem.querySelector(".collection_chara_leader")
        ? true
        : false;

      tourMembers.push(member);
    });

  return tourMembers;
}

const line_src = "https://maimaidx-eng.com/maimai-mobile/img/line_01.png";

export function extract_collection_img(
  collectionSelected: Element,
): collection_img {
  const img_items = collectionSelected.querySelectorAll(
    "img:not(.collection_setting_img)",
  );

  for (let index = 0; index < img_items.length; index++) {
    const img = img_items[index];
    const source = img?.getAttribute("src") as string;

    if (source !== line_src) {
      const collection_item_type = source.match(/(Icon|NamePlate|Frame)/);
      if (!collection_item_type) continue;

      return {
        collection_type: collection_item_type[1] as string,
        img_src: source,
      };
    }
  }

  return { collection_type: "", img_src: "" };
}

export function extract_collection_title(
  collectionSelected: Element,
): collection_trophy {
  const holder: collection_trophy = { title: "", background: "" };
  const trophy_title = collectionSelected.querySelector(
    ".collection_trophy_block span",
  );

  holder["title"] = trophy_title?.textContent as string;
  const trophy_bg_match = collectionSelected
    .querySelector(".collection_trophy_block")
    ?.className.match(trophy_expression);

  if (trophy_bg_match) {
    holder["background"] = TROPHY_BG[trophy_bg_match[0] as string] as string;
  }

  return holder;
}

export function extract_collection_partner(
  collectionSelected: Element,
): collection_partner {
  const holder: collection_partner = {
    partner: "",
    img_src: "",
    total_presents: 0,
  };

  const partner_portrait = collectionSelected.querySelector("img");
  holder.img_src = partner_portrait?.getAttribute("src") as string;

  const partner_name = collectionSelected.querySelector(
    ".w_300.f_l div.f_14.break",
  );
  holder.partner = partner_name?.textContent.trim() as string;

  const present_count = collectionSelected.querySelector(
    ".f_l div.intimate_block",
  );
  if (present_count) {
    holder.total_presents = parseInt(
      present_count.textContent.trim() as string,
      10,
    );
  }

  return holder;
}
