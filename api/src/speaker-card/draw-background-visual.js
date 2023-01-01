import Canvas from "@napi-rs/canvas";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @param {Object} gradientFill
 * @param {string} gradientFill.theme
 * @param {CanvasRenderingContext2D} gradientFill.ctx
 * @returns {Promise<void>}
 */
export const drawBackgroundVisual = async function ({
  theme,
  canvas,
  canvasHeight,
}) {
  const ctx = canvas.getContext("2d");

  let gradientColors;

  if (theme === "dark") {
    gradientColors = ["#1B1F24", "#1B1F24"];
  } else if (theme === "light") {
    gradientColors = ["#ffffff", "#ffffff"];
  } else {
    gradientColors = ["#1B1F24", "#1B1F24"];
  }

  // Add gradient - we use createLinearGradient to do this
  let grd = ctx.createLinearGradient(0, canvasHeight, 1200, 0);
  grd.addColorStop(0, gradientColors[0]);
  grd.addColorStop(1, gradientColors[1]);
  ctx.fillStyle = grd;
  // Fill our gradient
  ctx.fillRect(0, 0, 1200, canvasHeight);

  if (
    ["analog", "policy", "universe", "copilot", "education"].includes(theme)
  ) {
    const bgTheme = await Canvas.loadImage(
      path.resolve(__dirname, `../assets/${theme}.png`)
    );
    ctx.drawImage(bgTheme, 0, 0, canvas.width, canvas.height);
  }

  if (theme === "custom") {
    ctx.save();
    const bgTheme = await Canvas.loadImage(
      path.resolve(__dirname, `../assets/${theme}.svg`)
    );
    ctx.globalAlpha = 0.1; // configurable opactity
    ctx.scale(0.5, 0.5);
    ctx.drawImage(bgTheme, 0, 0, canvas.width * 2, canvas.height * 2);
    ctx.restore();

    // start gardient 1
    ctx.globalCompositeOperation = "soft-light"; // configurable blend mode
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "cyan");
    gradient.addColorStop(1, "green");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over"; // reset blend mode
    // end gardient 1
  }
};
