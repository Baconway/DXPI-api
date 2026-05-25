import expres, { Router } from "express";

const route = Router();
console.log("hdwhdiwqhdqwiuh");

route.get("/", (request, response) => {
  console.log(request.query);

  response.sendStatus(200);
});

export default route;
