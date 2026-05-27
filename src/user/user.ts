import express, { Router } from "express";
import { JSDOM } from "jsdom";

import { DEFAULT_HEADERS, NET_login, networkCheck } from "../misc/net.js";
import { MAIN_USER_PAGE, parse_user_main } from "../misc/user_functions.js";
import type { basic_user_info } from "../types.js";

const router = Router();

router.use(express.json());

router.get("/", async (request, response) => {
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

  const pageLogin = await fetch(MAIN_USER_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },

    redirect: "manual",
  });

  const parser = new JSDOM(await pageLogin.text());
  const user_profileDOM =
    parser.window.document.querySelector(".see_through_block");
  const user_profile_extracted: basic_user_info = parse_user_main(
    user_profileDOM as Element,
  );

  response.status(201);
  response.json(user_profile_extracted);

  parser.window.close();
});

export default router;
