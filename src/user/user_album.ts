import express, { Router } from "express";
import { JSDOM } from "jsdom";

import {
  DEFAULT_HEADERS,
  networkCheck,
  NET_login,
} from "../api_functions/net_functions.js";
import {
  ALBUM_USER_PAGE,
  parse_user_photo,
} from "../api_functions/user_functions.js";
import type { photoData } from "../types.js";

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

  const pageLogin = await fetch(ALBUM_USER_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },
  });

  const parser = new JSDOM(await pageLogin.text());
  const album: photoData[] = [];

  parser.window.document
    .querySelectorAll(".m_10.p_5.f_0")
    .forEach((photo_div) => album.push(parse_user_photo(photo_div)));

  response.status(201);
  response.json(album);

  parser.window.close();
});

export default route;
