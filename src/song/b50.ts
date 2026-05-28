import express, { Router } from "express";
import { JSDOM } from "jsdom";

import type { best50Song, b50_holder } from "../types.js";
import {
  DEFAULT_HEADERS,
  NET_login,
  networkCheck,
} from "../api_functions/net_functions.js";
import { BEST50_PAGE } from "../api_functions/song_functions.js";

const route = Router();

function getBest50(b50DOM: NodeListOf<Element> | null): b50_holder | null {
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

route.use(express.json());

route.get("/", async (request, response) => {
  const cookie = request.query.cookie as string;

  if (!cookie) {
    response.status(400);
    return response.json("Your request is missing your login cookie!");
  }

  const { status, message } = await networkCheck();

  if (status !== 200) {
    response.status(503);
    return response.json(message);
  }

  const user_cookies = await NET_login(cookie); // actual cookies for login

  const pageLogin = await fetch(BEST50_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },

    redirect: "manual",
  });

  const parser = new JSDOM(await pageLogin.text());

  const PlayerB50 = getBest50(
    parser.window.document.querySelectorAll(
      "div.screw_block, div[class*='_score_back']",
    ),
  );

  response.status(201);
  response.json({ PlayerB50 });
});

export default route;
