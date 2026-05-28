import express, { Router } from "express";
import { JSDOM } from "jsdom";

import {
  DEFAULT_HEADERS,
  NET_login,
  networkCheck,
} from "../api_functions/net_functions.js";
import {
  COLLECTION_PAGES,
  COLLECTION_TROPHY_PAGE,
  COLLECTION_PARTNER_PAGE,
  extract_collection_img,
  extract_collection_title,
  extract_collection_partner,
} from "../api_functions/collection_functions.js";
import type { collection_group } from "../types.js";

const route = Router();

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
  const collection: collection_group = {};

  for (let index = 0; index < COLLECTION_PAGES.length; index++) {
    const page = COLLECTION_PAGES[index] as string;
    const pageLogin = await fetch(page, {
      method: "GET",
      headers: {
        ...DEFAULT_HEADERS,
        Cookie: `${user_cookies}`,
        credentials: "include",
      },

      redirect: "manual",
    });

    const parser = new JSDOM(await pageLogin.text());
    const { collection_type, img_src } = extract_collection_img(
      parser.window.document.querySelector(
        ".collection_setting_block",
      ) as Element,
    );

    collection[collection_type] = img_src;
    parser.window.close();
  }

  const trophy_pageLogin = await fetch(COLLECTION_TROPHY_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },

    redirect: "manual",
  });

  const trophy_parser = new JSDOM(await trophy_pageLogin.text());
  collection["title"] = extract_collection_title(
    trophy_parser.window.document.querySelector(
      ".collection_setting_block",
    ) as Element,
  );

  trophy_parser.window.close();

  const partner_pageLogin = await fetch(COLLECTION_PARTNER_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },

    redirect: "manual",
  });
  const partner_parser = new JSDOM(await partner_pageLogin.text());
  collection["partner"] = extract_collection_partner(
    partner_parser.window.document.querySelector(
      ".collection_setting_block",
    ) as Element,
  );

  response.status(201);
  response.json(collection);
});

export default route;
