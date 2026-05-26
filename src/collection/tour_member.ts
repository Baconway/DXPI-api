import express, { Router } from "express";
import { JSDOM } from "jsdom";

import type { tour_member } from "../types.js";

const route = Router();

function getTourMembers(tour_mem_parent: Element | null): tour_member[] | null {
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
    "https://maimaidx-eng.com/maimai-mobile/collection/character/",
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
  response.status(201);
  response.json(
    getTourMembers(
      parser.window.document.querySelector(
        ".see_through_block.collection_setting_block",
      ),
    ),
  );
});

export default route;
