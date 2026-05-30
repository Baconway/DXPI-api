import type { b50_holder, best50Song, credit } from "../types.js";

export const VERSION_CODES: Record<number, string> = {
  // maimai
  100: "maimai",
  110: "maimai PLUS",
  120: "GreeN",
  130: "GreeN PLUS",
  140: "ORANGE",
  150: "ORANGE PLUS",
  160: "PiNK",
  170: "PiNK PLUS",
  180: "MURASAKi",
  185: "MURASAKi PLUS",
  199: "FiNALE",

  // DX
  200: "maimai DX",
  205: "maimai DX PLUS",
  210: "Splash",
  215: "Splash PLUS",
  225: "UNiVERSE PLUS",
  230: "FESTiVAL",
  235: "FESTiVAL PLUS",
  240: "BUDDiES",
  245: "BUDDiES PLUS",
  250: "PRiSM",
  255: "PRiSM PLUS",
  260: "CiRCLE",
};

export const SONG_DB = "https://otoge-db.net/maimai/data/music-ex-intl.json";
export const JACKET_URL = "https://otoge-db.net/maimai/jacket/";

export const BEST50_PAGE =
  "https://maimaidx-eng.com/maimai-mobile/home/ratingTargetMusic/";
export const RECORD_PAGE = "https://maimaidx-eng.com/maimai-mobile/record/";

export function extractB50(
  b50DOM: NodeListOf<Element> | null,
): b50_holder | null {
  if (!b50DOM) return null;

  let IndexType: "New" | "Others" = "New";
  const Best50Holder: b50_holder = {
    ["New"]: [],
    ["Others"]: [],
  };

  for (const div of b50DOM) {
    if (div.classList.contains("screw_block")) {
      const HeaderText = div.textContent;
      const matchIndex = HeaderText.match(/Songs for Rating\((New|Others)\)/);

      if (matchIndex) {
        IndexType = matchIndex[1] as "New" | "Others";
      } else break; // for 3rd and 4rd headers (ie: Songs for Rating Selection(New))
      continue;
    }

    const Song_holder: best50Song = {
      songTitle: "",
      song_score: "",
      trunc_lev: "",
    };

    const songName = div.querySelector(".music_name_block")?.textContent.trim();
    const level = div.querySelector(".music_lv_block")?.textContent.trim();
    const score = div.querySelector(".music_score_block")?.textContent.trim();

    Song_holder["songTitle"] = songName ? songName : "";
    Song_holder["trunc_lev"] = level ? level : "";
    Song_holder["song_score"] = score ? score : "";

    Best50Holder[IndexType].push(Song_holder);
  }

  return Best50Holder;
}

export function extract_recent(songLogs: NodeListOf<Element>): credit[] {
  const credit: credit[] = [];
  let previousTrack_no: number = 5; // there can only be at most 4 tracks, so 5 is a good ground

  for (const song of Array.from(songLogs)) {
    const headerContainer = song.querySelector(".playlog_top_container");
    const holder: credit = {
      track: 0,
      timestamp: "",
      name: "",
    };

    if (headerContainer) {
      const trackText =
        headerContainer.querySelector(".sub_title .red")?.textContent;
      const songTimestamp = headerContainer.querySelector(
        ".sub_title span:not(.red)",
      )?.textContent;

      holder["timestamp"] = songTimestamp ? songTimestamp : "";

      if (trackText) {
        const track_no = parseInt(trackText?.replace("TRACK", ""), 10);
        holder["track"] = track_no;
        if (previousTrack_no > track_no) {
          previousTrack_no = track_no;
        } else break;
      }
    }

    const songContainer = song.querySelector(
      "div[class^='playlog_'][class$='_container']",
    );

    if (!songContainer) continue;

    const containerHeader = songContainer.querySelector(".basic_block");

    if (!containerHeader) continue;

    const convertedArr = Array.from(containerHeader.childNodes);

    const songTitle = convertedArr[2]?.textContent?.trim();
    holder["name"] = songTitle ? songTitle : "";

    credit.push(holder);
  }

  return credit;
}
