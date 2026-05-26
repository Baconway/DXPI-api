import "dotenv/config";
import expres, { Router } from "express";

import type { songType } from "../types.js";

const route = Router();

async function insertIntoMemory() {
  const holder: Record<string, songType> = {};

  const Fetch_songDB = await fetch(process.env.SONG_DB as string, {
    method: "GET",
  });

  const db_json = await Fetch_songDB.json();

  for (let index = 0; index < db_json.length; index++) {
    const song = db_json[index];

    const songConsist: songType = {
      name: song.title,
      artist: song.artist,
      version: song.catcode,

      const_level: {
        basic: song.lev_bas_i ? parseFloat(song.lev_bas_i) : 0,
        advanced: song.lev_adv_i ? parseFloat(song.lev_adv_i) : 0,
        expert: song.lev_exp_i ? parseFloat(song.lev_exp_i) : 0,
        master: song.lev_mas_i ? parseFloat(song.lev_mas_i) : 0,

        dx_basic: song.dx_lev_bas_i ? parseFloat(song.dx_lev_bas_i) : 0,
        dx_adv: song.dx_lev_adv_i ? parseFloat(song.dx_lev_adv_i) : 0,
        dx_exp: song.dx_lev_exp_i ? parseFloat(song.dx_lev_exp_i) : 0,
        dx_mas: song.dx_lev_mas_i ? parseFloat(song.dx_lev_mas_i) : 0,
      },

      trunc_level: {
        basic: song.lev_bas ? song.lev_bas : 0,
        advanced: song.lev_adv ? song.lev_adv : 0,
        expert: song.lev_exp ? song.lev_exp : 0,
        master: song.lev_mas ? song.lev_mas : 0,

        dx_basic: song.dx_lev_bas ? song.dx_lev_bas : 0,
        dx_adv: song.dx_lev_adv ? song.dx_lev_adv : 0,
        dx_exp: song.dx_lev_exp ? song.dx_lev_exp : 0,
        dx_mas: song.dx_lev_mas ? song.dx_lev_mas : 0,
      },

      jacket: `${process.env.JACKET_URL}/${song.image_url}`,
    };

    holder[song.title] = songConsist;
  }

  return holder;
}

const memory = await insertIntoMemory();

route.get("/", (request, response) => {
  response.status(200);
  response.json(memory[request.query.name as string]);
});

export default route;
