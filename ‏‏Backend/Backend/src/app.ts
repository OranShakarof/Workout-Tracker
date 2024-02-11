import cors from "cors";
import express from "express";
import appConfig from "./2-utils/app-config";
import dal from "./2-utils/dal";
import catchAll from "./4-middleware/catch-all";
import routeNotFound from "./4-middleware/route-not-found";
import authController from "./6-controllers/auth-controller";

const server = express();

server.use(cors());
server.use(express.json());
server.use("/api", authController);
server.use(routeNotFound);
server.use(catchAll);

server.listen(appConfig.port, async () => {
    await dal.connect();
    console.log("Listening on http://localhost:" + appConfig.port);
});
