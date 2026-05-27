import "dotenv/config";
import express, { Router } from "express";

import { DEFAULT_HEADERS, networkCheck, get_clal } from "../misc/net.js";

const LOGIN_URL = "https://lng-tgk-aime-gw.am-all.net/common_auth/login/sid";

const router = Router();

router.use(express.json());

router.post("/", async (request, response) => {
  const { status, cookies, message } = await networkCheck();

  if (status !== 200) {
    response.status(502);
    return response.json(message);
  }
  const { sid, password } = request.body;

  const SearchParams = new URLSearchParams({
    retention: "1",
    sid: sid,
    password: password,
  });

  const call = await fetch(`${LOGIN_URL}?${SearchParams}`, {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: cookies
        .map((header) => {
          return header.split(";")[0];
        })
        .join("; "),
    },

    redirect: "manual",
  });

  const clal = get_clal(call.headers.getSetCookie());
  if (call.status !== 302 || !clal) return response.sendStatus(404);

  response.status(200);
  response.json({ cookie: clal.cookie });
});

export default router;
