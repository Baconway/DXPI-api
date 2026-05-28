import express, { Router } from "express";
import { JSDOM } from "jsdom";

import {
  DEFAULT_HEADERS,
  networkCheck,
  NET_login,
} from "../api_functions/net_functions.js";
import {
  STATS_USER_PAGE,
  parse_user_stats,
} from "../api_functions/user_functions.js";
import type { AchievementItem, Achivement } from "../types.js";

const route = Router();

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
  const pageLogin = await fetch(STATS_USER_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },
  });

  const parser = new JSDOM(await pageLogin.text());
  const SongAchivementStats: Achivement = {};

  parser.window.document
    .querySelectorAll(".musiccount_block")
    .forEach((achievement) => {
      const { name, values } = parse_user_stats(achievement);
      SongAchivementStats[name] = values;
    });

  response.status(201);
  response.json(SongAchivementStats);

  parser.window.close();
});

export default route;
