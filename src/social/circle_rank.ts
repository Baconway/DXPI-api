import express, { Router } from "express";
import { JSDOM } from "jsdom";
import papa from "papaparse";

const route = Router();

function parseCircleString(
  name: string | undefined,
  points: string | undefined,
): Object {
  const defaultObj = { name: "", points: 0 };
  if (!name || !points) return defaultObj;

  return { name: name.trim(), points: parseInt(points.trim(), 10) };
}

route.use(express.json());

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
  const login4 = await fetch(
    "https://maimaidx-eng.com/maimai-mobile/circle/circleRanking/",
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Cookie: `${cookieBag}`,
        credentials: "include",
      },
    },
  );

  const parser = new JSDOM(await login4.text());

  const top_circles: Object[] = [];
  const other_circles: Object[] = [];

  parser.window.document
    .querySelectorAll(".ranking_top_block")
    .forEach((block) => {
      top_circles.push(
        parseCircleString(
          block.querySelector(".f_l.p_t_10.p_l_10.f_15")?.textContent,
          block.querySelector(".p_t_10.p_r_10.f_r.f_14")?.textContent,
        ),
      );
    });

  parser.window.document.querySelectorAll(".ranking_block").forEach((block) => {
    other_circles.push(
      parseCircleString(
        block.querySelector(".f_l.p_t_10.p_l_10.f_15")?.textContent,
        block.querySelector(".p_t_10.p_r_10.f_r.f_14")?.textContent,
      ),
    );
  });

  const combinedLB = top_circles.concat(other_circles);

  response.status(201);
  response.setHeader("Content-Type", "text/csv");

  response.send(papa.unparse(combinedLB));
});

export default route;
