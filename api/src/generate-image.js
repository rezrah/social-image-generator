import Canvas from "@napi-rs/canvas";
import fs from "fs"; // For creating files for our images.
import path from "path";
import cwebp from "cwebp"; // For converting our images to webp.
import { typePairings, fgDefault, fgMuted } from "../../shared/constants.js";
import { wrapText } from "../../shared/utils.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { createCanvas, GlobalFonts, Image } = Canvas;

// Load in the fonts we need
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-Regular.woff2"),
  "AllianceNo1Regular"
);
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-Medium.woff2"),
  "AllianceNo1Medium"
);
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-SemiBold.woff2"),
  "AllianceNo1SemiBold"
);
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-Bold.woff2"),
  "AllianceNo1Bold"
);
GlobalFonts.registerFromPath(
  path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-ExtraBold.woff2"),
  "AllianceNo1ExtraBold"
);
// GlobalFonts.registerFromPath('./fonts/Apple-Emoji.ttf', 'AppleEmoji');

// This functiona accepts 5 arguments:
// canonicalName: this is the name we'll use to save our image
// gradientColors: an array of two colors, i.e. [ '#ffffff', '#000000' ], used for our gradient
// title: the title of the article or site you want to appear in the image
// category: the category which that article sits in - or the subtext of the article
// emoji: the emoji you want to appear in the image.
// overwrite: overwrite existing image
export const generateMainImage = async function ({
  canonicalName,
  theme,
  heading,
  subheading,
  description,
  overwrite = false,
  align = "left",
  button,
  size,
}) {
  const { w: width, h: height } = size;
  const hasButton =
    Boolean(button) && Boolean(description) && size.typePairing === "medium";
  const canvasHeight = hasButton ? height + 120 : height;
  const canvas = createCanvas(width, canvasHeight);
  const positionCanvasCenter = canvas.width / 2;
  const startPosition = align === "center" ? positionCanvasCenter : 64;

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

  // Create canvas
  const ctx = canvas.getContext("2d");

  // Add gradient - we use createLinearGradient to do this
  let grd = ctx.createLinearGradient(0, canvasHeight, 1200, 0);
  grd.addColorStop(0, gradientColors[0]);
  grd.addColorStop(1, gradientColors[1]);
  ctx.fillStyle = grd;
  // Fill our gradient
  ctx.fillRect(0, 0, 1200, canvasHeight);

  if (["analog", "policy", "universe"].includes(theme)) {
    const bgTheme = await Canvas.loadImage(
      path.resolve(__dirname, `./assets/${theme}.png`)
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
  ctx.font = typePairings[size.typePairing].heading;
  ctx.fillStyle = fgDefault(theme);
  ctx.lineHeight = typePairings[size.typePairing].headingLineheight;
  ctx.textAlign = align;

  const headingStartingPos = size.typePairing === "large" ? 923 : 623;

  let wrappedText = wrapText(
    ctx,
    subheading,
    32,
    headingStartingPos,
    canvas.width - 64,
    Number(typePairings[size.typePairing].headingLineheight.replace(/px$/, ""))
  );
  wrappedText[0].forEach(function (item) {
    // We will fill our text which is item[0] of our array, at coordinates [x, y]
    // x will be item[1] of our array
    // y will be item[2] of our array, minus the line height (wrappedText[1]), minus the height of the emoji (200px)
    ctx.fillText(item[0], startPosition, item[2] - wrappedText[1] - 200); // 200 is height of an emoji
  });

  // Add our subheading text to the canvas
  ctx.font = typePairings[size.typePairing].subheading;
  ctx.lineHeight = typePairings[size.typePairing].subheadingLineheight;
  ctx.fillStyle = fgDefault(theme);

  if (theme === "analog") {
    const angle = (45 * Math.PI) / 180;
    const x2 = width * Math.cos(angle);
    const y2 = height * Math.sin(angle);
    let textGradient = ctx.createLinearGradient(0, canvasHeight, x2, y2);

    textGradient.addColorStop(0, "#D2A8FF");
    textGradient.addColorStop(0.5, "#F778BA");
    textGradient.addColorStop(1, "#FF7B72");

    ctx.fillStyle = textGradient;
  }

  const subheadingStartingPos = size.typePairing === "large" ? 800 : 520;

  ctx.fillText(
    heading,
    startPosition,
    subheadingStartingPos - wrappedText[1] - 200
  );

  const image = await Canvas.loadImage(
    path.resolve(
      __dirname,
      theme === "light"
        ? "./assets/mark-github-24-dark.png"
        : "./assets/mark-github-24.png"
    )
  );

  const markStartingPosY = size.typePairing === "large" ? 520 : 420;
  const dimension = size.typePairing === "large" ? 150 : 72;

  ctx.drawImage(
    image,
    align === "center" ? startPosition - dimension / 2 : 64,
    markStartingPosY - wrappedText[1] - 250,
    dimension,
    dimension
  );

  if (size.typePairing !== "small") {
    ctx.font = typePairings[size.typePairing].description;
    ctx.fillStyle = fgMuted(theme);
    ctx.lineHeight = "40px";
    const descPosY = size.typePairing === "large" ? 780 : 480;

    let wrappedDescription = wrapText(ctx, description, 32, descPosY, 934, 40);
    wrappedDescription[0].forEach(function (item) {
      // We will fill our text which is item[0] of our array, at coordinates [x, y]
      // x will be item[1] of our array
      // y will be item[2] of our array, minus the line height (wrappedText[1]), minus the height of the emoji (200px)
      ctx.fillText(
        item[0],
        startPosition < 934 ? startPosition : 934,
        item[2] + 40
      ); // 200 is height of an emoji
    });

    // Add button

    if (
      Boolean(button) &&
      Boolean(description) &&
      size.typePairing === "medium"
    ) {
      const hasLightButton = ["light", "policy"].includes(theme);

      ctx.font = "20px AllianceNo1SemiBold";
      const txt = button;
      const rectHeight = 56;
      const rectWidth = ctx.measureText(txt).width + 64;
      const rectX = align === "center" ? canvas.width / 2 - rectWidth / 2 : 64;
      const rectY = wrappedDescription[1] + 580;

      let buttonGradient = ctx.createLinearGradient(300, 0, 300, 200);

      if (hasLightButton) {
        ctx.lineWidth = 1;
        ctx.fillStyle = "#1B1F23";
        ctx.strokeStyle = "#000000";
      } else {
        ctx.fillStyle = "#F6F8FA";
      }

      roundRect(ctx, rectX, rectY, rectWidth, rectHeight, 6, true);

      if (hasLightButton) {
        buttonGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
        buttonGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      } else {
        buttonGradient.addColorStop(0, "#FFFFFF");
        buttonGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      }

      ctx.fillStyle = buttonGradient;

      roundRect(ctx, rectX, rectY, rectWidth, rectHeight, 6, true);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = hasLightButton ? "#fff" : "#000";

      ctx.fillText(txt, rectX + rectWidth / 2, rectY - 2 + rectHeight / 2);
    }
  }

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

  if (
    fs.existsSync(
      `./views/images/banner/${canonicalName}-${width}x${height}.png`
    ) &&
    !overwrite
  ) {
    console.info("Images Exist! We did not create any");
    return;
  } else {
    // Set canvas as to png
    try {
      // Save file
      fs.writeFileSync(
        `./views/images/banner/${canonicalName}-${width}x${height}.png`,
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
    //       `./views/images/banner/${canonicalName}-${width}x${height}.png`
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
      path: `/banner/${canonicalName}-${width}x${height}.png`,
      uri,
    };
  }
};

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 6;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }
}
