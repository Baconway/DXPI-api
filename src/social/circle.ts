import express, { Router } from "express";
import { JSDOM } from "jsdom";

import {
  DEFAULT_HEADERS,
  networkCheck,
  NET_login,
} from "../api_functions/net_functions.js";
import {
  CIRCLE_PAGE,
  extractCircleData,
} from "../api_functions/circle_functions.js";
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

  const pageLogin = await fetch(CIRCLE_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },
  });

  const parser = new JSDOM(await pageLogin.text());

  const circleData = extractCircleData(
    parser.window.document.querySelector("#circleProfile"),
    parser.window.document.querySelector(".circle_totalpoint_block"),
    parser.window.document.querySelector(".circle_pointranking_block"),
  );

  response.status(201);
  response.json(circleData);

  parser.window.close();
});

export default route;
