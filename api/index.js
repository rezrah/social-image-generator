import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { drawBlogHeader } from "./src/social-banner/index.js";
import { drawSpeakerCard } from "./src/speaker-card/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fetch from "node-fetch";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, "./views/images")));

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(morgan("combined"));

// social banner route
app.post("/api/social-banner", async (req, res) => {
  const {
    heading,
    subheading,
    description,
    theme,
    align,
    button,
    size,
    filename = "test",
  } = req.body;

  try {
    const response = await drawBlogHeader({
      canonicalName: filename,
      theme,
      heading,
      subheading,
      description,
      overwrite: true,
      align,
      button,
      size,
    });

    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

// speaker card route
app.post("/api/speaker-card", async (req, res) => {
  const {
    heading,
    subheading,
    event_date,
    theme,
    align,
    button,
    size,
    filename = "test",
    speakerData,
  } = req.body;

  try {
    const response = await drawSpeakerCard({
      canonicalName: filename,
      theme,
      heading,
      subheading,
      event_date,
      overwrite: true,
      align,
      button,
      size,
      speakerData,
    });

    res.send(response);
  } catch (err) {
    console.log(err);
  }
});
// root route - serve static file
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "./public/client.html"));
});

// Login route
app.get("/api/login", async (req, res) => {
  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code;

  console.log("requestToken", requestToken);

  if (!requestToken) {
    return;
  }

  const response = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${process.env.OAUTH_CLIENT_ID}&client_secret=${process.env.OAUTH_CLIENT_SECRET}&code=${requestToken}`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    }
  );

  console.log("raw response", response);

  if (response) {
    const data = await response.json();
    console.log("json response", data);
    const accessToken = data.access_token;

    if (accessToken) {
      console.log("just before redirect");
      res.redirect(
        `${process.env.WEB_APP_URL}/login?access_token=${accessToken}`
      );
    }
  }
});

// starting the server
app.listen(port, (err) => {
  if (err) {
    console.log("Error::", err);
  }
  console.log(`listening on port ${port}`);
});
