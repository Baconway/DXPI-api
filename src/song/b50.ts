import express, { Router } from "express";
import { JSDOM } from "jsdom";

import type { best50Song, b50_holder } from "../types.js";

const route = Router();

function getBest50(b50DOM: NodeListOf<Element> | null): b50_holder | null {
  if (!b50DOM) return null;
  console.log(b50DOM.length);
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

route.use(express.json());

route.post("/", async (request, response) => {
  const { cookie } = request.body;
  const login = await fetch(
    "https://lng-tgk-aime-gw.am-all.net/common_auth/login?site_id=maimaidxex&redirect_url=https://maimaidx-eng.com/maimai-mobile/&back_url=https://maimai.sega.com/",
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Cookie: `clal=${cookie}`,
        credentials: "include",
      },

      redirect: "manual",
    },
  );

  const login3 = await fetch(login.headers.get("location") as string, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Cookie: `clal=${cookie}`,
      credentials: "include",
    },

    redirect: "manual",
  });
  const cookieBag = login3.headers.getSetCookie().join("; "); // store ssid cookies to login
  const login4 = await fetch(
    "https://maimaidx-eng.com/maimai-mobile/home/ratingTargetMusic/",
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Cookie: `${cookieBag}`,
        credentials: "include",
      },
    },
  );

  const parser = new JSDOM(await login4.text());

  const PlayerB50 = getBest50(
    parser.window.document.querySelectorAll(
      "div.screw_block, div[class*='_score_back']",
    ),
  );

  response.status(201);
  response.json({ PlayerB50 });
});

export default route;
