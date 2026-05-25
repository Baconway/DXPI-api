import express, { Router } from "express";
import { JSDOM } from "jsdom";

import type { credit } from "../types.js";

const route = Router();

function getRecentCredit(songLogs: NodeListOf<Element>): credit[] {
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
  const login4 = await fetch("https://maimaidx-eng.com/maimai-mobile/record/", {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Cookie: `${cookieBag}`,
      credentials: "include",
    },
  });

  const parser = new JSDOM(await login4.text());
  const recentCredit = getRecentCredit(
    parser.window.document.querySelectorAll(".p_10.t_l.f_0.v_b"),
  );

  response.status(200);
  response.json({ recentCredit });
});

export default route;
