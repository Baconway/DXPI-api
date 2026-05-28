import express, { Router } from "express";
import { JSDOM } from "jsdom";

import {
  DEFAULT_HEADERS,
  NET_login,
  networkCheck,
} from "../api_functions/net_functions.js";
import {
  RECORD_PAGE,
  extract_recent,
} from "../api_functions/song_functions.js";

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

  const pageLogin = await fetch(RECORD_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },

    redirect: "manual",
  });

  const parser = new JSDOM(await pageLogin.text());
  const recentCredit = extract_recent(
    parser.window.document.querySelectorAll(".p_10.t_l.f_0.v_b"),
  );

  response.status(200);
  response.json(recentCredit);
  parser.window.close();
});

export default route;
