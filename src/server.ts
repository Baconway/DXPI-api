import "dotenv/config";
import express from "express";

import sid from "./token/sid.js";
import embed from "./token/embed.js";
import user from "./user/user.js";
import user_stats from "./user/user_stats.js";
const app = express();

app.use("/token/sid", sid);
app.use("/token/embed", embed);
app.use("/user", user);
app.use("/user/stats", user_stats);

app.listen(4000);
