import { response, Router } from "express";

const Passer = Router();

Passer.get("/", (request, response) => {
  response.setHeader("content-type", "text/javascript; charset=utf-8");
  response.json(
    `javascript: function obtainCookie() {const userCookie = document.cookie.match(/^clal=([^;]+)/)[1]; navigator.clipboard.writeText(userCookie).then(() =>  alert("Your login cookie has been obtained"))        } setTimeout(obtainCookie, 5000)`,
  );
});

export default Passer;
