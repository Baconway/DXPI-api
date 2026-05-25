import express, { Router } from "express";
import { JSDOM } from "jsdom";

const route = Router();

route.use(express.json());

function extractCircleData(
  circle: Element | null,
  points: Element | null,
  rank: Element | null,
) {
  if (!circle || !points || !rank) return {};

  console.log(
    rank
      .querySelector(".circle_pointranking_point :not([class])")
      ?.textContent.trim(),
  );

  return {
    name: circle
      .querySelector(".circle_profile_circle_name :not([class])")
      ?.textContent.trim(),
    code: circle
      .querySelector(".circle_profile_circle_code :not([class])")
      ?.textContent.trim(),
    points: points
      .querySelector(".circle_totalpoint_point :not([class])")
      ?.textContent.trim()
      .replace(/[^0-9]/g, ""),
    ranking: rank
      .querySelector(".circle_pointranking_point :not([class])")
      ?.textContent.trim(),
  };
}

route.post("/", async (request, response) => {
  const { cookie } = request.body;
  const login = await fetch(
    "https://lng-tgk-aime-gw.am-all.net/common_auth/login?site_id=maimaidxex&redirect_url=https://maimaidx-eng.com/maimai-mobile/&back_url=https://maimai.sega.com/",
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Cookie: `clal=${cookie}`,
        credentials: "include",
      },

      redirect: "manual",
    },
  );

  const login3 = await fetch(login.headers.get("location") as string, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Cookie: `clal=${cookie}`,
      credentials: "include",
    },

    redirect: "manual",
  });
  const cookieBag = login3.headers.getSetCookie().join("; "); // store ssid cookies to login
  const login4 = await fetch("https://maimaidx-eng.com/maimai-mobile/circle/", {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Cookie: `${cookieBag}`,
      credentials: "include",
    },
  });

  const parser = new JSDOM(await login4.text());
  const circleData = extractCircleData(
    parser.window.document.querySelector("#circleProfile"),
    parser.window.document.querySelector(".circle_totalpoint_block"),
    parser.window.document.querySelector(".circle_pointranking_block"),
  );

  response.status(201);
  response.json({ circleData });
});

export default route;
