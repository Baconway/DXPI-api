import express, { Router } from "express";
import { JSDOM } from "jsdom";

const router = Router();

router.use(express.json());

// testURL: https://maimaidx-eng.com/maimai-mobile/playerData/
router.post("/", async (request, response) => {
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
  const login4 = await fetch("https://maimaidx-eng.com/maimai-mobile/home/", {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Cookie: `${cookieBag}`,
      credentials: "include",
    },
  });

  const parser = new JSDOM(await login4.text());

  response.status(200);
  response.json({
    name: parser.window.document.querySelector(".name_block")?.innerHTML,
    rating: parser.window.document.querySelector(".rating_block")?.innerHTML,
    rating_block: parser.window.document
      .querySelector("img[src*='rating_base_']")
      ?.getAttribute("src"),
    stars:
      parser.window.document.querySelector(".p_l_10.f_l.f_14")?.textContent,
    icon: parser.window.document
      .querySelector(".basic_block img.w_112")
      ?.getAttribute("src"),
    dan: parser.window.document
      .querySelector("img[src*='/course/']")
      ?.getAttribute("src"),
    class: parser.window.document
      .querySelector("img[src*='/class/']")
      ?.getAttribute("src"),
    leader: parser.window.document
      .querySelector("img[src*='/Chara/']")
      ?.getAttribute("src"),
  });

  parser.window.close();
});

export default router;
