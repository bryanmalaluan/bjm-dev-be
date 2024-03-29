import express, { json } from "express";
import morgan from "morgan";
import { connect } from "mongoose";
import cors from "cors";
import "dotenv/config";

import educationRouters from "./src/routers/educations";
import experienceRouters from "./src/routers/experiences";
import professionalSkillRouters from "./src/routers/professionalSkills";
import userRouters from "./src/routers/users";
import errorHandler from "./src/helpers/errorHandler";
import authenticationJwt from "./src/helpers/jwt";
import { AddressInfo } from "net";

const app = express();
const api = process.env.API_URL;

// enable cors
app.use(cors());
app.options("*", cors());

// middleware
app.use(json());
app.use(morgan("tiny"));
app.use(authenticationJwt());
app.use(errorHandler);

// routers
app.use(`${api}/educations`, educationRouters);
app.use(`${api}/experiences`, experienceRouters);
app.use(`${api}/professionalSkills`, professionalSkillRouters);
app.use(`${api}/users`, userRouters);

// static path for public uploads
// provides access to folder
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// database connection
connect(process.env.CONNECTION_STRING ?? "")
  .then(() => {
    console.log("Database connection is ready...");
  })
  .catch((err) => {
    console.error("[Mongoose connection]: ", err);
  });

// connect to server
var server = app.listen(process.env.PORT || 8010, () => {
  var serverAddress = server.address() as AddressInfo;
  console.log(`Server is running on port ${serverAddress?.port}`);
});
