import express, { Router } from "express";
import { JSDOM } from "jsdom";

import {
  DEFAULT_HEADERS,
  NET_login,
  networkCheck,
} from "../api_functions/net_functions.js";

import {
  TOUR_PARTNER_PAGE,
  extract_tourMembers,
} from "../api_functions/collection_functions.js";

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

  const pageLogin = await fetch(TOUR_PARTNER_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },

    redirect: "manual",
  });

  const parser = new JSDOM(await pageLogin.text());
  const tourMembers = extract_tourMembers(
    parser.window.document.querySelector(
      ".see_through_block.collection_setting_block",
    ),
  );

  response.status(201);
  response.json(tourMembers);

  parser.window.close();
});

export default route;
