import express, { Router } from "express";
import { JSDOM } from "jsdom";

import type { AchievementItem, Achivement } from "../types.js";

const route = Router();

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
    "https://maimaidx-eng.com/maimai-mobile/playerData/",
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
  const SongAchivementStats: Achivement = {};

  parser.window.document
    .querySelectorAll(".musiccount_block")
    .forEach((achievement) => {
      const img = achievement.querySelector(".musiccount_img_block img");
      const achievement_count = achievement.querySelector(
        ".musiccount_counter_block",
      )?.innerHTML;

      if (img && achievement_count) {
        const imgURL = img.getAttribute("src") || "";
        const achievement_name =
          imgURL
            .split("/")
            .pop()
            ?.split("?")[0]
            ?.replace("music_icon_", "")
            .replace(".png", "") || "";
        SongAchivementStats[achievement_name] = {
          icon: imgURL,
          count: achievement_count,
        };
      }
    });

  response.status(200);
  response.json(SongAchivementStats);
});

export default route;
