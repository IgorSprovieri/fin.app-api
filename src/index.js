import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import db from "./models";
import routes from "./routes";

const port = process.env.PORT || 3333;
const origin =
  process.env.NODE_ENV === "production"
    ? { origin: "https://finapp.ispapps.com" }
    : { origin: "*" };

const app = express();
app.use(cors(origin));
app.use(express.json());
app.use(routes);

app.listen(port, "0.0.0.0", async () => {
  try {
    await db.sequelize.authenticate();
    console.log(`DB connected`);
    console.log(`App running on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
