import express, { Router } from "express";
import { JSDOM } from "jsdom";

import type { best50Song, b50_holder } from "../types.js";
import {
  DEFAULT_HEADERS,
  NET_login,
  networkCheck,
} from "../api_functions/net_functions.js";
import { BEST50_PAGE, extractB50 } from "../api_functions/song_functions.js";

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

  const PlayerB50 = extractB50(
    parser.window.document.querySelectorAll(
      "div.screw_block, div[class*='_score_back']",
    ),
  );

  response.status(201);
  response.json(PlayerB50);

  parser.window.close();
});

export default route;
