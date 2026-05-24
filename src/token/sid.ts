import "dotenv/config";
import express, { Router } from "express";

const LOGIN_URL = "https://lng-tgk-aime-gw.am-all.net/common_auth/login/sid";

const router = Router();

async function CheckNetStatus() {
  const statusCall = await fetch(process.env.STATUS_PAGE as string); // env var here is always string

  if (statusCall.status === 200) {
    const cookieBag = statusCall.headers
      .getSetCookie()
      .map((header) => {
        return header.split(";")[0];
      })
      .join("; ");
    console.log(cookieBag);
    return {
      status: statusCall.status,
      sessionCookies: cookieBag,
    };
  }

  return { status: undefined };
}

function ProcessCookie(Cookieblob: string[]) {
  if (Cookieblob.length <= 0) return undefined;
  const extracted = Cookieblob.find((cookie) => cookie.startsWith("clal="));

  if (extracted) {
    const parts: string[] = extracted.split(";").map((part) => part.trim());
    const clalPart = parts[0];
    const maxAgePart = parts[1];

    const clal = clalPart?.split("=")[1];
    const maxAge = maxAgePart?.split("=")[1];

    return {
      cookie: clal,
      maxAge: maxAge,
    };
  } else return undefined;
}

router.use(express.json());

router.post("/", async (request, response) => {
  const { status, sessionCookies } = await CheckNetStatus();

  if (!status || sessionCookies === "") return response.send(502);
  const { sid, password } = request.body;

  const SearchParams = new URLSearchParams({
    retention: "1",
    sid: sid,
    password: password,
  });

  const LOGIN_HEADERS = new Headers();
  LOGIN_HEADERS.append(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  );
  LOGIN_HEADERS.append("Cookie", sessionCookies);

  const call = await fetch(`${LOGIN_URL}?${SearchParams}`, {
    method: "POST",
    headers: LOGIN_HEADERS,

    redirect: "manual",
  });

  if (call.status !== 302) response.send(403);

  const Process = ProcessCookie(call.headers.getSetCookie());

  if (!Process) return response.send(403); // repeated again because it could pass, but no cookie

  console.log(Process);
  response.status(200);
  response.json({ cookie: Process.cookie, maxAge: Process.maxAge });
});

export default router;
