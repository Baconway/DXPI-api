import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";
import express from "express";
import ms from "ms";

import sid from "./token/sid.js";
import embed from "./token/embed.js";

import user from "./user/user.js";
import album from "./user/user_album.js";
import user_stats from "./user/user_stats.js";

import circle from "./social/circle.js";
import circle_rank from "./social/circle_rank.js";

import song from "./song/song.js";
import best50 from "./song/b50.js";
import recent from "./song/recent.js";

import collection from "./collection/collection.js";
import tour_member from "./collection/tour_member.js";

const rate_limiter = rateLimit({
  windowMs: ms("10m"),
  limit: 50,
  standardHeaders: "draft-8",
  message: "Too many requests (or if you are a bot, fuck you)",
});
const slow_downer = slowDown({
  windowMs: ms("10m"),
  delayAfter: 3,
  delayMs: (hits: any) => hits * 150,
});

const app = express();

app.use(rate_limiter);
app.use(slow_downer);

app.use("/token/sid", sid);
app.use("/token/embed", embed);

app.use("/user", user);
app.use("/user/stats", user_stats);
app.use("/user/album", album);

app.use("/social/circleRank", circle_rank);
app.use("/social/circle", circle);

app.use("/song/b50", best50);
app.use("/song/recent", recent);
app.use("/song", song);

app.use("/collection", collection);
app.use("/collection/member", tour_member);

app.options("/", (request, response) => {
  const optionsHeaders = new Headers({
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Max-Age:": `${ms("7 days")}`,
    Accept: "application/json; charset=utf-8",
    Allow: "GET, POST",
  });
  response.status(204);
  response.setHeaders(optionsHeaders);

  response.end();
});

app.use((request, response) => {
  response.sendStatus(404);
});

app.listen(process.env.PORT);
