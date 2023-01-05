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
export const drawSpeakerCard = async function ({
  canonicalName,
  theme,
  heading,
  subheading,
  event_date,
  overwrite = false,
  align = "left",
  button,
  size,
  speakerData,
}) {
  const { w: width, h: height } = size;
  const hasButton =
    Boolean(button) && Boolean(event_date) && size.typePairing === "l";
  const canvasHeight = hasButton ? height + 120 : height;
  const canvas = createCanvas(width, canvasHeight);
  const positionCanvasCenter = canvas.width / 2;
  const numSpeakers = speakerData.length;

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
    return "l";
  };

  let wrappedText = [""];

  const headingStartingPos = size.typePairing === "xl" ? 923 : 580;
  const subheadingStartingPos =
    size.typePairing === "xl" ? 800 : headingStartingPos - 80;

  if (heading.length) {
    ctx.font = `${
      typography.scale.headline[getSize(heading.length)].fontSize
    }px ${typography.headline.primary.fontFamily}`;
    ctx.lineHeight = `${
      typography.scale.headline[getSize(heading.length)].lineHeight
    }px`;

    ctx.fillStyle = fgDefault(theme);
    ctx.textAlign = align;

    wrappedText = wrapText(
      ctx,
      heading,
      32,
      headingStartingPos,
      canvas.width - 160,
      Number(typography.scale.headline[getSize(heading.length)].lineHeight)
    );
    wrappedText[0].forEach(function (item) {
      // We will fill our text which is item[0] of our array, at coordinates [x, y]
      // x will be item[1] of our array
      // y will be item[2] of our array, minus the line height (wrappedText[1]), minus the height of the emoji (200px)
      ctx.fillText(item[0], startPosition, item[2] - wrappedText[1] - 200); // 200 is height of an emoji
    });
  }

  // Add our subheading text to the canvas
  if (subheading.length) {
    ctx.font = `${typography.scale.headline["2xs"].fontSize}px ${typography.headline.secondary.fontFamily}`;
    ctx.lineHeight = `${typography.scale.headline["2xs"].lineHeight}px`;

    ctx.save();
    const angle = (45 * Math.PI) / 180;
    const x2 = width * Math.cos(angle);
    const y2 = height * Math.sin(angle);
    let textGradient = ctx.createLinearGradient(0, canvasHeight, x2, y2);

    textGradient.addColorStop(0, "#D2A8FF");
    textGradient.addColorStop(0.5, "#F778BA");
    textGradient.addColorStop(1, "#FF7B72");

    ctx.fillStyle = textGradient;

    ctx.fillText(
      subheading,
      startPosition,
      subheadingStartingPos - wrappedText[1] - 200
    );
    ctx.restore();
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

  /**
   * One speaker
   */
  if (numSpeakers === 1) {
    ctx.save();
    ctx.font = `${typography.scale.headline["xs"].fontSize}px ${typography.headline.tertiary.fontFamily}`;
    ctx.fillStyle = fgDefault(theme);
    ctx.lineHeight = `${typography.scale.headline["xs"].lineHeight}px`;

    const speakerOneTitle =
      speakerData[0].first_name + " " + speakerData[0].last_name;
    ctx.fillText(speakerOneTitle, startPosition, subheadingStartingPos - 10);
    ctx.restore();
  }

  /**
   * 1+ speakers
   */
  if (numSpeakers > 1) {
    const avatarRadius = 28;
    const maxWidth = 260;
    const avatarTextSpacing = 40;

    ctx.save();

    const centeredStartPos = startPosition / 3.5;
    const speakerNameStartPos =
      align === "center" ? centeredStartPos : startPosition;
    const posCompanyStartPos =
      align === "center" ? centeredStartPos + 6 : startPosition;
    const avatarStartPos =
      align === "center" ? centeredStartPos - 70 : startPosition;
    // loop speakerData array with for loop, draw each speaker horizontally next to each other
    for (let i = 0; i < speakerData.length; i++) {
      const speakerTitle =
        speakerData[i].first_name + " " + speakerData[i].last_name;
      ctx.font = `${typography.scale.headline["5xs"].fontSize}px ${typography.headline.tertiary.fontFamily}`;
      ctx.fillStyle = fgDefault(theme);
      ctx.lineHeight = `${typography.scale.headline["5xs"].lineHeight}px`;
      ctx.fillText(
        speakerTitle,
        speakerNameStartPos + i * maxWidth + (avatarTextSpacing + avatarRadius),
        subheadingStartingPos + 50
      );

      // draw speaker position
      ctx.font = `${typography.scale.headline["6xs"].fontSize}px ${typography.headline.tertiary.fontFamily}`;
      ctx.fillStyle = fgMuted(theme);
      ctx.lineHeight = `${typography.scale.headline["6xs"].lineHeight}px`;
      ctx.fillText(
        speakerData[i].position + " @ " + speakerData[i].company,
        posCompanyStartPos + i * maxWidth + (avatarTextSpacing + avatarRadius),
        subheadingStartingPos + 75
      );

      // ctx.beginPath();
      // ctx.arc(
      //   avatarStartPos + i * maxWidth + avatarRadius,
      //   subheadingStartingPos + 55,
      //   avatarRadius,
      //   0,
      //   2 * Math.PI
      // );
      // ctx.fillStyle = "#aaa";
      // ctx.fill();

      // draw avatar
      const avatar = await Canvas.loadImage(speakerData[i].avatar);
      const posX = avatarStartPos + i * maxWidth + avatarRadius;
      const posY = subheadingStartingPos + 55;
      const width = 55;
      ctx.save();
      ctx.beginPath();
      ctx.arc(posX, posY, width / 2, 0, Math.PI * 2, false);
      ctx.strokeStyle = "fgDefault(theme)";
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(
        avatar,
        avatarStartPos + i * maxWidth + avatarRadius - width / 2,
        posY - width / 2,
        width,
        width
      );

      ctx.restore();
    }

    ctx.restore();
  }

  // Add our event_date text to the canvas if it exists
  if (size.typePairing !== "m" && event_date.length) {
    ctx.font = `${typography.scale.headline["2xs"].fontSize}px ${typography.headline.tertiary.fontFamily}`;
    ctx.fillStyle = fgMuted(theme);
    ctx.lineHeight = `${typography.scale.headline["2xs"].lineHeight}px`;
    const eventDatePosY =
      subheadingStartingPos - 10 + (numSpeakers === 1 ? 50 : -30);

    ctx.fillText(event_date, startPosition, eventDatePosY);
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
