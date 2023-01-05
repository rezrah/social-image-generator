import Canvas from "@napi-rs/canvas";
import fs from "fs"; // For creating files for our images.
import path from "path";
import cwebp from "cwebp"; // For converting our images to webp.
import {
  typePairings,
  typography,
  fgDefault,
  fgMuted,
} from "../../shared/constants.js";
import { wrapText } from "../../shared/utils.js";
import { drawBackgroundVisual } from "./draw-background-visual.js";
import { drawCallToActionButton } from "./draw-cta-button.js";
import { saveFileToFs } from "../shared/saveFileToFs.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { loadCustomFonts } from "../shared/load-custom-fonts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { createCanvas, GlobalFonts, Image } = Canvas;

loadCustomFonts(GlobalFonts);

// GlobalFonts.registerFromPath('./fonts/Apple-Emoji.ttf', 'AppleEmoji');

// This function accepts 5 arguments:
// canonicalName: this is the name we'll use to save our image
// gradientColors: an array of two colors, i.e. [ '#ffffff', '#000000' ], used for our gradient
// title: the title of the article or site you want to appear in the image
// category: the category which that article sits in - or the subtext of the article
// emoji: the emoji you want to appear in the image.
// overwrite: overwrite existing image
export const drawBlogHeader = async function ({
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
    Boolean(button) && Boolean(description) && size.typePairing === "l";
  const canvasHeight = hasButton ? height + 120 : height;
  const canvas = createCanvas(width, canvasHeight);
  const positionCanvasCenter = canvas.width / 2;
  const startPosition = align === "center" ? positionCanvasCenter : 48;

  //   category = category.toUpperCase();
  // gradientColors is an array [ c1, c2 ]

  // if (theme === "dark") {
  //   gradientColors = ["#1B1F24", "#1B1F24"];
  // } else if (theme === "light") {
  //   gradientColors = ["#ffffff", "#ffffff"];
  // } else {
  //   gradientColors = ["#1B1F24", "#1B1F24"];
  // }

  // Create canvas
  const ctx = canvas.getContext("2d");

  // set background
  await drawBackgroundVisual({ theme, canvas, canvasHeight });

  // Add required text fields

  const getSize = (count) => {
    if (count < 25) {
      return "xl";
    } else if (count > 25 && count < 49) {
      return "l";
    }
    return "m";
  };

  // start big heading
  if (theme === "copilot") {
    // add diagonal gradient fillStyle to text

    const angle = (45 * Math.PI) / 180;
    const x2 = width * Math.cos(angle);
    const y2 = height * Math.sin(angle);
    let textGradient = ctx.createLinearGradient(50, 300, 400, 600);

    textGradient.addColorStop(0, "#8ADFD7");
    textGradient.addColorStop(0.5, "#8ADFD7");
    textGradient.addColorStop(1, "#A371F7");

    ctx.fillStyle = textGradient;
  } else {
    ctx.fillStyle = fgDefault(theme);
  }

  let wrappedText = [""];

  if (heading.length) {
    ctx.font = typePairings[getSize(heading.length)].heading;

    ctx.textAlign = align;

    const headingStartingPos = size.typePairing === "xl" ? 923 : 623;

    wrappedText = wrapText(
      ctx,
      heading,
      32,
      headingStartingPos,
      canvas.width - 160,
      Number(
        typePairings[getSize(heading.length)].headingLineheight.replace(
          /px$/,
          ""
        )
      )
    );
    wrappedText[0].forEach(function (item) {
      // We will fill our text which is item[0] of our array, at coordinates [x, y]
      // x will be item[1] of our array
      // y will be item[2] of our array, minus the line height (wrappedText[1]), minus the height of the emoji (200px)
      ctx.fillText(item[0], startPosition, item[2] - wrappedText[1] - 200); // 200 is height of an emoji
    });
  }

  if (subheading.length) {
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

    const subheadingStartingPos = size.typePairing === "xl" ? 800 : 520;

    ctx.fillText(
      subheading,
      startPosition,
      subheadingStartingPos - wrappedText[1] - 200
    );
  }

  const image = await Canvas.loadImage(
    path.resolve(
      __dirname,
      theme === "light"
        ? "../assets/mark-github-24-dark.png"
        : "../assets/mark-github-24.png"
    )
  );

  const markStartingPosY = size.typePairing === "xl" ? 520 : 420;
  const dimension = size.typePairing === "xl" ? 150 : 72;

  ctx.drawImage(
    image,
    align === "center" ? startPosition - dimension / 2 : 48,
    //markStartingPosY - wrappedText[1] - 250, // hug to text
    48,
    dimension,
    dimension
  );

  // Add our description text to the canvas if it exists
  if (size.typePairing !== "m") {
    ctx.font = `${typography.scale.headline["2xs"].fontSize}px ${typography.headline.tertiary.fontFamily}`;
    ctx.fillStyle = fgMuted(theme);
    ctx.lineHeight = `${typography.scale.headline["2xs"].lineHeight}px`;
    const descPosY = size.typePairing === "xl" ? 780 : 440; // needs finetuning

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

    if (Boolean(button) && Boolean(description) && size.typePairing === "l") {
      await drawCallToActionButton({
        theme,
        canvas,
        label: button,
        align,
        offsetY: wrappedDescription[1] + 540,
      });
    }
  }

  /**
   * Save the file to the filesystem
   */
  const result = await saveFileToFs({
    canonicalName,
    canvas,
    height,
    width,
    overwrite,
  });

  return result;
};
