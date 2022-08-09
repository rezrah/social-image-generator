const Canvas = require("@napi-rs/canvas");

const fs = require("fs"); // For creating files for our images.
const path = require("path");
const cwebp = require("cwebp"); // For converting our images to webp.

const { createCanvas, GlobalFonts, Image } = Canvas;
const canvas = createCanvas(1200, 627);

// Load in the fonts we need
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "./fonts/Alliance-No-1-Regular.woff2"),
  "AllianceNo1Regular"
);
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "./fonts/Alliance-No-1-Medium.woff2"),
  "AllianceNo1Medium"
);
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "./fonts/Alliance-No-1-SemiBold.woff2"),
  "AllianceNo1SemiBold"
);
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "./fonts/Alliance-No-1-Bold.woff2"),
  "AllianceNo1Bold"
);
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "./fonts/Alliance-No-1-ExtraBold.woff2"),
  "AllianceNo1ExtraBold"
);
// GlobalFonts.registerFromPath('./fonts/Apple-Emoji.ttf', 'AppleEmoji');

// This function accepts 6 arguments:
// - ctx: the context for the canvas
// - text: the text we wish to wrap
// - x: the starting x position of the text
// - y: the starting y position of the text
// - maxWidth: the maximum width, i.e., the width of the container
// - lineHeight: the height of one line (as defined by us)

const wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
  // First, split the words by spaces
  let words = text.split(" ");
  // Then we'll make a few variables to store info about our line
  let line = "";
  let testLine = "";
  // wordArray is what we'l' return, which will hold info on
  // the line text, along with its x and y starting position
  let wordArray = [];
  // totalLineHeight will hold info on the line height
  let totalLineHeight = 0;

  // Next we iterate over each word
  for (var n = 0; n < words.length; n++) {
    // And test out its length
    testLine += `${words[n]} `;
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    // If it's too long, then we start a new line
    if (testWidth > maxWidth && n > 0) {
      wordArray.push([line, x, y]);
      y += lineHeight;
      totalLineHeight += lineHeight;
      line = `${words[n]} `;
      testLine = `${words[n]} `;
    } else {
      // Otherwise we only have one line!
      line += `${words[n]} `;
    }
    // Whenever all the words are done, we push whatever is left
    if (n === words.length - 1) {
      wordArray.push([line, x, y]);
    }
  }

  // And return the words in array, along with the total line height
  // which will be (totalLines - 1) * lineHeight
  return [wordArray, totalLineHeight];
};

// This functiona accepts 5 arguments:
// canonicalName: this is the name we'll use to save our image
// gradientColors: an array of two colors, i.e. [ '#ffffff', '#000000' ], used for our gradient
// title: the title of the article or site you want to appear in the image
// category: the category which that article sits in - or the subtext of the article
// emoji: the emoji you want to appear in the image.
// overwrite: overwrite existing image
const generateMainImage = async function ({
  canonicalName,
  theme,
  heading,
  subheading,
  description,
  overwrite = false,
}) {
  //   category = category.toUpperCase();
  // gradientColors is an array [ c1, c2 ]
  let gradientColors;

  if (theme === "dark") {
    gradientColors = ["#1B1F24", "#1B1F24"];
  } else if (theme === "light") {
    gradientColors = ["#ffffff", "#ffffff"];
  } else {
    gradientColors = ["#1B1F24", "#1B1F24"];
  }

  const fgDefault = theme === "light" ? "#24292F" : "#ffffff";
  const fgMuted = theme === "light" ? "#57606A" : "#8B949E";

  // Create canvas
  const ctx = canvas.getContext("2d");

  // Add gradient - we use createLinearGradient to do this
  let grd = ctx.createLinearGradient(0, 627, 1200, 0);
  grd.addColorStop(0, gradientColors[0]);
  grd.addColorStop(1, gradientColors[1]);
  ctx.fillStyle = grd;
  // Fill our gradient
  ctx.fillRect(0, 0, 1200, 627);

  if (theme === "analog") {
    const bgTheme = await Canvas.loadImage(
      path.resolve(__dirname, "./assets/analog.png")
    );
    ctx.drawImage(bgTheme, 0, 0, canvas.width, canvas.height);
  }

  // Write our Emoji onto the canvas
  //   ctx.fillStyle = "white";
  //   ctx.font = "95px AppleEmoji";
  //   //ctx.fillText(emoji, 85, 700);

  //   const file = await fs.promises.readFile("./mark-github-24.png");

  //   const image = new Image();
  //   image.src = file;

  //   const w = image.width;
  //   const h = image.height;

  //   ctx.drawImage(image, 0, 0, w * 5, h * 5);

  // Add our category text
  ctx.font = "96px AllianceNo1ExtraBold";
  ctx.fillStyle = fgDefault;
  ctx.lineHeight = "104px";
  ctx.textAlign = "center";
  let wrappedText = wrapText(ctx, subheading, 32, 623, 1200 - 64, 104);
  wrappedText[0].forEach(function (item) {
    // We will fill our text which is item[0] of our array, at coordinates [x, y]
    // x will be item[1] of our array
    // y will be item[2] of our array, minus the line height (wrappedText[1]), minus the height of the emoji (200px)
    ctx.fillText(item[0], canvas.width / 2, item[2] - wrappedText[1] - 200); // 200 is height of an emoji
  });

  // Add our subheading text to the canvas
  ctx.font = "40px AllianceNo1SemiBold";
  ctx.fillStyle = fgDefault;
  // ctx.fillText(heading, 85, 553 - wrappedText[1] - 100); // 853 - 200 for emoji, -100 for line height of 1
  ctx.fillText(heading, canvas.width / 2, 520 - wrappedText[1] - 200);

  const image = await Canvas.loadImage(
    path.resolve(
      __dirname,
      theme === "light"
        ? "./assets/mark-github-24-dark.png"
        : "./assets/mark-github-24.png"
    )
  );

  ctx.drawImage(
    image,
    canvas.width / 2 - 72 / 2,
    420 - wrappedText[1] - 250,
    72,
    72
  );

  ctx.font = "28px AllianceNo1Regular";
  ctx.fillStyle = fgMuted;
  ctx.lineHeight = "40px";

  let wrappedDescription = wrapText(ctx, description, 32, 450, 934, 40);
  wrappedDescription[0].forEach(function (item) {
    // We will fill our text which is item[0] of our array, at coordinates [x, y]
    // x will be item[1] of our array
    // y will be item[2] of our array, minus the line height (wrappedText[1]), minus the height of the emoji (200px)
    ctx.fillText(
      item[0],
      canvas.width / 2 < 934 ? canvas.width / 2 : 934,
      item[2] + 40
    ); // 200 is height of an emoji
  });

  const outDir = "./views/images/banner/";

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log(`${outDir} created`);
  }

  const mime = "image/png";
  const encoding = "base64";
  const canvasData = await canvas.encode("png");
  const uri =
    "data:" + mime + ";" + encoding + "," + canvasData.toString(encoding);
  //const uri = canvas.toDataURL("image/webp", 1);

  if (
    fs.existsSync(`./views/images/banner/${canonicalName}.png`) &&
    !overwrite
  ) {
    console.info("Images Exist! We did not create any");
    return;
  } else {
    // Set canvas as to png
    try {
      // Save file
      fs.writeFileSync(
        `./views/images/banner/${canonicalName}.png`,
        canvasData
      );

      console.info("Images created successfully");
    } catch (e) {
      console.error("Could not create png image this time.", e);
      return;
    }
    // try {
    //   const encoder = new cwebp.CWebp(
    //     path.join(
    //       __dirname,
    //       "../",
    //       `./views/images/banner/${canonicalName}.png`
    //     )
    //   );
    //   encoder.quality(30);
    //   await encoder.write(
    //     `./views/images/banner/${canonicalName}.webp`,
    //     function (err) {
    //       if (err) console.log(err);
    //     }
    //   );
    // } catch (e) {
    //   console.error("Could not create webp image this time.", e);
    //   return;
    // }

    return {
      msg: "Images have been successfully created!",
      path: `./views/images/banner/${canonicalName}.png`,
      uri,
    };
  }
};

module.exports = { generateMainImage };
