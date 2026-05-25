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
import recent from "./song/recent.js";

const app = express();

app.use("/token/sid", sid);
app.use("/token/embed", embed);
app.use("/user", user);
app.use("/user/stats", user_stats);
app.use("/social/circleRank", circle_rank);
app.use("/user/album", album);
app.use("/social/circle", circle);
app.use("/song/recent", recent);
app.use("/song", song);

app.listen(4000);
