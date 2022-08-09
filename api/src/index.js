const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const { generateMainImage } = require("./generate-image");

// defining the Express app
const app = express();

// // defining an array to work as the database (temporary solution)
// const ads = [{ title: "Hello, world (again)!" }];

app.use(express.static(path.resolve(__dirname, "../views/images")));

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

app.post("/", async (req, res) => {
  const { heading, subheading, description, theme } = req.body;
  const success = await generateMainImage({
    canonicalName: "test.png",
    theme,
    heading,
    subheading,
    description,
    overwrite: true,
  });
  console.log("description is:", description);
  console.log(success);
  res.send({ ...success });
});

// starting the server
app.listen(3001, () => {
  console.log("listening on port 3001");
});
