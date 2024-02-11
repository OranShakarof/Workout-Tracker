import cors from "cors";
import express from "express";
import appConfig from "./2-utils/app-config";
import dal from "./2-utils/dal";
import catchAll from "./4-middleware/catch-all";
import routeNotFound from "./4-middleware/route-not-found";
import profileController from "./6-controllers/profile-controller";
import expressFileUpload from "express-fileupload";

const server = express();

server.use(cors());
server.use(express.json({'limit': '50mb'}));
server.use(expressFileUpload());
server.use("/api", profileController);
server.use("*" ,routeNotFound);
server.use(catchAll);

server.listen(appConfig.port, async () => {
    await dal.connect();
    console.log("Listening on http://localhost:" + appConfig.port);
});


