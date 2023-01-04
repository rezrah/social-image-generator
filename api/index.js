import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { drawBlogHeader } from "./src/blog-header/index.js";
import { drawSpeakerCard } from "./src/speaker-card/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fetch from "node-fetch";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3001;

// defining the Express app
const app = express();

// // defining an array to work as the database (temporary solution)
// const ads = [{ title: "Hello, world (again)!" }];

app.use(express.static(path.resolve(__dirname, "./views/images")));

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// defining an endpoint to return all ads
// app.get("/", (req, res) => {
//   res.send(ads);
// });

// blog header route
app.post("/api/blog-header", async (req, res) => {
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

// root route - serve static file
app.get("/login", async (req, res) => {
  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code;

  const response = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${process.env.OAUTH_CLIENT_ID}&client_secret=${process.env.OAUTH_CLIENT_SECRET}&code=${requestToken}`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    }
  );

  if (response) {
    const data = await response.json();

    const accessToken = data.access_token;

    // redirect the user to the home page, along with the access token
    res.redirect(`http://localhost:3000/login?access_token=${accessToken}`);
  }
});

// starting the server
app.listen(port, (err) => {
  if (err) {
    console.log("Error::", err);
  }
  console.log(`listening on port ${port}`);
});
