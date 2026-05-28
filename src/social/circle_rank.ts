import express, { Router } from "express";
import { JSDOM } from "jsdom";
import papa from "papaparse";

import type { circle_rank_info } from "../types.js";

import {
  DEFAULT_HEADERS,
  networkCheck,
  NET_login,
} from "../api_functions/net_functions.js";
import {
  CIRCLE_RANK_PAGE,
  parse_circle_standing,
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

  const pageLogin = await fetch(CIRCLE_RANK_PAGE, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `${user_cookies}`,
      credentials: "include",
    },
  });

  const parser = new JSDOM(await pageLogin.text());

  const top_circles: circle_rank_info[] = [];
  const other_circles: circle_rank_info[] = [];

  parser.window.document
    .querySelectorAll(".ranking_top_block")
    .forEach((block) => {
      top_circles.push(
        parse_circle_standing(
          block.querySelector(".f_l.p_t_10.p_l_10.f_15")?.textContent,
          block.querySelector(".p_t_10.p_r_10.f_r.f_14")?.textContent,
        ),
      );
    });

  parser.window.document.querySelectorAll(".ranking_block").forEach((block) => {
    other_circles.push(
      parse_circle_standing(
        block.querySelector(".f_l.p_t_10.p_l_10.f_15")?.textContent,
        block.querySelector(".p_t_10.p_r_10.f_r.f_14")?.textContent,
      ),
    );
  });

  const combinedLB = top_circles.concat(other_circles);

  response.status(201);
  response.setHeader("Content-Type", "text/csv");

  response.send(papa.unparse(combinedLB));
  parser.window.close();
});

export default route;
