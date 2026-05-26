import "dotenv/config";
import express from "express";

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

import tour_member from "./collection/tour_member.js";

const app = express();

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

app.use("/collection/member", tour_member);

app.listen(4000);
